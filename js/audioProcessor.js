// Leslie效果器
registerProcessor("leslie-processor", class extends AudioWorkletProcessor {
  constructor() {
    super();


    //-----------------------------------------------------------------------------------------
    // 初始化必要参数
    this.T = 1 / sampleRate;  // s


    //-----------------------------------------------------------------------------------------
    // 初始化可调参数
    // rotor旋转模式参数
    this.rotorMode = 0; // 0: slow模式 1: fast模式
    this.isRotorBrakeOn = false; // 0: 旋转模式 1: 刹车模式
    // horn速度微调参数
    this.hornSpeedFineTune = 0; // %
    this.hornAccelerationFineTune = 1; // x
    this.hornDecelerationFineTune = 1; // x
    // drum速度微调参数
    this.drumSpeedFineTune = 0; // %
    this.drumAccelerationFineTune = 1; // x
    this.drumDecelerationFineTune = 1; // x


    //-----------------------------------------------------------------------------------------
    // 控制rotor旋转的振荡器参数
    this.rotorSlowFrequency = 1; // Hz
    this.rotorFastFrequency = 6; // Hz
    // horn振荡器
    this.hornRotorFrequency = this.rotorSlowFrequency;
    this.hornRotorAngularAccelerationDefault = 4 * Math.PI; // rad/s^2
    this.hornRotorAngularDecelerationDefault = 3 * Math.PI; // rad/s^2
    this.hornRotorAngularAcceleration = 0; // rad/s^2
    this.hornRotorAngularDeceleration = 0; // rad/s^2
    this.hornRotorCurrentAngularSpeed = 0; // rad/s
    // this.hornRotorAngularSpeedTarget = 0; // rad/s
    this.hornRotorInstantPhase = Math.random(); // rad
    // this.hornRotorInstantPhase = 0; // rad
    // drum振荡器
    this.drumRotorFrequency = this.rotorSlowFrequency;
    this.drumRotorAngularAccelerationDefault = 2 * Math.PI; // rad/s^2
    this.drumRotorAngularDecelerationDefault = 0.5 * Math.PI; // rad/s^2
    this.drumRotorAngularAcceleration = 0; // rad/s^2
    this.drumRotorAngularDeceleration = 0; // rad/s^2
    this.drumRotorCurrentAngularSpeed = 0; // rad/s
    // this.drumRotorAngularSpeedTarget = 0; // rad/s
    this.drumRotorInstantPhase = Math.random(); // rad
    // this.drumRotorInstantPhase = 0; // rad


    //-----------------------------------------------------------------------------------------
    // FM与AM参数
    this.globalAmDepth = 0.35; // % 0~1
    this.globalFmDepth = 1; // %

    this.hornLength = 0.37; // m
    this.drumLength = 0.35; // m
    this.soundSpeed = 340; // m/s
    this.hornFmDepth = this.globalFmDepth * this.hornLength / this.soundSpeed * sampleRate; // samples
    this.drumFmDepth = this.globalFmDepth * this.drumLength / this.soundSpeed * sampleRate; // samples


    //-----------------------------------------------------------------------------------------
    // 用于duopler效应的延迟线
    this.delayLineLength = Math.round(1.0 * sampleRate);
    this.hornDelayLine = new Float32Array(this.delayLineLength);
    this.drumDelayLine = new Float32Array(this.delayLineLength);
    this.hornDelayLineReadPointerMid = 0;
    this.drumDelayLineReadPointerMid = 0;
    this.hornDelayLineWptr = 0;
    this.drumDelayLineWptr = 0;

    //-----------------------------------------------------------------------------------------
    // mic参数
    this.hornMicWidth = Math.PI / 4; // rad
    this.drumMicWidth = Math.PI / 4; // rad

    this.correlationBufferLength = Math.round(0.3 * sampleRate);
    this.hornCorrelationBuffer_L = new Float32Array(this.correlationBufferLength);
    this.hornCorrelationBuffer_R = new Float32Array(this.correlationBufferLength);
    this.drumCorrelationBuffer_L = new Float32Array(this.correlationBufferLength);
    this.drumCorrelationBuffer_R = new Float32Array(this.correlationBufferLength);
    this.correlationBufferPointerHead = 0;
    this.correlationBufferPointerEnd = 1;
    this.hornMicNormSquare_L = 0;
    this.hornMicNormSquare_R = 0;
    this.hornMicDotProduct = 0;
    this.hornMicCorrelation = 1;
    this.drumMicNormSquare_L = 0;
    this.drumMicNormSquare_R = 0;
    this.drumMicDotProduct = 0;
    this.drumMicCorrelation = 1;



    //-----------------------------------------------------------------------------------------
    // 初始化MessagePort
    this.port.onmessage = (event) => {
      switch (event.data.type) {
        case 'getRotorInstantDegree':
          this.port.postMessage({ type: 'rotorInstantDegree', value: this.getCurrentRotorDegree() });
          break;
        case 'getRotorInstantRate':
          this.port.postMessage({ type: 'rotorInstantRate', value: this.getCurrentRotorFrequency() });
          break;
        case 'getMicCorrelation':
          this.port.postMessage({ type: 'micCorrelation', value: [this.hornMicCorrelation, this.drumMicCorrelation] });
          break;
        case 'setRotorMode':
          this.rotorMode = event.data.value;
          this.updateHornTargetSpeed();
          this.updateDrumTargetSpeed();
          break;
        case 'setRotorBrake':
          this.isRotorBrakeOn = event.data.value;
          this.updateHornTargetSpeed();
          this.updateDrumTargetSpeed();
          break;
        case 'setHornSpeedFineTune':
          this.hornSpeedFineTune = event.data.value;
          this.updateHornTargetSpeed();
          break;
        case 'setDrumSpeedFineTune':
          this.drumSpeedFineTune = event.data.value;
          this.updateDrumTargetSpeed();
          break;
        case 'setHornAccelerationFineTune':
          this.hornAccelerationFineTune = event.data.value;
          this.updateHornTargetSpeed();
          break;
        case 'setDrumAccelerationFineTune':
          this.drumAccelerationFineTune = event.data.value;
          this.updateDrumTargetSpeed();
          break;
        case 'setHornDecelerationFineTune':
          this.hornDecelerationFineTune = event.data.value;
          this.updateHornTargetSpeed();
          break;
        case 'setDrumDecelerationFineTune':
          this.drumDecelerationFineTune = event.data.value;
          this.updateDrumTargetSpeed();
          break;
        case 'setHornMicWidth':
          this.hornMicWidth = event.data.value;
          break;
        case 'setDrumMicWidth':
          this.drumMicWidth = event.data.value;
          break;
      }
    };

    //-----------------------------------------------------------------------------------------
    this.updateHornTargetSpeed();
    this.updateDrumTargetSpeed();
  }

  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  process(inputs, outputs, parameters) {
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 声道预处理
    const inputHorn = inputs[0];
    const inputDrum = inputs[1];
    const outputHorn_L = outputs[0];
    const outputHorn_R = outputs[1];
    const outputDrum_L = outputs[2];
    const outputDrum_R = outputs[3];
    const bufferSize = inputHorn[0].length;


    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 数据容器
    let inputHorn_L = 0;
    let inputHorn_R = 0;
    let inputHorn_M = 0;
    let inputDrum_L = 0;
    let inputDrum_R = 0;
    let inputDrum_M = 0;
    // horn左声道delayline中间参数
    let hornDistanceLFO_L = 0;
    let hornDelayTotalLength_L = 0;
    let hornDelayIntegralLength_L = 0;
    let hornDelayFractionalLength_L = 0;
    let hornAmAmpLeft = 1;
    // horn右声道delayline中间参数
    let hornDistanceLFO_R = 0;
    let hornDelayTotalLength_R = 0;
    let hornDelayIntegralLength_R = 0;
    let hornDelayFractionalLength_R = 0;
    let hornAmAmpRight = 1;
    // drum左声道delayline中间参数
    let drumDistanceLFO_L = 0;
    let drumDelayTotalLength_L = 0;
    let drumDelayIntegralLength_L = 0;
    let drumDelayFractionalLength_L = 0;
    let drumAmAmp_L = 1;
    // drum右声道delayline中间参数
    let drumDistanceLFO_R = 0;
    let drumDelayTotalLength_R = 0;
    let drumDelayIntegralLength_R = 0;
    let drumDelayFractionalLength_R = 0;
    let drumAmAmp_R = 1;


    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    for (let i = 0; i < bufferSize; i++) {
      //-----------------------------------------------------------------------------------------
      // 读取音频样本
      inputHorn_L = inputHorn[0][i];
      inputHorn_R = inputHorn[1][i];
      inputDrum_L = inputDrum[0][i];
      inputDrum_R = inputDrum[1][i];
      //-----------------------------------------------------------------------------------------
      // 合并声道
      inputHorn_M = (inputHorn_L + inputHorn_R) / 2;
      inputDrum_M = (inputDrum_L + inputDrum_R) / 2;


      //-----------------------------------------------------------------------------------------
      // 更新horn振荡器状态
      if (Math.abs(this.hornRotorTargetAngularSpeed - this.hornRotorCurrentAngularSpeed) < 1e-7) { // 稳定状态
        this.hornRotorCurrentAngularSpeed = this.hornRotorTargetAngularSpeed;
      } else if (this.hornRotorCurrentAngularSpeed < this.hornRotorTargetAngularSpeed) { // 加速状态
        this.hornRotorCurrentAngularSpeed += this.hornRotorAngularAcceleration * this.T;
      } else { // 减速状态
        this.hornRotorCurrentAngularSpeed -= this.hornRotorAngularDeceleration * this.T;
      }
      this.hornRotorInstantPhase -= this.hornRotorCurrentAngularSpeed * this.T;
      if (this.hornRotorInstantPhase < 0) { this.hornRotorInstantPhase += 2 * Math.PI; }


      //-----------------------------------------------------------------------------------------
      // 更新drum振荡器状态
      if (Math.abs(this.drumRotorTargetAngularSpeed - this.drumRotorCurrentAngularSpeed) < 1e-7) { // 稳定状态
        this.drumRotorCurrentAngularSpeed = this.drumRotorTargetAngularSpeed;
      } else if (this.drumRotorCurrentAngularSpeed < this.drumRotorTargetAngularSpeed) { // 加速状态
        this.drumRotorCurrentAngularSpeed += this.drumRotorAngularAcceleration * this.T;
      } else { // 减速状态
        this.drumRotorCurrentAngularSpeed -= this.drumRotorAngularDeceleration * this.T;
      }
      this.drumRotorInstantPhase += this.drumRotorCurrentAngularSpeed * this.T;
      if (this.drumRotorInstantPhase > 2 * Math.PI) { this.drumRotorInstantPhase -= 2 * Math.PI; }


      //-----------------------------------------------------------------------------------------
      // 计算振荡器输出（distance）
      const phaseOffset = - Math.PI / 2;
      hornDistanceLFO_L = Math.sin(this.hornRotorInstantPhase + phaseOffset - this.hornMicWidth);
      hornDistanceLFO_R = Math.sin(this.hornRotorInstantPhase + phaseOffset + this.hornMicWidth);
      drumDistanceLFO_L = Math.sin(this.drumRotorInstantPhase + phaseOffset - this.drumMicWidth);
      drumDistanceLFO_R = Math.sin(this.drumRotorInstantPhase + phaseOffset + this.drumMicWidth);


      //-----------------------------------------------------------------------------------------
      // 计算duopler效应必要参数(即延时长度)
      // horn左mic
      hornDelayTotalLength_L = (hornDistanceLFO_L + 1) / 2 * this.hornFmDepth;
      hornDelayIntegralLength_L = Math.floor(hornDelayTotalLength_L);
      hornDelayFractionalLength_L = hornDelayTotalLength_L - hornDelayIntegralLength_L;
      // horn右mic
      hornDelayTotalLength_R = (hornDistanceLFO_R + 1) / 2 * this.hornFmDepth;
      hornDelayIntegralLength_R = Math.floor(hornDelayTotalLength_R);
      hornDelayFractionalLength_R = hornDelayTotalLength_R - hornDelayIntegralLength_R;
      // drum左mic
      drumDelayTotalLength_L = (drumDistanceLFO_L + 1) / 2 * this.drumFmDepth;
      drumDelayIntegralLength_L = Math.floor(drumDelayTotalLength_L);
      drumDelayFractionalLength_L = drumDelayTotalLength_L - drumDelayIntegralLength_L;
      // drum右mic
      drumDelayTotalLength_R = (drumDistanceLFO_R + 1) / 2 * this.drumFmDepth;
      drumDelayIntegralLength_R = Math.floor(drumDelayTotalLength_R);
      drumDelayFractionalLength_R = drumDelayTotalLength_R - drumDelayIntegralLength_R;


      //-----------------------------------------------------------------------------------------
      // 将当前样本写入输入缓冲区
      this.hornDelayLine[this.hornDelayLineWptr] = inputHorn_M;
      this.drumDelayLine[this.drumDelayLineWptr] = inputDrum_M;


      //-----------------------------------------------------------------------------------------
      // 根据延时整数值计算读指针位置
      // horn左声道
      this.hornDelayLineRptr_L = this.hornDelayLineWptr - hornDelayIntegralLength_L;
      if (this.hornDelayLineRptr_L < 0) { this.hornDelayLineRptr_L += this.delayLineLength; }
      // horn右声道
      this.hornDelayLineReadPtr_R = this.hornDelayLineWptr - hornDelayIntegralLength_R;
      if (this.hornDelayLineReadPtr_R < 0) { this.hornDelayLineReadPtr_R += this.delayLineLength; }

      // drum左声道
      this.drumDelayLineRptr_L = this.drumDelayLineWptr - drumDelayIntegralLength_L;
      if (this.drumDelayLineRptr_L < 0) { this.drumDelayLineRptr_L += this.delayLineLength; }
      // drum右声道
      this.drumDelayLineRptr_R = this.drumDelayLineWptr - drumDelayIntegralLength_R;
      if (this.drumDelayLineRptr_R < 0) { this.drumDelayLineRptr_R += this.delayLineLength; }


      //-----------------------------------------------------------------------------------------
      // 一阶线性插值
      // horn左声道
      let hornDelayLineRptrBackward1_L = this.hornDelayLineRptr_L - 1;
      if (hornDelayLineRptrBackward1_L < 0) { hornDelayLineRptrBackward1_L += this.delayLineLength; }
      inputHorn_L = (1 - hornDelayFractionalLength_L) * this.hornDelayLine[this.hornDelayLineRptr_L] + hornDelayFractionalLength_L * this.hornDelayLine[hornDelayLineRptrBackward1_L];
      // horn右声道
      let hornDelayLineReadPointerRightBackward1 = this.hornDelayLineReadPtr_R - 1;
      if (hornDelayLineReadPointerRightBackward1 < 0) { hornDelayLineReadPointerRightBackward1 += this.delayLineLength; }
      inputHorn_R = (1 - hornDelayFractionalLength_R) * this.hornDelayLine[this.hornDelayLineReadPtr_R] + hornDelayFractionalLength_R * this.hornDelayLine[hornDelayLineReadPointerRightBackward1];

      // drum左声道
      let drumDelayLineRptrBackward1_L = this.drumDelayLineRptr_L - 1;
      if (drumDelayLineRptrBackward1_L < 0) { drumDelayLineRptrBackward1_L += this.delayLineLength; }
      inputDrum_L = (1 - drumDelayFractionalLength_L) * this.drumDelayLine[this.drumDelayLineRptr_L] + drumDelayFractionalLength_L * this.drumDelayLine[drumDelayLineRptrBackward1_L];
      // drum右声道
      let drumDelayLineReadPointerRightBackward1 = this.drumDelayLineRptr_R - 1;
      if (drumDelayLineReadPointerRightBackward1 < 0) { drumDelayLineReadPointerRightBackward1 += this.delayLineLength; }
      inputDrum_R = (1 - drumDelayFractionalLength_R) * this.drumDelayLine[this.drumDelayLineRptr_R] + drumDelayFractionalLength_R * this.drumDelayLine[drumDelayLineReadPointerRightBackward1];


      //-----------------------------------------------------------------------------------------
      // 更新延时线写指针
      this.hornDelayLineWptr++;
      this.drumDelayLineWptr++;
      if (this.hornDelayLineWptr > this.delayLineLength - 1) { this.hornDelayLineWptr = 0; }
      if (this.drumDelayLineWptr > this.delayLineLength - 1) { this.drumDelayLineWptr = 0; }


      //-----------------------------------------------------------------------------------------
      // 应用AM
      // horn左声道
      hornAmAmpLeft = 0.5 * this.globalAmDepth * (-hornDistanceLFO_L - 1) + 1;
      inputHorn_L *= hornAmAmpLeft;
      // horn右声道
      hornAmAmpRight = 0.5 * this.globalAmDepth * (-hornDistanceLFO_R - 1) + 1;
      inputHorn_R *= hornAmAmpRight;

      // drum左声道
      drumAmAmp_L = 0.5 * this.globalAmDepth * (-drumDistanceLFO_L - 1) + 1;
      inputDrum_L *= drumAmAmp_L;
      // drum右声道
      drumAmAmp_R = 0.5 * this.globalAmDepth * (-drumDistanceLFO_R - 1) + 1;
      inputDrum_R *= drumAmAmp_R;


      //-----------------------------------------------------------------------------------------
      // 保存当前值用于计算mic correlation
      this.hornCorrelationBuffer_L[this.correlationBufferPointerHead] = inputHorn_L;
      this.hornCorrelationBuffer_R[this.correlationBufferPointerHead] = inputHorn_R;
      this.drumCorrelationBuffer_L[this.correlationBufferPointerHead] = inputDrum_L;
      this.drumCorrelationBuffer_R[this.correlationBufferPointerHead] = inputDrum_R;

      this.hornMicNormSquare_L = this.hornMicNormSquare_L + inputHorn_L ** 2 - this.hornCorrelationBuffer_L[this.correlationBufferPointerEnd] ** 2;
      this.hornMicNormSquare_R = this.hornMicNormSquare_R + inputHorn_R ** 2 - this.hornCorrelationBuffer_R[this.correlationBufferPointerEnd] ** 2;
      this.hornMicNorm_L = Math.sqrt(this.hornMicNormSquare_L);
      this.hornMicNorm_R = Math.sqrt(this.hornMicNormSquare_R);
      this.hornMicDotProduct = this.hornMicDotProduct + inputHorn_L * inputHorn_R - this.hornCorrelationBuffer_L[this.correlationBufferPointerEnd] * this.hornCorrelationBuffer_R[this.correlationBufferPointerEnd];
      this.hornMicCorrelation = this.hornMicDotProduct / (this.hornMicNorm_L * this.hornMicNorm_R);
      if (this.hornMicCorrelation > 1) this.hornMicCorrelation = 1;
      else if (this.hornMicCorrelation < -1) this.hornMicCorrelation = -1;
      else if (isNaN(this.hornMicCorrelation)) this.hornMicCorrelation = 0;

      this.drumMicNormSquare_L = this.drumMicNormSquare_L + inputDrum_L ** 2 - this.drumCorrelationBuffer_L[this.correlationBufferPointerEnd] ** 2;
      this.drumMicNormSquare_R = this.drumMicNormSquare_R + inputDrum_R ** 2 - this.drumCorrelationBuffer_R[this.correlationBufferPointerEnd] ** 2;
      this.drumMicNorm_L = Math.sqrt(this.drumMicNormSquare_L);
      this.drumMicNorm_R = Math.sqrt(this.drumMicNormSquare_R);
      this.drumMicDotProduct = this.drumMicDotProduct + inputDrum_L * inputDrum_R - this.drumCorrelationBuffer_L[this.correlationBufferPointerEnd] * this.drumCorrelationBuffer_R[this.correlationBufferPointerEnd];
      if (Math.abs(this.drumMicNorm_L) < 1e-6 || Math.abs(this.drumMicNorm_R) < 1e-6) {
        this.drumMicCorrelation = 0;
      } else {
        this.drumMicCorrelation = this.drumMicDotProduct / (this.drumMicNorm_L * this.drumMicNorm_R);
        if (this.drumMicCorrelation > 1) this.drumMicCorrelation = 1;
        else if (this.drumMicCorrelation < -1) this.drumMicCorrelation = -1;
        else if (isNaN(this.drumMicCorrelation)) this.drumMicCorrelation = 0;
      }

      if (this.correlationBufferPointerHead === this.correlationBufferLength - 1) {
        this.correlationBufferPointerHead = 0;
        this.correlationBufferPointerEnd++;
      } else if (this.correlationBufferPointerEnd === this.correlationBufferLength - 1) {
        this.correlationBufferPointerEnd = 0;
        this.correlationBufferPointerHead++;
      } else {
        this.correlationBufferPointerHead++;
        this.correlationBufferPointerEnd++;
      }


      //-----------------------------------------------------------------------------------------
      // 写入音频样本
      outputHorn_L[0][i] = inputHorn_L;
      outputHorn_L[1][i] = inputHorn_L;
      outputHorn_R[0][i] = inputHorn_R;
      outputHorn_R[1][i] = inputHorn_R;
      outputDrum_L[0][i] = inputDrum_L;
      outputDrum_L[1][i] = inputDrum_L;
      outputDrum_R[0][i] = inputDrum_R;
      outputDrum_R[1][i] = inputDrum_R;
    }

    return true;
  }

  getCurrentRotorDegree() {
    const hornDegree = 360 / (2 * Math.PI) * this.hornRotorInstantPhase;
    const drumDegree = 360 / (2 * Math.PI) * this.drumRotorInstantPhase;
    return [hornDegree, drumDegree];
  }

  getCurrentRotorFrequency() {
    const hornFrequency = this.hornRotorCurrentAngularSpeed / (2 * Math.PI);
    const drumFrequency = this.drumRotorCurrentAngularSpeed / (2 * Math.PI);
    return [hornFrequency, drumFrequency];
  }

  updateHornTargetSpeed() {
    if (this.isRotorBrakeOn === false) { // 旋转模式
      // 计算rotor目标频率
      if (this.rotorMode === 0) { // slow模式
        this.hornRotorFrequency = (this.rotorSlowFrequency + 0.11) * (1 + this.hornSpeedFineTune / 100); // 由于horn质量较小，故在慢速模式下，horn的转速比drum快0.11Hz
      } else if (this.rotorMode === 1) { // fast模式
        this.hornRotorFrequency = this.rotorFastFrequency * (1 + this.hornSpeedFineTune / 100);
      }
      // 计算rotor目标角加速度
      this.hornRotorAngularAcceleration = this.hornRotorAngularAccelerationDefault * this.hornAccelerationFineTune;
      this.hornRotorAngularDeceleration = this.hornRotorAngularDecelerationDefault * this.hornDecelerationFineTune;
    }
    else if (this.isRotorBrakeOn === true) { // 刹车模式
      this.hornRotorFrequency = 0;
      this.hornRotorAngularDeceleration = 2 * this.hornRotorAngularDecelerationDefault;
    }
    // 更新rotor目标角速度
    this.hornRotorTargetAngularSpeed = 2 * Math.PI * this.hornRotorFrequency;
  }

  updateDrumTargetSpeed() {
    if (this.isRotorBrakeOn === false) { // 旋转模式
      // 计算rotor目标频率
      if (this.rotorMode === 0) { // slow模式
        this.drumRotorFrequency = this.rotorSlowFrequency * (1 + this.drumSpeedFineTune / 100);
      } else if (this.rotorMode === 1) { // fast模式
        this.drumRotorFrequency = (this.rotorFastFrequency - 0.11) * (1 + this.drumSpeedFineTune / 100); // 由于drum质量较大，故在快速模式下，drum的转速比horn慢0.11Hz
      }
      // 计算rotor目标角加速度
      this.drumRotorAngularAcceleration = this.drumRotorAngularAccelerationDefault * this.drumAccelerationFineTune;
      this.drumRotorAngularDeceleration = this.drumRotorAngularDecelerationDefault * this.drumDecelerationFineTune;
    }
    else if (this.isRotorBrakeOn === true) { // 刹车模式
      this.drumRotorFrequency = 0;
      this.drumRotorAngularDeceleration = 2 * this.drumRotorAngularDecelerationDefault;
    }
    // 更新rotor目标角速度
    this.drumRotorTargetAngularSpeed = 2 * Math.PI * this.drumRotorFrequency;
  }
});