import { switchPowerObj } from "/js/switchInit.js";
import { knobInputGainObj } from "/js/knobInit.js";
import { wheelHornSpeedObj, wheelDrumSpeedObj } from "/js/wheelInit.js";
import { knobHornAccelerationObj, knobHornDecelerationObj, knobDrumAccelerationObj, knobDrumDecelerationObj } from "/js/knobInit.js";
import { buttonSlowObj, buttonFastObj, buttonBrakeObj } from "/js/switchInit.js";
import { leslieHornObj, leslieDrumObj } from "/js/meterInit.js";
import { leslieHornMicObj, leslieDrumMicObj } from "/js/meterInit.js";
import { ledHornCorrelationObj, ledDrumCorrelationObj } from "/js/meterInit.js";
import { knobDrumMicPanObj_L, knobDrumMicPanObj_R, knobHornMicPanObj_L, knobHornMicPanObj_R } from "/js/knobInit.js";
import { sliderHornMicWidthObj, sliderDrumMicWidthObj } from "/js/sliderInit.js";
import { sliderHornMicLevelObj_L, sliderHornMicLevelObj_R, sliderDrumMicLevelObj_L, sliderDrumMicLevelObj_R } from "/js/sliderInit.js";
import { switchHornLevelLinkObj, switchDrumLevelLinkObj } from "/js/switchInit.js";
import { knobOutputGainObj } from "/js/knobInit.js";
import { meterOutput_L_Obj, meterOutput_R_Obj } from "/js/meterInit.js";

//-----------------------------------------------------------------------------------------
// get elements
const audioPlayer = document.getElementById('audioPlayer');
const hornRate = document.getElementById('hornRate');
const drumRate = document.getElementById('drumRate');

//-----------------------------------------------------------------------------------------
// create audio context
const audioContext = new AudioContext();
audioContext.suspend();

//-----------------------------------------------------------------------------------------
// create audio context nodes
const mp3Node = audioContext.createMediaElementSource(audioPlayer);

