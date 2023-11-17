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
    this.rotorSlowFrequency = 2; // Hz
    this.rotorFastFrequency = 6; // Hz

    this.hornRotorFrequency = this.rotorSlowFrequency;
    this.hornRotorAngularAcceleration = 5 * Math.PI; // rad/s^2
    this.hornRotorAngularDeceleration = 5 * Math.PI; // rad/s^2
    this.hornRotorAngularSpeed = 0; // rad/s
    this.hornRotorAngularSpeedTarget = 0; // rad/s
    this.hornRotorInstantPhase = 0; // rad

    this.drumRotorFrequency = this.rotorSlowFrequency;
    this.drumRotorAngularAcceleration = 2 * Math.PI; // rad/s^2
    this.drumRotorAngularDeceleration = 2 * Math.PI; // rad/s^2
    this.drumRotorAngularSpeed = 0; // rad/s
    this.drumRotorAngularSpeedTarget = 0; // rad/s
    this.drumRotorInstantPhase = 0; // rad

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
    // 接收参数
    const rotorMode = parameters.rotorMode[0];
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
    const outputGain = parameters.outputGain[0];


    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 更新rotor振荡器目标频率
    if (rotorMode === 0) { // 慢速模式
      this.hornRotorFrequency = this.rotorSlowFrequency * (1 + hornSlowSpeedFineTune / 100);
      this.drumRotorFrequency = this.rotorSlowFrequency * (1 + drumSlowSpeedFineTune / 100);
    }
    else if (rotorMode === 1) { // 快速模式
      this.hornRotorFrequency = this.rotorFastFrequency * (1 + hornFastSpeedFineTune / 100);
      this.drumRotorFrequency = this.rotorFastFrequency * (1 + drumFastSpeedFineTune / 100);
    }
    // 更新rotor振荡器目标角速度
    this.hornRotorAngularSpeedTarget = 2 * Math.PI * this.hornRotorFrequency;
    this.drumRotorAngularSpeedTarget = 2 * Math.PI * this.drumRotorFrequency;
    // 更新mixer参数
    const outputAmp = Math.pow(10, outputGain / 20);

    //-----------------------------------------------------------------------------------------
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
        //-----------------------------------------------------------------------------------------
        // 更新horn振荡器参数
        if (this.hornRotorAngularSpeed < this.hornRotorAngularSpeedTarget) {
          this.hornRotorAngularSpeed += this.hornRotorAngularAcceleration * hornAccelerationFineTune * this.T;
        } else if (this.hornRotorAngularSpeed > this.hornRotorAngularSpeedTarget) {
          this.hornRotorAngularSpeed -= this.hornRotorAngularDeceleration * hornDecelerationFineTune * this.T;
        }
        this.hornRotorInstantPhase -= this.hornRotorAngularSpeed * this.T;
        if (this.hornRotorInstantPhase > 2 * Math.PI) { this.hornRotorInstantPhase -= 2 * Math.PI; }
        // 更新drum振荡器参数
        if (this.drumRotorAngularSpeed < this.drumRotorAngularSpeedTarget) {
          this.drumRotorAngularSpeed += this.drumRotorAngularAcceleration * drumAccelerationFineTune * this.T;
        } else if (this.drumRotorAngularSpeed > this.drumRotorAngularSpeedTarget) {
          this.drumRotorAngularSpeed -= this.drumRotorAngularDeceleration * drumDecelerationFineTune * this.T;
        }
        this.drumRotorInstantPhase += this.drumRotorAngularSpeed * this.T;
        if (this.drumRotorInstantPhase > 2 * Math.PI) { this.drumRotorInstantPhase -= 2 * Math.PI; }

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
    else if (inputChannelCount === 1 && outputChannelCount === 2) { }

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
