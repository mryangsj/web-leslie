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
    this.gloabalModulatorDepth = 0.8; // %

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

    this.drumRotorFrequency = this.rotorSlowFrequency;
    this.drumRotorAngularAccelerationDefault = 2 * Math.PI; // rad/s^2
    this.drumRotorAngularDecelerationDefault = 0.5 * Math.PI; // rad/s^2
    this.drumRotorAngularAccelerationTarget = 0; // rad/s^2
    this.drumRotorAngularDecelerationTarget = 0; // rad/s^2
    this.drumRotorAngularSpeed = 0; // rad/s
    this.drumRotorAngularSpeedTarget = 0; // rad/s
    this.drumRotorInstantPhase = Math.random(); // rad

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
    this.hornRotorAngularSpeedTarget = 2 * Math.PI * this.hornRotorFrequency;
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
      // 合并声道
      inputHornSampleMono = (inputHornSampleL + inputHornSampleR) / 2;
      inputDrumSampleMono = (inputDrumSampleL + inputDrumSampleR) / 2;

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

      //-----------------------------------------------------------------------------------------
      // 振幅调制
      const horn_am = (1 / 2 * this.gloabalModulatorDepth * (Math.cos(this.hornRotorInstantPhase) - 1) + 1) * inputHornSampleMono;
      const drum_am = (1 / 2 * this.gloabalModulatorDepth * (Math.cos(this.drumRotorInstantPhase) - 1) + 1) * inputDrumSampleMono;

      //-----------------------------------------------------------------------------------------
      // 音量
      outputSampleL = hornAmp * horn_am + drumAmp * drum_am;
      outputSampleL *= outputAmp;

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