//-----------------------------------------------------------------------------------------
// add audio processor and connect audio context nodes
(async function () {
  await audioContext.audioWorklet.addModule('/js/audioProcessor.js');
  await audioContext.audioWorklet.addModule('/js/levelMeterProcessor.js');
})().then(() => {
  //---------------------------------------------------
  // input block
  const inputGainNode = new GainNode(audioContext, { gain: dB2value(knobInputGainObj.defaultValue) });

  //---------------------------------------------------
  // leslie block
  const hpfNode = new BiquadFilterNode(audioContext, { type: 'highpass', frequency: 800 });
  const lpfNode = new BiquadFilterNode(audioContext, { type: 'lowpass', frequency: 800 });
  const leslieNode = new AudioWorkletNode(audioContext, 'leslie-processor', {
    numberOfInputs: 2,
    numberOfOutputs: 4,
    outputChannelCount: [2, 2, 2, 2],
  });

  //---------------------------------------------------
  // mic block
  const hornPannerNode_L = new StereoPannerNode(audioContext, { pan: knobHornMicPanObj_L.defaultValue / 100 });
  const hornPannerNode_R = new StereoPannerNode(audioContext, { pan: knobHornMicPanObj_R.defaultValue / 100 });
  const drumPannerNode_L = new StereoPannerNode(audioContext, { pan: knobDrumMicPanObj_L.defaultValue / 100 });
  const drumPannerNode_R = new StereoPannerNode(audioContext, { pan: knobDrumMicPanObj_R.defaultValue / 100 });

  //---------------------------------------------------
  // mixing panal
  const hornGainNode_L = new GainNode(audioContext, { gain: dB2value(sliderHornMicLevelObj_L.defaultValue) });
  const hornGainNode_R = new GainNode(audioContext, { gain: dB2value(sliderHornMicLevelObj_R.defaultValue) });
  const drumGainNode_L = new GainNode(audioContext, { gain: dB2value(sliderDrumMicLevelObj_L.defaultValue) });
  const drumGainNode_R = new GainNode(audioContext, { gain: dB2value(sliderDrumMicLevelObj_R.defaultValue) });
  const outputGainNode = new GainNode(audioContext, { gain: dB2value(knobOutputGainObj.defaultValue) });
  const levelMeterNode = new AudioWorkletNode(audioContext, 'level-meter-processor', {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  });


  //---------------------------------------------------
  // connect nodes
  mp3Node.connect(inputGainNode);

  inputGainNode.connect(hpfNode);
  inputGainNode.connect(lpfNode);

  hpfNode.connect(leslieNode, 0, 0);
  lpfNode.connect(leslieNode, 0, 1);
  leslieNode.connect(hornPannerNode_L, 0, 0);
  leslieNode.connect(hornPannerNode_R, 1, 0);
  leslieNode.connect(drumPannerNode_L, 2, 0);
  leslieNode.connect(drumPannerNode_R, 3, 0);

  hornPannerNode_L.connect(hornGainNode_L);
  hornPannerNode_R.connect(hornGainNode_R);
  drumPannerNode_L.connect(drumGainNode_L);
  drumPannerNode_R.connect(drumGainNode_R);
  hornGainNode_L.connect(outputGainNode);
  hornGainNode_R.connect(outputGainNode);
  drumGainNode_L.connect(outputGainNode);
  drumGainNode_R.connect(outputGainNode);
  outputGainNode.connect(audioContext.destination);
  outputGainNode.connect(levelMeterNode);


  //-----------------------------------------------------------------------------------------
  // 注册控件状态changed事件
  switchPowerObj.addEventListener('changed', event => {
    if (event.detail.value === 1) {
      audioContext.resume();
    } else {
      audioContext.suspend();
    }
  });
  knobInputGainObj.addEventListener('changed', () => { inputGainNode.gain.value = dB2value(knobInputGainObj.currentValue); });

  wheelHornSpeedObj.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setHornSpeedFineTune', value: wheelHornSpeedObj.currentValue }); });
  wheelDrumSpeedObj.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setDrumSpeedFineTune', value: wheelDrumSpeedObj.currentValue }); });
  knobHornAccelerationObj.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setHornAccelerationFineTune', value: knobHornAccelerationObj.currentValue }); });
  knobDrumAccelerationObj.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setDrumAccelerationFineTune', value: knobDrumAccelerationObj.currentValue }); });
  knobHornDecelerationObj.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setHornDecelerationFineTune', value: knobHornDecelerationObj.currentValue }); });
  knobDrumDecelerationObj.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setDrumDecelerationFineTune', value: knobDrumDecelerationObj.currentValue }); });

  buttonSlowObj.addEventListener('changed', () => {
    leslieNode.port.postMessage({ type: 'setRotorMode', value: buttonSlowObj.currentValue === 1 ? 0 : 1 });
    buttonFastObj.setIndicatorByValue(buttonSlowObj.currentValue === 1 ? 0 : 1);
  });
  buttonFastObj.addEventListener('changed', () => {
    leslieNode.port.postMessage({ type: 'setRotorMode', value: buttonFastObj.currentValue === 1 ? 1 : 0 });
    buttonSlowObj.setIndicatorByValue(buttonFastObj.currentValue === 1 ? 0 : 1);
  });
  buttonBrakeObj.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setRotorBrake', value: buttonBrakeObj.currentValue === 1 ? true : false }); });

  sliderHornMicWidthObj.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setHornMicWidth', value: degree2radian(sliderHornMicWidthObj.currentValue) }); });
  sliderDrumMicWidthObj.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setDrumMicWidth', value: degree2radian(sliderDrumMicWidthObj.currentValue) }); });

  knobHornMicPanObj_L.addEventListener('changed', () => { hornPannerNode_L.pan.value = knobHornMicPanObj_L.currentValue / 100; });
  knobHornMicPanObj_R.addEventListener('changed', () => { hornPannerNode_R.pan.value = knobHornMicPanObj_R.currentValue / 100; });
  knobDrumMicPanObj_L.addEventListener('changed', () => { drumPannerNode_L.pan.value = knobDrumMicPanObj_L.currentValue / 100; });
  knobDrumMicPanObj_R.addEventListener('changed', () => { drumPannerNode_R.pan.value = knobDrumMicPanObj_R.currentValue / 100; });

  sliderHornMicLevelObj_L.addEventListener('changed', () => {
    hornGainNode_L.gain.value = dB2value(sliderHornMicLevelObj_L.currentValue);
    if (switchHornLevelLinkObj.currentValue === 1) sliderHornMicLevelObj_R.setIndicatorByValue(sliderHornMicLevelObj_L.currentValue);
  });
  sliderHornMicLevelObj_R.addEventListener('changed', () => {
    hornGainNode_R.gain.value = dB2value(sliderHornMicLevelObj_R.currentValue);
    if (switchHornLevelLinkObj.currentValue === 1) sliderHornMicLevelObj_L.setIndicatorByValue(sliderHornMicLevelObj_R.currentValue);
  });
  sliderDrumMicLevelObj_L.addEventListener('changed', () => {
    drumGainNode_L.gain.value = dB2value(sliderDrumMicLevelObj_L.currentValue);
    if (switchDrumLevelLinkObj.currentValue === 1) sliderDrumMicLevelObj_R.setIndicatorByValue(sliderDrumMicLevelObj_L.currentValue);
  });
  sliderDrumMicLevelObj_R.addEventListener('changed', () => {
    drumGainNode_R.gain.value = dB2value(sliderDrumMicLevelObj_R.currentValue);
    if (switchDrumLevelLinkObj.currentValue === 1) sliderDrumMicLevelObj_L.setIndicatorByValue(sliderDrumMicLevelObj_R.currentValue);
  });
  knobOutputGainObj.addEventListener('changed', () => { outputGainNode.gain.value = dB2value(knobOutputGainObj.currentValue) });

  //-----------------------------------------------------------------------------------------
  // 控制rotor转动
  function updateRotor() {
    if (audioContext.state === 'running') {
      leslieNode.port.postMessage({ type: 'getRotorInstantDegree' });
      leslieNode.port.postMessage({ type: 'getRotorInstantRate' });
      leslieNode.port.postMessage({ type: 'getMicCorrelation' });
      levelMeterNode.port.postMessage({ type: 'getRMS' });
    }
    leslieHornMicObj.setIndicatorByValue(sliderHornMicWidthObj.currentValue);
    leslieDrumMicObj.setIndicatorByValue(sliderDrumMicWidthObj.currentValue);

    requestAnimationFrame(updateRotor);
  };
  requestAnimationFrame(updateRotor);

  leslieNode.port.onmessage = (event) => {
    switch (event.data.type) {
      case 'rotorInstantDegree':
        leslieHornObj.setIndicatorByValue(event.data.value[0]);
        leslieDrumObj.setIndicatorByValue(event.data.value[1]);
        break;
      case 'rotorInstantRate':
        hornRate.innerText = `${event.data.value[0].toFixed(2)}Hz`;
        drumRate.innerText = `${event.data.value[1].toFixed(2)}Hz`;
        break;
      case 'micCorrelation':
        ledHornCorrelationObj.setIndicatorByValue(event.data.value[0]);
        ledDrumCorrelationObj.setIndicatorByValue(event.data.value[1]);
        break;
      default:
        break;
    }
  };

  levelMeterNode.port.onmessage = (event) => {
    switch (event.data.type) {
      case 'truePeak':
        let truePeak_L = event.data.value[0];
        let truePeak_R = event.data.value[1];
        if (truePeak_L > 1) truePeak_L = 1;
        if (truePeak_L < 1e-3) truePeak_L = 1e-3;
        if (truePeak_R > 1) truePeak_R = 1;
        if (truePeak_R < 1e-3) truePeak_R = 1e-3;
        meterOutput_L_Obj.setIndicatorByValue(value2dB(truePeak_L));
        meterOutput_R_Obj.setIndicatorByValue(value2dB(truePeak_R));
        break;
      case 'RMS':
        let rms_L = event.data.value[0];
        let rms_R = event.data.value[1];
        if (rms_L > 1) rms_L = 1;
        if (rms_L < 1e-3) rms_L = 1e-3;
        if (rms_R > 1) rms_R = 1;
        if (rms_R < 1e-3) rms_R = 1e-3;
        meterOutput_L_Obj.setIndicatorByValue(value2dB(rms_L));
        meterOutput_R_Obj.setIndicatorByValue(value2dB(rms_R));
      default:
        break;
    }
  }
}).catch((err) => {
  console.log(err);
});


function value2dB(value) { return 20 * Math.log10(value); }
function dB2value(dB) { return Math.pow(10, dB / 20); }
function degree2radian(degree) { return degree / 180 * Math.PI; }
