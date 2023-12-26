registerProcessor("level-meter-processor", class extends AudioWorkletProcessor {
  constructor() {
    super();

    this.T = 1 / sampleRate;
    this.bufferTime = 0.05; // s
    this.bufferLength = Math.floor(this.bufferTime / this.T);
    this.buffer_L = new Float32Array(this.bufferLength);
    this.buffer_R = new Float32Array(this.bufferLength);
    this.bufferPtrHead = 0;
    this.bufferPtrTail = 1;

    this.truePeak_L = 0;
    this.truePeak_R = 0;

    this.squareSum_L = 0;
    this.squareSum_R = 0;
    this.meanSquare_L = 0;
    this.meanSquare_R = 0;
    this.rms_L = 0;
    this.rms_R = 0;

    this.port.onmessage = (event) => {
      switch (event.data.type) {
        case 'getTruePeak':
          this.port.postMessage({ type: 'truePeak', value: [this.truePeak_L, this.truePeak_R] });
          break;
        case 'getRMS':
          this.port.postMessage({ type: 'RMS', value: [this.rms_L, this.rms_R] });
          break;
        default:
          break;
      }
    };
  }

  process(inputs, outputs, parameters) {
    const input_L = inputs[0][0];
    const input_R = inputs[0][1];

    for (let i = 0; i < input_L.length; i++) {
      const abs_L = Math.abs(input_L[i]);
      const abs_R = Math.abs(input_R[i]);

      // 更新缓冲区
      const old_L = this.buffer_L[this.bufferPtrHead];
      const old_R = this.buffer_R[this.bufferPtrHead];
      this.buffer_L[this.bufferPtrHead] = abs_L;
      this.buffer_R[this.bufferPtrHead] = abs_R;

      // compute true peak
      // if (abs_L > this.truePeak_L) { this.truePeak_L = abs_L; }
      // else if (this.truePeak_L === old_L) { this.truePeak_L = Math.max(...this.buffer_L); }
      // if (abs_R > this.truePeak_R) { this.truePeak_R = abs_R; }
      // else if (this.truePeak_R === old_R) { this.truePeak_R = Math.max(...this.buffer_R); }
      this.truePeak_L = abs_L;
      this.truePeak_R = abs_R;

      // compute rms
      this.squareSum_L = this.squareSum_L + abs_L ** 2 - this.buffer_L[this.bufferPtrTail] ** 2;
      this.squareSum_R = this.squareSum_R + abs_R ** 2 - this.buffer_R[this.bufferPtrTail] ** 2;
      this.meanSquare_L = this.squareSum_L / this.bufferLength;
      this.meanSquare_R = this.squareSum_R / this.bufferLength;
      this.rms_L = Math.sqrt(this.meanSquare_L);
      this.rms_R = Math.sqrt(this.meanSquare_R);

      // update pointer
      this.bufferPtrHead++;
      this.bufferPtrTail++;
      if (this.bufferPtrHead >= this.bufferLength) this.bufferPtrHead = 0;
      if (this.bufferPtrTail >= this.bufferLength) this.bufferPtrTail = 0;
    }
    return true;
  }
});