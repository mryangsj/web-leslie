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
      name: 'rotorBrake',
      defaultValue: 0,
      minValue: 0,
      maxValue: 1,
      automationRate: 'k-rate'
    }, {
      name: 'hornSlowSpeed',
      defaultValue: 0,
      minValue: -100,
      maxValue: 100,
      automationRate: 'k-rate'
    }, {
      name: 'hornFastSpeed',
      defaultValue: 0,
      minValue: -100,
      maxValue: 100,
      automationRate: 'k-rate'
    }, {
      name: 'hornAcceleration',
      defaultValue: 1,
      minValue: 0.25,
      maxValue: 4,
      automationRate: 'k-rate'
    }, {
      name: 'hornDeceleration',
      defaultValue: 1,
      minValue: 0.25,
      maxValue: 4,
      automationRate: 'k-rate'
    }, {
      name: 'drumSlowSpeed',
      defaultValue: 0,
      minValue: -100,
      maxValue: 100,
      automationRate: 'k-rate'
    }, {
      name: 'drumFastSpeed',
      defaultValue: 0,
      minValue: -100,
      maxValue: 100,
      automationRate: 'k-rate'
    }, {
      name: 'drumAcceleration',
      defaultValue: 1,
      minValue: 0.25,
      maxValue: 4,
      automationRate: 'k-rate'
    }, {
      name: 'drumDeceleration',
      defaultValue: 1,
      minValue: 0.25,
      maxValue: 4,
      automationRate: 'k-rate'
    }, {
      name: 'hornGain',
      defaultValue: 0,
      minValue: -200,
      maxValue: 6,
      automationRate: 'k-rate'
    }, {
      name: 'drumGain',
      defaultValue: 0,
      minValue: -200,
      maxValue: 6,
      automationRate: 'k-rate'
    },
    {
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
    // 控制rotor旋转的振荡器参数
    this.rotorSlowFrequency = 0.7; // Hz
    this.rotorFastFrequency = 6; // Hz
    // horn振荡器
    this.hornRotorFrequency = this.rotorSlowFrequency;
    this.hornRotorAngularAccelerationDefault = 4 * Math.PI; // rad/s^2
    this.hornRotorAngularDecelerationDefault = 3 * Math.PI; // rad/s^2
    this.hornRotorAngularAcceleration = 0; // rad/s^2
    this.hornRotorAngularDeceleration = 0; // rad/s^2
    this.hornRotorAngularSpeed = 0; // rad/s
    // this.hornRotorAngularSpeedTarget = 0; // rad/s
    this.hornRotorInstantPhase = Math.random(); // rad
    // this.hornRotorInstantPhase = 0; // rad
    // drum振荡器
    this.drumRotorFrequency = this.rotorSlowFrequency;
    this.drumRotorAngularAccelerationDefault = 2 * Math.PI; // rad/s^2
    this.drumRotorAngularDecelerationDefault = 0.5 * Math.PI; // rad/s^2
    this.drumRotorAngularAcceleration = 0; // rad/s^2
    this.drumRotorAngularDeceleration = 0; // rad/s^2
    this.drumRotorAngularSpeed = 0; // rad/s
    // this.drumRotorAngularSpeedTarget = 0; // rad/s
    this.drumRotorInstantPhase = Math.random(); // rad
    // this.drumRotorInstantPhase = 0; // rad

    //-----------------------------------------------------------------------------------------
    // FM与AM参数
    this.gloabalAmDepth = 0.5; // % 0~1
    this.gloabalFmDepth = 1; // %

    this.hornLength = 37; // cm
    this.drumLength = 35; // cm
    this.soundSpeed = 340; // m/s
    this.hornFmDepth = this.gloabalFmDepth * this.hornLength / 100 / this.soundSpeed * sampleRate; // samples
    this.drumFmDepth = this.gloabalFmDepth * this.drumLength / 100 / this.soundSpeed * sampleRate; // samples

    //-----------------------------------------------------------------------------------------
    // 用于duopler效应的延迟线
    this.delayLineLength = 100000;
    this.hornDelayLine = new Float32Array(this.delayLineLength);
    this.drumDelayLine = new Float32Array(this.delayLineLength);
    this.hornDelayLineReadPointerMid = 0;
    this.drumDelayLineReadPointerMid = 0;
    this.hornDelayLineWritePointer = 0;
    this.drumDelayLineWritePointer = 0;

    //-----------------------------------------------------------------------------------------
    // 初始化MessagePort
    this.port.onmessage = (event) => {
      if (event.data.type === 'rotorInstantDegree') {
        this.port.postMessage({ type: 'rotorInstantDegree', value: this.getCurrentRotorDegree() });
      } else if (event.data.type === 'rotorInstantRate') {
        this.port.postMessage({ type: 'rotorInstantRate', value: this.getCurrentRotorFrequency() });
      }
    };
  }

  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  process(inputs, outputs, parameters) {
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 声道预处理
    const inputHorn = inputs[0];
    const outputHorn = outputs[0];

    const inputDrum = inputs[1];
    const outputDrum = outputs[1];

    const bufferSize = inputHorn[0].length;

    let inputHornSampleL = 0;
    let inputHornSampleR = 0;
    let inputHornSampleMono = 0;

    let inputDrumSampleL = 0;
    let inputDrumSampleR = 0;
    let inputDrumSampleMono = 0;

    let outputHornSampleL = 0;
    let outputHornSampleR = 0;

    let outputDrumSampleL = 0;
    let outputDrumSampleR = 0;


    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 接收用户参数
    const rotorMode = parameters.rotorMode[0];
    const rotorBrake = parameters.rotorBrake[0];
    // horn速度微调参数
    const hornSlowSpeedFineTune = parameters.hornSlowSpeed[0];
    const hornFastSpeedFineTune = parameters.hornFastSpeed[0];
    const hornAccelerationFineTune = parameters.hornAcceleration[0];
    const hornDecelerationFineTune = parameters.hornDeceleration[0];
    // drum速度微调参数
    const drumSlowSpeedFineTune = parameters.drumSlowSpeed[0];
    const drumFastSpeedFineTune = parameters.drumFastSpeed[0];
    const drumAccelerationFineTune = parameters.drumAcceleration[0];
    const drumDecelerationFineTune = parameters.drumDeceleration[0];
    // mixer参数
    const hornGain = parameters.hornGain[0];
    const drumGain = parameters.drumGain[0];
    const outputGain = parameters.outputGain[0];


    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 数据容器
    let hornLFOMid = 0;
    let hornDelayLengthMid = 0;
    let hornDelayLengthIntMid = 0;
    let hornDelayLengthFracMid = 0;
    let hornAmAmpMid = 1;
    // horn左声道
    let hornLFOLeft = 0;
    let hornDelayLengthLeft = 0;
    let hornDelayLengthIntLeft = 0;
    let hornDelayLengthFracLeft = 0;
    let hornAmAmpLeft = 1;
    // horn右声道
    let hornLFORight = 0;
    let hornDelayLengthRight = 0;
    let hornDelayLengthIntRight = 0;
    let hornDelayLengthFracRight = 0;
    let hornAmAmpRight = 1;
    // drum中置声道
    let drumLFOMid = 0;
    let drumDelayLengthMid = 0;
    let drumDelayLengthIntMid = 0;
    let drumDelayLengthFracMid = 0;
    let drumAmAmpMid = 1;
    // drum左声道
    let drumLFOLeft = 0;
    let drumDelayLengthLeft = 0;
    let drumDelayLengthIntLeft = 0;
    let drumDelayLengthFracLeft = 0;
    let drumAmAmpLeft = 1;
    // drum右声道
    let drumLFORight = 0;
    let drumDelayLengthRight = 0;
    let drumDelayLengthIntRight = 0;
    let drumDelayLengthFracRight = 0;
    let drumAmAmpRight = 1;


    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    if (rotorBrake === 0) { // 旋转模式
      // 计算rotor目标频率
      if (rotorMode === 0) { // 慢速模式
        this.hornRotorFrequency = (this.rotorSlowFrequency + 0.11) * (1 + hornSlowSpeedFineTune / 100); // 由于horn质量较小，故在慢速模式下，horn的转速比drum快0.11Hz
        this.drumRotorFrequency = this.rotorSlowFrequency * (1 + drumSlowSpeedFineTune / 100);
      } else if (rotorMode === 1) { // 快速模式
        this.hornRotorFrequency = this.rotorFastFrequency * (1 + hornFastSpeedFineTune / 100);
        this.drumRotorFrequency = (this.rotorFastFrequency - 0.11) * (1 + drumFastSpeedFineTune / 100); // 由于drum质量较大，故在快速模式下，drum的转速比horn慢0.11Hz
      }
      // 计算rotor目标角加速度
      this.hornRotorAngularAcceleration = this.hornRotorAngularAccelerationDefault * hornAccelerationFineTune;
      this.hornRotorAngularDeceleration = this.hornRotorAngularDecelerationDefault * hornDecelerationFineTune;
      this.drumRotorAngularAcceleration = this.drumRotorAngularAccelerationDefault * drumAccelerationFineTune;
      this.drumRotorAngularDeceleration = this.drumRotorAngularDecelerationDefault * drumDecelerationFineTune;
    }
    //-----------------------------------------------------------------------------------------
    else if (rotorBrake === 1) { // 刹车模式
      this.hornRotorFrequency = 0;
      this.drumRotorFrequency = 0;
      this.hornRotorAngularDeceleration = 2 * this.hornRotorAngularDecelerationDefault;
      this.drumRotorAngularDeceleration = 2 * this.drumRotorAngularDecelerationDefault;
    }
    //-----------------------------------------------------------------------------------------
    // 更新rotor振荡器目标角速度
    this.hornRotorAngularSpeedTarget = 2 * Math.PI * (this.hornRotorFrequency);
    this.drumRotorAngularSpeedTarget = 2 * Math.PI * this.drumRotorFrequency;
    //-----------------------------------------------------------------------------------------
    // 更新mixer参数
    const hornAmp = Math.pow(10, hornGain / 20);
    const drumAmp = Math.pow(10, drumGain / 20);
    const outputAmp = Math.pow(10, outputGain / 20);


    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    for (let i = 0; i < bufferSize; i++) {
      //-----------------------------------------------------------------------------------------
      // 读取音频样本
      inputHornSampleL = inputHorn[0][i];
      inputHornSampleR = inputHorn[1][i];
      inputDrumSampleL = inputDrum[0][i];
      inputDrumSampleR = inputDrum[1][i];
      //-----------------------------------------------------------------------------------------
      // 合并声道
      inputHornSampleMono = (inputHornSampleL + inputHornSampleR) / 2;
      inputDrumSampleMono = (inputDrumSampleL + inputDrumSampleR) / 2;


      //-----------------------------------------------------------------------------------------
      // 更新horn振荡器状态
      if (Math.abs(this.hornRotorAngularSpeedTarget - this.hornRotorAngularSpeed) < 1e-8) { // 稳定状态
        this.hornRotorAngularSpeed = this.hornRotorAngularSpeedTarget;
      } else { // 非稳定状态
        if (this.hornRotorAngularSpeed < this.hornRotorAngularSpeedTarget) { // 加速状态
          this.hornRotorAngularSpeed += this.hornRotorAngularAcceleration * this.T;
        } else if (this.hornRotorAngularSpeed > this.hornRotorAngularSpeedTarget) { // 减速状态
          this.hornRotorAngularSpeed -= this.hornRotorAngularDeceleration * this.T;
        }
      }
      this.hornRotorInstantPhase -= this.hornRotorAngularSpeed * this.T;
      if (this.hornRotorInstantPhase < 0) { this.hornRotorInstantPhase += 2 * Math.PI; }


      //-----------------------------------------------------------------------------------------
      // 更新drum振荡器状态
      if (Math.abs(this.drumRotorAngularSpeedTarget - this.drumRotorAngularSpeed) < 1e-8) { // 稳定状态
        this.drumRotorAngularSpeed = this.drumRotorAngularSpeedTarget;
      } else { // 非稳定状态
        if (this.drumRotorAngularSpeed < this.drumRotorAngularSpeedTarget) { // 加速状态
          this.drumRotorAngularSpeed += this.drumRotorAngularAcceleration * this.T;
        } else if (this.drumRotorAngularSpeed > this.drumRotorAngularSpeedTarget) { // 减速状态
          this.drumRotorAngularSpeed -= this.drumRotorAngularDeceleration * this.T;
        }
      }
      this.drumRotorInstantPhase += this.drumRotorAngularSpeed * this.T;
      if (this.drumRotorInstantPhase > 2 * Math.PI) { this.drumRotorInstantPhase -= 2 * Math.PI; }


      //-----------------------------------------------------------------------------------------
      // 计算振荡器输出
      const globlePhaseOffset = - Math.PI / 2;
      hornLFOMid = Math.sin(this.hornRotorInstantPhase + globlePhaseOffset);
      hornLFOLeft = Math.sin(this.hornRotorInstantPhase + globlePhaseOffset - Math.PI / 2);
      hornLFORight = Math.sin(this.hornRotorInstantPhase + globlePhaseOffset + Math.PI / 2);

      drumLFOMid = Math.sin(this.drumRotorInstantPhase + globlePhaseOffset);
      drumLFOLeft = Math.sin(this.drumRotorInstantPhase + globlePhaseOffset - Math.PI / 2);
      drumLFORight = Math.sin(this.drumRotorInstantPhase + globlePhaseOffset + Math.PI / 2);


      //-----------------------------------------------------------------------------------------
      // 计算duopler效应必要参数(即延时长度)
      // horn中置声道
      hornDelayLengthMid = (hornLFOMid + 1) / 2 * this.hornFmDepth;
      hornDelayLengthIntMid = Math.floor(hornDelayLengthMid);
      hornDelayLengthFracMid = hornDelayLengthMid - hornDelayLengthIntMid;
      // horn左声道
      hornDelayLengthLeft = (hornLFOLeft + 1) / 2 * this.hornFmDepth;
      hornDelayLengthIntLeft = Math.floor(hornDelayLengthLeft);
      hornDelayLengthFracLeft = hornDelayLengthLeft - hornDelayLengthIntLeft;
      // horn右声道
      hornDelayLengthRight = (hornLFORight + 1) / 2 * this.hornFmDepth;
      hornDelayLengthIntRight = Math.floor(hornDelayLengthRight);
      hornDelayLengthFracRight = hornDelayLengthRight - hornDelayLengthIntRight;
      // drum中置声道
      drumDelayLengthMid = (drumLFOMid + 1) / 2 * this.drumFmDepth;
      drumDelayLengthIntMid = Math.floor(drumDelayLengthMid);
      drumDelayLengthFracMid = drumDelayLengthMid - drumDelayLengthIntMid;
      // drum左声道
      drumDelayLengthLeft = (drumLFOLeft + 1) / 2 * this.drumFmDepth;
      drumDelayLengthIntLeft = Math.floor(drumDelayLengthLeft);
      drumDelayLengthFracLeft = drumDelayLengthLeft - drumDelayLengthIntLeft;
      // drum右声道
      drumDelayLengthRight = (drumLFORight + 1) / 2 * this.drumFmDepth;
      drumDelayLengthIntRight = Math.floor(drumDelayLengthRight);
      drumDelayLengthFracRight = drumDelayLengthRight - drumDelayLengthIntRight;


      //-----------------------------------------------------------------------------------------
      // 将当前样本写入输入缓冲区
      this.hornDelayLine[this.hornDelayLineWritePointer] = inputHornSampleMono;
      this.drumDelayLine[this.drumDelayLineWritePointer] = inputDrumSampleMono;

      //-----------------------------------------------------------------------------------------
      // 根据延时整数值计算读指针位置
      this.hornDelayLineReadPointerMid = this.hornDelayLineWritePointer - hornDelayLengthIntMid;
      if (this.hornDelayLineReadPointerMid < 0) { this.hornDelayLineReadPointerMid += this.delayLineLength; }
      // horn左声道
      this.hornDelayLineReadPointerLeft = this.hornDelayLineWritePointer - hornDelayLengthIntLeft;
      if (this.hornDelayLineReadPointerLeft < 0) { this.hornDelayLineReadPointerLeft += this.delayLineLength; }
      // horn右声道
      this.hornDelayLineReadPointerRight = this.hornDelayLineWritePointer - hornDelayLengthIntRight;
      if (this.hornDelayLineReadPointerRight < 0) { this.hornDelayLineReadPointerRight += this.delayLineLength; }

      // drum中置声道
      this.drumDelayLineReadPointerMid = this.drumDelayLineWritePointer - drumDelayLengthIntMid;
      if (this.drumDelayLineReadPointerMid < 0) { this.drumDelayLineReadPointerMid += this.delayLineLength; }
      // drum左声道
      this.drumDelayLineReadPointerLeft = this.drumDelayLineWritePointer - drumDelayLengthIntLeft;
      if (this.drumDelayLineReadPointerLeft < 0) { this.drumDelayLineReadPointerLeft += this.delayLineLength; }
      // drum右声道
      this.drumDelayLineReadPointerRight = this.drumDelayLineWritePointer - drumDelayLengthIntRight;
      if (this.drumDelayLineReadPointerRight < 0) { this.drumDelayLineReadPointerRight += this.delayLineLength; }


      //-----------------------------------------------------------------------------------------
      // 方法一：一阶线性插值
      // horn中置声道
      let hornDelayLineReadPointerMidBackward1 = this.hornDelayLineReadPointerMid - 1;
      if (hornDelayLineReadPointerMidBackward1 < 0) { hornDelayLineReadPointerMidBackward1 += this.delayLineLength; }
      inputHornSampleMono = (1 - hornDelayLengthFracMid) * this.hornDelayLine[this.hornDelayLineReadPointerMid] + hornDelayLengthFracMid * this.hornDelayLine[hornDelayLineReadPointerMidBackward1];
      // horn左声道
      let hornDelayLineReadPointerLeftBackward1 = this.hornDelayLineReadPointerLeft - 1;
      if (hornDelayLineReadPointerLeftBackward1 < 0) { hornDelayLineReadPointerLeftBackward1 += this.delayLineLength; }
      inputHornSampleL = (1 - hornDelayLengthFracLeft) * this.hornDelayLine[this.hornDelayLineReadPointerLeft] + hornDelayLengthFracLeft * this.hornDelayLine[hornDelayLineReadPointerLeftBackward1];
      // horn右声道
      let hornDelayLineReadPointerRightBackward1 = this.hornDelayLineReadPointerRight - 1;
      if (hornDelayLineReadPointerRightBackward1 < 0) { hornDelayLineReadPointerRightBackward1 += this.delayLineLength; }
      inputHornSampleR = (1 - hornDelayLengthFracRight) * this.hornDelayLine[this.hornDelayLineReadPointerRight] + hornDelayLengthFracRight * this.hornDelayLine[hornDelayLineReadPointerRightBackward1];

      // drum中置声道
      let drumDelayLineReadPointerMidBackward1 = this.drumDelayLineReadPointerMid - 1;
      if (drumDelayLineReadPointerMidBackward1 < 0) { drumDelayLineReadPointerMidBackward1 += this.delayLineLength; }
      inputDrumSampleMono = (1 - drumDelayLengthFracMid) * this.drumDelayLine[this.drumDelayLineReadPointerMid] + drumDelayLengthFracMid * this.drumDelayLine[drumDelayLineReadPointerMidBackward1];
      // drum左声道
      let drumDelayLineReadPointerLeftBackward1 = this.drumDelayLineReadPointerLeft - 1;
      if (drumDelayLineReadPointerLeftBackward1 < 0) { drumDelayLineReadPointerLeftBackward1 += this.delayLineLength; }
      inputDrumSampleL = (1 - drumDelayLengthFracLeft) * this.drumDelayLine[this.drumDelayLineReadPointerLeft] + drumDelayLengthFracLeft * this.drumDelayLine[drumDelayLineReadPointerLeftBackward1];
      // drum右声道
      let drumDelayLineReadPointerRightBackward1 = this.drumDelayLineReadPointerRight - 1;
      if (drumDelayLineReadPointerRightBackward1 < 0) { drumDelayLineReadPointerRightBackward1 += this.delayLineLength; }
      inputDrumSampleR = (1 - drumDelayLengthFracRight) * this.drumDelayLine[this.drumDelayLineReadPointerRight] + drumDelayLengthFracRight * this.drumDelayLine[drumDelayLineReadPointerRightBackward1];


      //-----------------------------------------------------------------------------------------
      // 方法二：四阶线性插值（运用拉格朗日质心公式）
      // 取数据
      // let hornDelayLineReadPointerBackward1 = this.hornDelayLineReadPointer - 1;
      // let hornDelayLineReadPointerForward1 = this.hornDelayLineReadPointer + 1;
      // let hornDelayLineReadPointerForward2 = this.hornDelayLineReadPointer + 2;
      // let drumDelayLineReadPointerBackward1 = this.drumDelayLineReadPointer - 1;
      // let drumDelayLineReadPointerForward1 = this.drumDelayLineReadPointer + 1;
      // let drumDelayLineReadPointerForward2 = this.drumDelayLineReadPointer + 2;
      // if (hornDelayLineReadPointerBackward1 < 0) { hornDelayLineReadPointerBackward1 += this.delayLineLength; }
      // if (hornDelayLineReadPointerForward1 > this.delayLineLength - 1) { hornDelayLineReadPointerForward1 -= this.delayLineLength; }
      // if (hornDelayLineReadPointerForward2 > this.delayLineLength - 1) { hornDelayLineReadPointerForward2 -= this.delayLineLength; }
      // if (drumDelayLineReadPointerBackward1 < 0) { drumDelayLineReadPointerBackward1 += this.delayLineLength; }
      // if (drumDelayLineReadPointerForward1 > this.delayLineLength - 1) { drumDelayLineReadPointerForward1 -= this.delayLineLength; }
      // if (drumDelayLineReadPointerForward2 > this.delayLineLength - 1) { drumDelayLineReadPointerForward2 -= this.delayLineLength; }
      // const yValuesHorn = [this.hornDelayLine[hornDelayLineReadPointerBackward1], this.hornDelayLine[this.hornDelayLineReadPointer], this.hornDelayLine[hornDelayLineReadPointerForward1], this.hornDelayLine[hornDelayLineReadPointerForward2]];
      // const yValuesDrum = [this.drumDelayLine[drumDelayLineReadPointerBackward1], this.drumDelayLine[this.drumDelayLineReadPointer], this.drumDelayLine[drumDelayLineReadPointerForward1], this.drumDelayLine[drumDelayLineReadPointerForward2]];
      // // Precompute barycentric weights for fixed sample points
      // const xIndex = [-1, 0, 1, 2];
      // const w = [-1 / 6, 1 / 2, -1 / 2, 1 / 6];
      // // Compute interpolated value
      // let numeratorHorn = 0.0;
      // let denominatorHorn = 0.0;
      // let numeratorDrum = 0.0;
      // let denominatorDrum = 0.0;
      // for (let j = 0; j < 4; j++) {
      //   const termHorn = w[j] / ((1 - hornDelayLengthFrac) - xIndex[j]);
      //   const termDrum = w[j] / ((1 - drumDelayLengthFrac) - xIndex[j]);
      //   numeratorHorn += termHorn * yValuesHorn[j];
      //   numeratorDrum += termDrum * yValuesDrum[j];
      //   denominatorHorn += termHorn;
      //   denominatorDrum += termDrum;
      // }
      // inputHornSampleMono = numeratorHorn / denominatorHorn;
      // inputDrumSampleMono = numeratorDrum / denominatorDrum;


      //-----------------------------------------------------------------------------------------
      // 直接读取（无插值，会引入数字噪声）
      // inputHornSampleMono = this.hornDelayLine[this.hornDelayLineReadPointer];
      // inputDrumSampleMono = this.drumDelayLine[this.drumDelayLineReadPointer];


      //-----------------------------------------------------------------------------------------
      // 更新延时线写指针
      this.hornDelayLineWritePointer++;
      this.drumDelayLineWritePointer++;
      if (this.hornDelayLineWritePointer > this.delayLineLength - 1) { this.hornDelayLineWritePointer = 0; }
      if (this.drumDelayLineWritePointer > this.delayLineLength - 1) { this.drumDelayLineWritePointer = 0; }


      //-----------------------------------------------------------------------------------------
      // 应用AM
      // horn中置声道
      hornAmAmpMid = 0.5 * this.gloabalAmDepth * (-hornLFOMid - 1) + 1;
      inputHornSampleMono *= hornAmAmpMid;
      // horn左声道
      hornAmAmpLeft = 0.5 * this.gloabalAmDepth * (-hornLFOLeft - 1) + 1;
      inputHornSampleL *= hornAmAmpLeft;
      // horn右声道
      hornAmAmpRight = 0.5 * this.gloabalAmDepth * (-hornLFORight - 1) + 1;
      inputHornSampleR *= hornAmAmpRight;

      // drum中置声道
      drumAmAmpMid = 0.5 * this.gloabalAmDepth * (-drumLFOMid - 1) + 1;
      inputDrumSampleMono *= drumAmAmpMid;
      // drum左声道
      drumAmAmpLeft = 0.5 * this.gloabalAmDepth * (-drumLFOLeft - 1) + 1;
      inputDrumSampleL *= drumAmAmpLeft;
      // drum右声道
      drumAmAmpRight = 0.5 * this.gloabalAmDepth * (-drumLFORight - 1) + 1;
      inputDrumSampleR *= drumAmAmpRight;


      //-----------------------------------------------------------------------------------------
      // 应用音量
      // horn中置声道

      // horn左声道
      outputHornSampleL = hornAmp * inputHornSampleL;
      outputHornSampleL *= outputAmp;
      // horn右声道
      outputHornSampleR = hornAmp * inputHornSampleR;
      outputHornSampleR *= outputAmp;

      // drum中置声道

      // drum左声道
      outputDrumSampleL = drumAmp * inputDrumSampleL;
      outputDrumSampleL *= outputAmp;
      // drum右声道
      outputDrumSampleR = drumAmp * inputDrumSampleR;
      outputDrumSampleR *= outputAmp;


      //-----------------------------------------------------------------------------------------
      // 写入音频样本
      outputHorn[0][i] = outputHornSampleL;
      outputHorn[1][i] = outputHornSampleR;
      outputDrum[0][i] = outputDrumSampleL;
      outputDrum[1][i] = outputDrumSampleR;
    }

    return true;
  }

  getCurrentRotorDegree() {
    const hornDegree = 360 / (2 * Math.PI) * this.hornRotorInstantPhase;
    const drumDegree = 360 / (2 * Math.PI) * this.drumRotorInstantPhase;
    return [hornDegree, drumDegree];
  }

  getCurrentRotorFrequency() {
    const hornFrequency = this.hornRotorAngularSpeed / (2 * Math.PI);
    const drumFrequency = this.drumRotorAngularSpeed / (2 * Math.PI);
    return [hornFrequency, drumFrequency];
  }
});
