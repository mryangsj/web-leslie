class LeslieProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

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
}

registerProcessor("leslie-processor", LeslieProcessor);
