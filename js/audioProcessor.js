// 白噪声生成器
registerProcessor('white-noise-generator', class extends AudioWorkletProcessor {
  constructor() { super(); }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const channelCount = output.length;

    for (let channel = 0; channel < channelCount; channel++) {
      const outputChannel = output[channel];
      const channelLength = outputChannel.length;

      for (let i = 0; i < channelLength; i++) {
        outputChannel[i] = Math.random() * 2 - 1;
      }
    }
    return true;
  }
});

// IIR低通滤波器
registerProcessor('low-pass-filter', class extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{
      name: 'cutoff',
      defaultValue: 1000,
      minValue: 20,
      maxValue: 20000
    }];
  }

  constructor() {
    super();
    this.lastSample = 0;
  }

  process(inputList, outputsList, parameters) {
    const input = inputList[0];
    const output = outputsList[0];
    const channelCount = output.length;
    const cutoff = parameters.cutoff;

    for (let channel = 0; channel < channelCount; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];
      const length = outputChannel.length;

      for (let i = 0; i < length; i++) {
        outputChannel[i] = this.lastSample + cutoff * (inputChannel[i] - this.lastSample);
        this.lastSample = outputChannel[i];
      }
    }
  }
});

// Leslie效果器
registerProcessor("leslie-processor", class extends AudioWorkletProcessor {
  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  // 定义可调参数
  static get parameterDescriptors() {
    return [{
      name: 'rotorMode',
      defaultValue: 0,
      minValue: 0,
      maxValue: 2,
      automationRate: 'k-rate'
    }, {
      name: 'slowSpeed',
      defaultValue: 0,
      minValue: -100,
      maxValue: 100,
      automationRate: 'k-rate'
    }, {
      name: 'fastSpeed',
      defaultValue: 0,
      minValue: -100,
      maxValue: 100,
      automationRate: 'k-rate'
    }, {
      name: 'acceleration',
      defaultValue: 1,
      minValue: 0.25,
      maxValue: 4,
      automationRate: 'k-rate'
    }, {
      name: 'deceleration',
      defaultValue: 1,
      minValue: 0.25,
      maxValue: 4,
      automationRate: 'k-rate'
    }, {
      name: 'outputGain',
      defaultValue: 0,
      minValue: -200,
      maxValue: 6,
      automationRate: 'k-rate'
    }];
  }

  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  constructor() {
    super();

    //-----------------------------------------------------------------------------------------
    // 初始化必要参数
    this.T = 1 / sampleRate;  // s

    //-----------------------------------------------------------------------------------------
    // 定义控制rotor旋转的低频振荡器的参数
    this.rotorSlowFrequency = 2; // Hz
    this.rotorFastFrequency = 6; // Hz
    this.rotorFrequency = this.rotorSlowFrequency;
    this.rotorAngularAcceleration = 3; // rad/s^2
    this.rotorAngularDeceleration = 3; // rad/s^2
    this.rotorAngularSpeed = 0; // rad/s
    this.rotorAngularSpeedTarget = 0; // rad/s
    this.rotorInstantPhase = 0; // rad

    //-----------------------------------------------------------------------------------------
    // 初始化MessagePort
    this.port.onmessage = (event) => {
      if (event.data.type === 'rotorInstantDegree') {
        this.port.postMessage({ type: 'rotorInstantDegree', value: this.getCurrentRotorDegree() });
      }
    };
  }

  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  process(inputs, outputs, parameters) {
    //-----------------------------------------------------------------------------------------
    // 接收参数
    const rotorMode = parameters.rotorMode[0];
    const slowSpeedFineTune = parameters.slowSpeed[0];
    const fastSpeedFineTune = parameters.fastSpeed[0];
    const acceleration = parameters.acceleration[0];
    const deceleration = parameters.deceleration[0];
    const outputGain = parameters.outputGain[0];

    //-----------------------------------------------------------------------------------------
    // 更新rotor振荡器模式
    if (rotorMode === 0) { this.rotorFrequency = this.rotorSlowFrequency * (1 + slowSpeedFineTune / 100); }
    else if (rotorMode === 1) { this.rotorFrequency = this.rotorFastFrequency * (1 + fastSpeedFineTune / 100); }
    this.rotorAngularSpeedTarget = 2 * Math.PI * this.rotorFrequency;

    //-----------------------------------------------------------------------------------------
    // 更新内部参数
    const outputAmp = Math.pow(10, outputGain / 20);

    //-----------------------------------------------------------------------------------------
    // 只处理第一个源
    const input = inputs[0];
    const output = outputs[0];
    const inputChannelCount = input.length;
    const outputChannelCount = output.length;
    const bufferSize = input[0].length;

    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // stetro -> stereo
    if (inputChannelCount === 2 && outputChannelCount === 2) {
      let inputMono = 0;
      for (let i = 0; i < bufferSize; i++) {
        //-----------------------------------------------------------------------------------------
        // 更新rotor振荡器参数
        if (this.rotorAngularSpeed < this.rotorAngularSpeedTarget) {
          this.rotorAngularSpeed += this.rotorAngularAcceleration * this.T;
        } else if (this.rotorAngularSpeed > this.rotorAngularSpeedTarget) {
          this.rotorAngularSpeed -= this.rotorAngularDeceleration * this.T;
        }

        this.rotorInstantPhase += this.rotorAngularSpeed * this.T;
        if (this.rotorInstantPhase > 2 * Math.PI) { this.rotorInstantPhase -= 2 * Math.PI; }

        //-----------------------------------------------------------------------------------------
        // 合并声道
        inputMono = (input[0][i] + input[1][i]) / 2;

        //-----------------------------------------------------------------------------------------
        // 处理
        output[0][i] = outputAmp * input[0][i];

        //-----------------------------------------------------------------------------------------
        // 拷贝声道
        output[1][i] = output[0][i];
      }
    }
    // mono -> stereo
    else if (inputChannelCount === 1 && outputChannelCount === 2) {

    }

    return true;
  }

  getCurrentRotorDegree() {
    return 360 * this.rotorInstantPhase / (2 * Math.PI);
  }
});
