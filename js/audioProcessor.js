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


registerProcessor("LeslieProcessor", class extends AudioWorkletProcessor {
  constructor() { super(); }
  process(inputList, outputList, parameters) {
    const numberOfSource = Math.min(inputList.length, outputList.length);

    // 遍历每一个输入源
    for (let sourceIndex = 0; sourceIndex < numberOfSource; sourceIndex++) {
      const input = inputList[sourceIndex].length;
      const output = outputList[sourceIndex].length;
      const numberOfInputChannel = input.length;
      const numberOfOutputChannel = output.length;
      const bufferSize = input[0].length;

      // stetro -> stereo
      if (numberOfInputChannel === 2 && numberOfOutputChannel === 2) {
        for (let i = 0; sampleIndex < bufferSize; sampleIndex++) {
          output[0][i] = 0.5 * input[0][i];
          output[1][i] = 0.5 * input[1][i];
        }
      }
      // mono -> stereo
      else if (numberOfInputChannel === 1 && numberOfOutputChannel === 2) {

      }
    }

    return true;
  }
});
