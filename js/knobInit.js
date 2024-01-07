import Knob from '/js/Knob.js';

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const containerInputDrive = document.getElementById('knob-container-inputGain');
const containerInputHPF = document.getElementById('knob-container-inputHPF');
const containerInputLPF = document.getElementById('knob-container-inputLPF');
const containerHighFreq = document.getElementById('knob-container-highFreq');
const containerHighGain = document.getElementById('knob-container-highGain');
const containerMidFreq = document.getElementById('knob-container-midFreq');
const containerMidGain = document.getElementById('knob-container-midGain');
const containerLowFreq = document.getElementById('knob-container-lowFreq');
const containerLowGain = document.getElementById('knob-container-lowGain');
//-----------------------------------------------------------------------------------------
const containerHornAcceleration = document.getElementById('knob-container-hornAcceleration');
const containerHornDeceleration = document.getElementById('knob-container-hornDeceleration');
const containerDrumAcceleration = document.getElementById('knob-container-drumAcceleration');
const containerDrumDeceleration = document.getElementById('knob-container-drumDeceleration');
//-----------------------------------------------------------------------------------------
const containerHornMicPan_L = document.getElementById('knob-container-hornMicPan_L');
const containerHornMicPan_R = document.getElementById('knob-container-hornMicPan_R');
const containerDrumMicPan_L = document.getElementById('knob-container-drumMicPan_L');
const containerDrumMicPan_R = document.getElementById('knob-container-drumMicPan_R');
const containerOutputGain = document.getElementById('knob-container-outputGain');


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// const devMode = true;
const devMode = false
//-----------------------------------------------------------------------------------------
const sizeRatioKnobSamll = 0.8;
const pathSpriteKnobSmall = '/resources/image/knob/knob_small.png';
const pathScaleKnobSmall = '/resources/image/knob/knob_small_scale.png'
const sizeRatioScaleKnobSmall = 0.85;
const positionTopAndLeftFinetuneScaleKnobSmall = [-0.05, 0];
const labelCSSSmall = 'small-knob-label'
//-----------------------------------------------------------------------------------------
const sizeRatioKnobMid = 1.15;
const pathSpriteKnobMid = 'resources/image/knob/knob_mid.png';
const pathScaleKnobMid = 'resources/image/knob/knob_mid_scale.png'
const sizeRatioScaleKnobMid = 0.85;
const positionTopAndLeftFinetuneScaleKnobMid = [-0.055, 0];
const labelCSSMid = 'mid-knob-label'
//-----------------------------------------------------------------------------------------
const sizeRatioKnobBig = 0.65;
const pathSpriteKnobBig = 'resources/image/knob/knob_big.png';
const pathScaleKnobBig = 'resources/image/knob/knob_mid_scale.png'
const sizeRatioScaleKnobBig = 0.95;
const positionTopandLeftFinetuneScaleKnobBig = [-0.06, 0];
const labelCSSBig = 'big-knob-label'


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
export const knobInputDriveObj = new Knob(containerInputDrive, sizeRatioKnobBig, 'inputDrive', devMode);
knobInputDriveObj.setIndicatorSprite(pathSpriteKnobBig);
knobInputDriveObj.setScale(pathScaleKnobBig, sizeRatioScaleKnobBig, positionTopandLeftFinetuneScaleKnobBig);
knobInputDriveObj.setValueConfig(0, 30, 3.0);
knobInputDriveObj.setSkewForCenter(12.0);
knobInputDriveObj.setCursorResponsive(true);
knobInputDriveObj.setLabel('DRIVE', labelCSSBig);
knobInputDriveObj.setLabelResponsive(true, 1, 'dB');
knobInputDriveObj.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobInputHPFObj = new Knob(containerInputHPF, sizeRatioKnobSamll, 'inputHPF', devMode);
knobInputHPFObj.setIndicatorSprite(pathSpriteKnobSmall);
knobInputHPFObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall, positionTopAndLeftFinetuneScaleKnobSmall);
knobInputHPFObj.setValueConfig(20, 800, 100);
knobInputHPFObj.setCursorResponsive(true);
knobInputHPFObj.setLabel('LOW CUT', labelCSSSmall);
knobInputHPFObj.setLabelResponsive(true, 0, 'Hz');
knobInputHPFObj.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobInputLPFObj = new Knob(containerInputLPF, sizeRatioKnobSamll, 'inputLPF', devMode);
knobInputLPFObj.setIndicatorSprite(pathSpriteKnobSmall);
knobInputLPFObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall, positionTopAndLeftFinetuneScaleKnobSmall);
knobInputLPFObj.setValueConfig(3, 20, 10);
knobInputLPFObj.setSkewForCenter(10);
knobInputLPFObj.setCursorResponsive(true);
knobInputLPFObj.setLabel('HIGH CUT', labelCSSSmall);
knobInputLPFObj.setLabelResponsive(true, 1, 'kHz');
knobInputLPFObj.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobHighFreqObj = new Knob(containerHighFreq, sizeRatioKnobSamll, 'highShelfFreq', devMode);
knobHighFreqObj.setIndicatorSprite(pathSpriteKnobSmall);
knobHighFreqObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall, positionTopAndLeftFinetuneScaleKnobSmall);
knobHighFreqObj.setValueConfig(2, 18, 8);
knobHighFreqObj.setSkewForCenter(6);
knobHighFreqObj.setCursorResponsive(true);
knobHighFreqObj.setLabel('HIGH SHELF<br>FREQ', labelCSSSmall);
knobHighFreqObj.setLabelResponsive(true, 1, 'kHz');
knobHighFreqObj.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobHighGainObj = new Knob(containerHighGain, sizeRatioKnobSamll, 'highShelfGain', devMode);
knobHighGainObj.setIndicatorSprite(pathSpriteKnobSmall);
knobHighGainObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall, positionTopAndLeftFinetuneScaleKnobSmall);
knobHighGainObj.setValueConfig(-15, 15, 0);
knobHighGainObj.setCursorResponsive(true);
knobHighGainObj.setLabel('HIGH SHELF<br>GAIN', labelCSSSmall);
knobHighGainObj.setLabelResponsive(true, 1, 'dB');
knobHighGainObj.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobMidFreqObj = new Knob(containerMidFreq, sizeRatioKnobSamll, 'midFreq', devMode);
knobMidFreqObj.setIndicatorSprite(pathSpriteKnobSmall);
knobMidFreqObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall, positionTopAndLeftFinetuneScaleKnobSmall);
knobMidFreqObj.setValueConfig(400, 8000, 1000);
knobMidFreqObj.setSkewForCenter(2000);
knobMidFreqObj.setCursorResponsive(true);
knobMidFreqObj.setLabel('MID FREQ', labelCSSSmall);
knobMidFreqObj.setLabelResponsive(true, 0, 'Hz');
knobMidFreqObj.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobMidGainObj = new Knob(containerMidGain, sizeRatioKnobSamll, 'midGain', devMode);
knobMidGainObj.setIndicatorSprite(pathSpriteKnobSmall);
knobMidGainObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall, positionTopAndLeftFinetuneScaleKnobSmall);
knobMidGainObj.setValueConfig(-15, 15, 0);
knobMidGainObj.setCursorResponsive(true);
knobMidGainObj.setLabel('MID GAIN', labelCSSSmall);
knobMidGainObj.setLabelResponsive(true, 1, 'dB');
knobMidGainObj.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobLowFreqObj = new Knob(containerLowFreq, sizeRatioKnobSamll, 'lowShelfFreq', devMode);
knobLowFreqObj.setIndicatorSprite(pathSpriteKnobSmall);
knobLowFreqObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall, positionTopAndLeftFinetuneScaleKnobSmall);
knobLowFreqObj.setValueConfig(50, 400, 100);
knobLowFreqObj.setSkewForCenter(120);
knobLowFreqObj.setCursorResponsive(true);
knobLowFreqObj.setLabel('LOW SHELF<br>FREQ', labelCSSSmall);
knobLowFreqObj.setLabelResponsive(true, 0, 'Hz');
knobLowFreqObj.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobLowGainObj = new Knob(containerLowGain, sizeRatioKnobSamll, 'lowShlfGain', devMode);
knobLowGainObj.setIndicatorSprite(pathSpriteKnobSmall);
knobLowGainObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall, positionTopAndLeftFinetuneScaleKnobSmall);
knobLowGainObj.setValueConfig(-15, 15, 0);
knobLowGainObj.setCursorResponsive(true);
knobLowGainObj.setLabel('LOW SHELF<br>GAIN', labelCSSSmall);
knobLowGainObj.setLabelResponsive(true, 1, 'dB');
knobLowGainObj.setLabelEditable(true);


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
export const knobHornAccelerationObj = new Knob(containerHornAcceleration, sizeRatioKnobMid, 'hornAcceleration', devMode);
knobHornAccelerationObj.setIndicatorSprite(pathSpriteKnobMid);
knobHornAccelerationObj.setScale(pathScaleKnobMid, sizeRatioScaleKnobMid, positionTopAndLeftFinetuneScaleKnobMid);
knobHornAccelerationObj.setValueConfig(0.25, 4, 1);
knobHornAccelerationObj.setSkewForCenter(1);
knobHornAccelerationObj.setCursorResponsive(true);
knobHornAccelerationObj.setLabel('HORN<br>ACCELERATION', labelCSSMid);
knobHornAccelerationObj.setLabelResponsive(true, 2, 'x');
knobHornAccelerationObj.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobHornDecelerationObj = new Knob(containerHornDeceleration, sizeRatioKnobMid, 'hornDeceleration', devMode);
knobHornDecelerationObj.setIndicatorSprite(pathSpriteKnobMid);
knobHornDecelerationObj.setScale(pathScaleKnobMid, sizeRatioScaleKnobMid, positionTopAndLeftFinetuneScaleKnobMid);
knobHornDecelerationObj.setValueConfig(0.25, 4, 1);
knobHornDecelerationObj.setSkewForCenter(1);
knobHornDecelerationObj.setCursorResponsive(true);
knobHornDecelerationObj.setLabel('HORN<br>DECELERATION', labelCSSMid);
knobHornDecelerationObj.setLabelResponsive(true, 2, 'x');
knobHornDecelerationObj.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobDrumAccelerationObj = new Knob(containerDrumAcceleration, sizeRatioKnobMid, 'drumAcceleration', devMode);
knobDrumAccelerationObj.setIndicatorSprite(pathSpriteKnobMid);
knobDrumAccelerationObj.setScale(pathScaleKnobMid, sizeRatioScaleKnobMid, positionTopAndLeftFinetuneScaleKnobMid);
knobDrumAccelerationObj.setValueConfig(0.25, 4, 1);
knobDrumAccelerationObj.setSkewForCenter(1);
knobDrumAccelerationObj.setCursorResponsive(true);
knobDrumAccelerationObj.setLabel('DRUM<br>ACCELERATION', labelCSSMid);
knobDrumAccelerationObj.setLabelResponsive(true, 2, 'x');
knobDrumAccelerationObj.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobDrumDecelerationObj = new Knob(containerDrumDeceleration, sizeRatioKnobMid, 'drumDeceleration', devMode);
knobDrumDecelerationObj.setIndicatorSprite(pathSpriteKnobMid);
knobDrumDecelerationObj.setScale(pathScaleKnobMid, sizeRatioScaleKnobMid, positionTopAndLeftFinetuneScaleKnobMid);
knobDrumDecelerationObj.setValueConfig(0.25, 4, 1);
knobDrumDecelerationObj.setSkewForCenter(1);
knobDrumDecelerationObj.setCursorResponsive(true);
knobDrumDecelerationObj.setLabel('DRUM<br>DECELERATION', labelCSSMid);
knobDrumDecelerationObj.setLabelResponsive(true, 2, 'x');
knobDrumDecelerationObj.setLabelEditable(true);


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
export const knobHornMicPanObj_L = new Knob(containerHornMicPan_L, sizeRatioKnobSamll, 'hornMicPan_L', devMode);
knobHornMicPanObj_L.setIndicatorSprite(pathSpriteKnobSmall);
knobHornMicPanObj_L.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall, positionTopAndLeftFinetuneScaleKnobSmall);
knobHornMicPanObj_L.setValueConfig(-100, 100, -100);
knobHornMicPanObj_L.setCursorResponsive(true);
knobHornMicPanObj_L.setLabel('PAN', labelCSSSmall);
knobHornMicPanObj_L.setLabelResponsive(true, 0);
knobHornMicPanObj_L.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobHornMicPanObj_R = new Knob(containerHornMicPan_R, sizeRatioKnobSamll, 'hornMicPan_R', devMode);
knobHornMicPanObj_R.setIndicatorSprite(pathSpriteKnobSmall);
knobHornMicPanObj_R.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall, positionTopAndLeftFinetuneScaleKnobSmall);
knobHornMicPanObj_R.setValueConfig(-100, 100, 100);
knobHornMicPanObj_R.setCursorResponsive(true);
knobHornMicPanObj_R.setLabel('PAN', labelCSSSmall);
knobHornMicPanObj_R.setLabelResponsive(true, 0);
knobHornMicPanObj_R.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobDrumMicPanObj_L = new Knob(containerDrumMicPan_L, sizeRatioKnobSamll, 'drumMicPan_L', devMode);
knobDrumMicPanObj_L.setIndicatorSprite(pathSpriteKnobSmall);
knobDrumMicPanObj_L.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall, positionTopAndLeftFinetuneScaleKnobSmall);
knobDrumMicPanObj_L.setValueConfig(-100, 100, -100);
knobDrumMicPanObj_L.setCursorResponsive(true);
knobDrumMicPanObj_L.setLabel('PAN', labelCSSSmall);
knobDrumMicPanObj_L.setLabelResponsive(true, 0);
knobDrumMicPanObj_L.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobDrumMicPanObj_R = new Knob(containerDrumMicPan_R, sizeRatioKnobSamll, 'drumMicPan_R', devMode);
knobDrumMicPanObj_R.setIndicatorSprite(pathSpriteKnobSmall);
knobDrumMicPanObj_R.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall, positionTopAndLeftFinetuneScaleKnobSmall);
knobDrumMicPanObj_R.setValueConfig(-100, 100, 100);
knobDrumMicPanObj_R.setCursorResponsive(true);
knobDrumMicPanObj_R.setLabel('PAN', labelCSSSmall);
knobDrumMicPanObj_R.setLabelResponsive(true, 0);
knobDrumMicPanObj_R.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const knobOutputGainObj = new Knob(containerOutputGain, sizeRatioKnobBig, 'outputGain', devMode);
knobOutputGainObj.setIndicatorSprite(pathSpriteKnobBig);
knobOutputGainObj.setScale(pathScaleKnobBig, sizeRatioScaleKnobBig, positionTopandLeftFinetuneScaleKnobBig);
knobOutputGainObj.setValueConfig(-120, 6, -12);
knobOutputGainObj.setSkewForCenter(-12);
knobOutputGainObj.setCursorResponsive(true);
knobOutputGainObj.setLabel('OUTPUT GAIN', labelCSSBig);
knobOutputGainObj.setLabelResponsive(true, 1, 'dB');
knobOutputGainObj.setLabelEditable(true);