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
    // 定义控制rotor旋转的低频振荡器的参数
    this.gloabalModulatorDepth = 0.7; // %

    this.rotorSlowFrequency = 0.687; // Hz
    this.rotorFastFrequency = 6; // Hz

    this.hornRotorFrequency = this.rotorSlowFrequency;
    this.hornRotorAngularAccelerationDefault = 4 * Math.PI; // rad/s^2
    this.hornRotorAngularDecelerationDefault = 3 * Math.PI; // rad/s^2
    this.hornRotorAngularAccelerationTarget = 0; // rad/s^2
    this.hornRotorAngularDecelerationTarget = 0; // rad/s^2
    this.hornRotorAngularSpeed = 0; // rad/s
    this.hornRotorAngularSpeedTarget = 0; // rad/s
    this.hornRotorInstantPhase = Math.random(); // rad
    // this.hornRotorInstantPhase = 0; // rad

    this.drumRotorFrequency = this.rotorSlowFrequency;
    this.drumRotorAngularAccelerationDefault = 2 * Math.PI; // rad/s^2
    this.drumRotorAngularDecelerationDefault = 0.5 * Math.PI; // rad/s^2
    this.drumRotorAngularAccelerationTarget = 0; // rad/s^2
    this.drumRotorAngularDecelerationTarget = 0; // rad/s^2
    this.drumRotorAngularSpeed = 0; // rad/s
    this.drumRotorAngularSpeedTarget = 0; // rad/s
    this.drumRotorInstantPhase = Math.random(); // rad
    // this.drumRotorInstantPhase = 0; // rad

    //-----------------------------------------------------------------------------------------
    // 用于duopler效应的延迟线
    this.delayLineLength = 1024;
    this.hornInputBuffer = new Float32Array(this.delayLineLength);
    this.drumInputBuffer = new Float32Array(this.delayLineLength);
    this.hornDelayLine = new Float32Array(this.delayLineLength);
    this.drumDelayLine = new Float32Array(this.delayLineLength);
    this.hornInputBufferPointer = 0;
    this.drumInputBufferPointer = 0;
    this.hornDelayLineReadPointer = 0;
    this.drumDelayLineReadPointer = 0;
    this.hornDelayLineWritePointer = 0;
    this.drumDelayLineWritePointer = 0;

    //-----------------------------------------------------------------------------------------
    // sdf的状态值
    this.hornSdfX1 = 0;
    this.hornSdfY1 = 0;
    this.drumSdfX1 = 0;
    this.drumSdfY1 = 0;

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
    const inputDrum = inputs[1];
    const output = outputs[0];
    const bufferSize = inputHorn[0].length;
    let inputHornSampleL = 0;
    let inputHornSampleR = 0;
    let inputDrumSampleL = 0;
    let inputDrumSampleR = 0;
    let inputHornSampleMono = 0;
    let inputDrumSampleMono = 0;
    let outputSampleL = 0;
    let outputSampleR = 0;


    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 接收用户参数
    const rotorMode = parameters.rotorMode[0];
    const rotorBrake = parameters.rotorBrake[0];
    // horn参数
    const hornSlowSpeedFineTune = parameters.hornSlowSpeed[0];
    const hornFastSpeedFineTune = parameters.hornFastSpeed[0];
    const hornAccelerationFineTune = parameters.hornAcceleration[0];
    const hornDecelerationFineTune = parameters.hornDeceleration[0];
    // drum参数
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
    let hornLFO = 0;
    let drumLFO = 0;
    let hornSdfFactor = 0;
    let drumSdfFactor = 0;
    let hornDelayLength = 0;
    let drumDelayLength = 0;
    let hornDelayLengthInt = 0;
    let hornDelayLengthFrac = 0;
    let drumDelayLengthInt = 0;
    let drumDelayLengthFrac = 0;
    let hornSdfY = 0;
    let drumSdfY = 0;
    let hornAmAmp = 1;
    let drumAmAmp = 1;


    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    if (rotorBrake === 0) { // 旋转模式
      // 计算rotor振荡器目标频率
      if (rotorMode === 0) { // 慢速模式 
        this.hornRotorFrequency = this.rotorSlowFrequency * (1 + hornSlowSpeedFineTune / 100);
        this.drumRotorFrequency = this.rotorSlowFrequency * (1 + drumSlowSpeedFineTune / 100);
      } else if (rotorMode === 1) { // 快速模式
        this.hornRotorFrequency = this.rotorFastFrequency * (1 + hornFastSpeedFineTune / 100);
        this.drumRotorFrequency = this.rotorFastFrequency * (1 + drumFastSpeedFineTune / 100);
      }
      // 计算rotor振荡器目标角加速度
      this.hornRotorAngularAccelerationTarget = this.hornRotorAngularAccelerationDefault * hornAccelerationFineTune;
      this.hornRotorAngularDecelerationTarget = this.hornRotorAngularDecelerationDefault * hornDecelerationFineTune;
      this.drumRotorAngularAccelerationTarget = this.drumRotorAngularAccelerationDefault * drumAccelerationFineTune;
      this.drumRotorAngularDecelerationTarget = this.drumRotorAngularDecelerationDefault * drumDecelerationFineTune;
    }
    //-----------------------------------------------------------------------------------------
    else if (rotorBrake === 1) { // 停止模式
      this.hornRotorFrequency = 0;
      this.drumRotorFrequency = 0;
      this.hornRotorAngularDecelerationTarget = 2 * this.hornRotorAngularDecelerationDefault;
      this.drumRotorAngularDecelerationTarget = 2 * this.drumRotorAngularDecelerationDefault;
    }
    //-----------------------------------------------------------------------------------------
    // 更新rotor振荡器目标角速度
    this.hornRotorAngularSpeedTarget = 2 * Math.PI * (this.hornRotorFrequency + 0.13);
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
      //-----------------------------------------------------------------------------------------
      // 更新horn振荡器状态
      if (this.hornRotorAngularSpeed < this.hornRotorAngularSpeedTarget) {
        this.hornRotorAngularSpeed += this.hornRotorAngularAccelerationTarget * this.T;
      } else if (this.hornRotorAngularSpeed > this.hornRotorAngularSpeedTarget) {
        this.hornRotorAngularSpeed -= this.hornRotorAngularDecelerationTarget * this.T;
      }
      this.hornRotorInstantPhase -= this.hornRotorAngularSpeed * this.T;
      if (this.hornRotorInstantPhase < 0) { this.hornRotorInstantPhase += 2 * Math.PI; }
      // 更新drum振荡器状态
      if (this.drumRotorAngularSpeed < this.drumRotorAngularSpeedTarget) {
        this.drumRotorAngularSpeed += this.drumRotorAngularAccelerationTarget * this.T;
      } else if (this.drumRotorAngularSpeed > this.drumRotorAngularSpeedTarget) {
        this.drumRotorAngularSpeed -= this.drumRotorAngularDecelerationTarget * this.T;
      }
      this.drumRotorInstantPhase += this.drumRotorAngularSpeed * this.T;
      if (this.drumRotorInstantPhase > 2 * Math.PI) { this.drumRotorInstantPhase -= 2 * Math.PI; }
      // 计算振荡器输出
      hornLFO = Math.cos(this.hornRotorInstantPhase);
      drumLFO = Math.cos(this.drumRotorInstantPhase);


      //-----------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------
      // 计算duopler效应必要参数 52.235 49.412
      hornDelayLength = (-hornLFO + 1) / 2 * 52.235;
      drumDelayLength = (-drumLFO + 1) / 2 * 49.412;
      hornDelayLengthInt = Math.floor(hornDelayLength);
      hornDelayLengthFrac = hornDelayLength - hornDelayLengthInt;
      drumDelayLengthInt = Math.floor(drumDelayLength);
      drumDelayLengthFrac = drumDelayLength - drumDelayLengthInt;


      //-----------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------
      // apply integer delay
      // 将当前样本写入输入缓冲区
      this.hornDelayLine[this.hornDelayLineWritePointer] = inputHornSampleMono;
      this.drumDelayLine[this.drumDelayLineWritePointer] = inputDrumSampleMono;
      // 根据延时整数值从输入缓冲区读取目标样本
      this.hornDelayLineReadPointer = this.hornDelayLineWritePointer - hornDelayLengthInt;
      this.drumDelayLineReadPointer = this.drumDelayLineWritePointer - drumDelayLengthInt;
      if (this.hornDelayLineReadPointer < 0) { this.hornDelayLineReadPointer += this.delayLineLength; }
      if (this.drumDelayLineReadPointer < 0) { this.drumDelayLineReadPointer += this.delayLineLength; }
      // 线性插值
      let hornDelayLineReadPointerNext = this.hornDelayLineReadPointer - 1;
      let drumDelayLineReadPointerNext = this.drumDelayLineReadPointer - 1;
      if (hornDelayLineReadPointerNext < 0) { hornDelayLineReadPointerNext += this.delayLineLength; }
      if (drumDelayLineReadPointerNext < 0) { drumDelayLineReadPointerNext += this.delayLineLength; }
      inputHornSampleMono = (1 - hornDelayLengthFrac) * this.hornDelayLine[this.hornDelayLineReadPointer] + hornDelayLengthFrac * this.hornDelayLine[hornDelayLineReadPointerNext];
      inputDrumSampleMono = (1 - drumDelayLengthFrac) * this.drumDelayLine[this.drumDelayLineReadPointer] + drumDelayLengthFrac * this.drumDelayLine[drumDelayLineReadPointerNext];
      // inputHornSampleMono = this.hornDelayLine[this.hornDelayLineReadPointer];
      // inputDrumSampleMono = this.drumDelayLine[this.drumDelayLineReadPointer];
      // 更新延时线写指针
      this.hornDelayLineWritePointer++;
      this.drumDelayLineWritePointer++;
      if (this.hornDelayLineWritePointer > this.delayLineLength - 1) { this.hornDelayLineWritePointer = 0; }
      if (this.drumDelayLineWritePointer > this.delayLineLength - 1) { this.drumDelayLineWritePointer = 0; }


      //-----------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------
      // apply fraction delay
      // hornSdfFactor = hornDelayLengthFrac / (2 - hornDelayLengthFrac);  // pre-warping
      // drumSdfFactor = drumDelayLengthFrac / (2 - drumDelayLengthFrac);  // pre-warping
      // hornSdfY = hornSdfFactor * inputHornSampleMono + this.hornSdfX1 - hornSdfFactor * this.hornSdfY1;
      // drumSdfY = drumSdfFactor * inputDrumSampleMono + this.drumSdfX1 - drumSdfFactor * this.drumSdfY1;
      // //-----------------------------------------------------------------------------------------
      // // 更新sdf状态
      // this.hornSdfX1 = inputHornSampleMono;
      // this.hornSdfY1 = hornSdfY;
      // this.drumSdfX1 = inputDrumSampleMono;
      // this.drumSdfY1 = drumSdfY;
      // //-----------------------------------------------------------------------------------------
      // inputHornSampleMono = hornSdfY;
      // inputDrumSampleMono = drumSdfY;


      //-----------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------
      // 应用AM
      hornAmAmp = this.gloabalModulatorDepth * 1 / 2 * (hornLFO - 1) + 1;
      drumAmAmp = this.gloabalModulatorDepth * 1 / 2 * (drumLFO - 1) + 1;
      inputHornSampleMono *= hornAmAmp;
      inputDrumSampleMono *= drumAmAmp;


      //-----------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------
      // 应用音量
      outputSampleL = hornAmp * inputHornSampleMono + drumAmp * inputDrumSampleMono;
      outputSampleL *= outputAmp;


      //-----------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------
      // 写入音频样本
      output[0][i] = outputSampleL;
      output[1][i] = outputSampleL;
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
