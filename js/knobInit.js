import Knob from '/js/Knob.js';

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const containerGain = document.getElementById('knob-container-inputGain');
const containerInputHPF = document.getElementById('knob-container-inputHPF');
const containerInputLPF = document.getElementById('knob-container-inputLPF');
const containerHighFreq = document.getElementById('knob-container-highFreq');
const containerHighGain = document.getElementById('knob-container-highGain');
const containerMidFreq = document.getElementById('knob-container-midFreq');
const containerMidGain = document.getElementById('knob-container-midGain');
const containerLowFreq = document.getElementById('knob-container-lowFreq');
const containerLowGain = document.getElementById('knob-container-lowGain');
//-----------------------------------------------------------------------------------------
const containerHornSpeed = document.getElementById('wheel-container-hornSpeed');
const containerHornAcceleration = document.getElementById('knob-container-hornAcceleration');
const containerHornDeceleration = document.getElementById('knob-container-hornDeceleration');
const containerDrumSpeed = document.getElementById('wheel-container-drumSpeed');
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
const devMode = false;
//-----------------------------------------------------------------------------------------
const sizeRatioKnobSamll = 0.8;
const spritePathKnobSmall = 'resources/image/knob/knob_small.png';
const sizeRatioScaleKnobSmall = 0.85;
const pathScaleKnobSmall = 'resources/image/knob/knob_small_scale.png'
const labelCSSSmall = 'small-knob-label'
//-----------------------------------------------------------------------------------------
const sizeRatioKnobMid = 1.1;
const spritePathKnobMid = 'resources/image/knob/knob_mid.png';
const sizeRatioScaleKnobMid = 0.85;
const pathScaleKnobMid = 'resources/image/knob/knob_mid_scale.png'
const labelCSSMid = 'mid-knob-label'
//-----------------------------------------------------------------------------------------
const sizeRatioKnobBig = 0.65;
const spritePathKnobBig = 'resources/image/knob/knob_big.png';
const sizeRatioScaleKnobBig = 0.95;
const pathScaleKnobBig = 'resources/image/knob/knob_mid_scale.png'
const labelCSSBig = 'big-knob-label'
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const knobInputGainObj = new Knob(containerGain, sizeRatioKnobBig, 'inputGain', devMode);
knobInputGainObj.setValueConfig(1.0, 10, 4.4);
knobInputGainObj.setLabel('INPUT GAIN', labelCSSBig);
knobInputGainObj.setLabelResponsive(true, 1);
knobInputGainObj.setLabelEditable(true);
knobInputGainObj.setIndicatorSprite(spritePathKnobBig);
knobInputGainObj.setScale(pathScaleKnobBig, sizeRatioScaleKnobBig);
//-----------------------------------------------------------------------------------------
const knobInputHPFObj = new Knob(containerInputHPF, sizeRatioKnobSamll, 'inputHPF', devMode);
knobInputHPFObj.setValueConfig(20, 200, 20);
knobInputHPFObj.setLabel('INPUT HPF', labelCSSSmall);
knobInputHPFObj.setLabelResponsive(true, 0, 'Hz');
knobInputHPFObj.setLabelEditable(true);
knobInputHPFObj.setIndicatorSprite(spritePathKnobSmall);
knobInputHPFObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobInputLPFObj = new Knob(containerInputLPF, sizeRatioKnobSamll, 'inputLPF', devMode);
knobInputLPFObj.setValueConfig(5, 20, 18);
knobInputLPFObj.setSkewFactorByMidValue(10);
knobInputLPFObj.setLabel('INPUT LPF', labelCSSSmall);
knobInputLPFObj.setLabelResponsive(true, 1, 'kHz');
knobInputLPFObj.setLabelEditable(true);
knobInputLPFObj.setIndicatorSprite(spritePathKnobSmall);
knobInputLPFObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobHighFreqObj = new Knob(containerHighFreq, sizeRatioKnobSamll, 'highShelfFreq', devMode);
knobHighFreqObj.setValueConfig(2, 18, 8);
knobHighFreqObj.setSkewFactorByMidValue(6);
knobHighFreqObj.setLabel('HIGH SHELF<br>FREQ', labelCSSSmall);
knobHighFreqObj.setLabelResponsive(true, 1, 'kHz');
knobHighFreqObj.setLabelEditable(true);
knobHighFreqObj.setIndicatorSprite(spritePathKnobSmall);
knobHighFreqObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobHighGainObj = new Knob(containerHighGain, sizeRatioKnobSamll, 'highShelfGain', devMode);
knobHighGainObj.setValueConfig(-15, 15, 0);
knobHighGainObj.setLabel('HIGH SHELF<br>GAIN', labelCSSSmall);
knobHighGainObj.setLabelResponsive(true, 1, 'dB');
knobHighGainObj.setLabelEditable(true);
knobHighGainObj.setIndicatorSprite(spritePathKnobSmall);
knobHighGainObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobMidFreqObj = new Knob(containerMidFreq, sizeRatioKnobSamll, 'midFreq', devMode);
knobMidFreqObj.setValueConfig(400, 8000, 1000);
knobMidFreqObj.setSkewFactorByMidValue(2000);
knobMidFreqObj.setLabel('MID FREQ', labelCSSSmall);
knobMidFreqObj.setLabelResponsive(true, 0, 'Hz');
knobMidFreqObj.setLabelEditable(true);
knobMidFreqObj.setIndicatorSprite(spritePathKnobSmall);
knobMidFreqObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobMidGainObj = new Knob(containerMidGain, sizeRatioKnobSamll, 'midGain', devMode);
knobMidGainObj.setValueConfig(-15, 15, 0);
knobMidGainObj.setLabel('MID GAIN', labelCSSSmall);
knobMidGainObj.setLabelResponsive(true, 1, 'dB');
knobMidGainObj.setLabelEditable(true);
knobMidGainObj.setIndicatorSprite(spritePathKnobSmall);
knobMidGainObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobLowFreqObj = new Knob(containerLowFreq, sizeRatioKnobSamll, 'lowShelfFreq', devMode);
knobLowFreqObj.setValueConfig(50, 400, 100);
knobLowFreqObj.setSkewFactorByMidValue(120);
knobLowFreqObj.setLabel('LOW SHELF<br>FREQ', labelCSSSmall);
knobLowFreqObj.setLabelResponsive(true, 0, 'Hz');
knobLowFreqObj.setLabelEditable(true);
knobLowFreqObj.setIndicatorSprite(spritePathKnobSmall);
knobLowFreqObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobLowGainObj = new Knob(containerLowGain, sizeRatioKnobSamll, 'lowShlfGain', devMode);
knobLowGainObj.setValueConfig(-15, 15, 0);
knobLowGainObj.setLabel('LOW SHELF<br>GAIN', labelCSSSmall);
knobLowGainObj.setLabelResponsive(true, 1, 'dB');
knobLowGainObj.setLabelEditable(true);
knobLowGainObj.setIndicatorSprite(spritePathKnobSmall);
knobLowGainObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const knobHornAccelerationObj = new Knob(containerHornAcceleration, sizeRatioKnobMid, 'hornAcceleration', devMode);
knobHornAccelerationObj.setValueConfig(0.25, 4, 1);
knobHornAccelerationObj.setSkewFactorByMidValue(1);
knobHornAccelerationObj.setLabel('HORN<br>ACCELERATION', labelCSSMid);
knobHornAccelerationObj.setLabelResponsive(true, 2, 'x');
knobHornAccelerationObj.setLabelEditable(true);
knobHornAccelerationObj.setIndicatorSprite(spritePathKnobMid);
knobHornAccelerationObj.setScale(pathScaleKnobMid, sizeRatioScaleKnobMid);
//-----------------------------------------------------------------------------------------
const knobHornDecelerationObj = new Knob(containerHornDeceleration, sizeRatioKnobMid, 'hornDeceleration', devMode);
knobHornDecelerationObj.setValueConfig(0.25, 4, 1);
knobHornDecelerationObj.setSkewFactorByMidValue(1);
knobHornDecelerationObj.setLabel('HORN<br>DECELERATION', labelCSSMid);
knobHornDecelerationObj.setLabelResponsive(true, 2, 'x');
knobHornDecelerationObj.setLabelEditable(true);
knobHornDecelerationObj.setIndicatorSprite(spritePathKnobMid);
knobHornDecelerationObj.setScale(pathScaleKnobMid, sizeRatioScaleKnobMid);
//-----------------------------------------------------------------------------------------
const knobDrumAccelerationObj = new Knob(containerDrumAcceleration, sizeRatioKnobMid, 'drumAcceleration', devMode);
knobDrumAccelerationObj.setValueConfig(0.25, 4, 1);
knobDrumAccelerationObj.setSkewFactorByMidValue(1);
knobDrumAccelerationObj.setLabel('DRUM<br>ACCELERATION', labelCSSMid);
knobDrumAccelerationObj.setLabelResponsive(true, 2, 'x');
knobDrumAccelerationObj.setLabelEditable(true);
knobDrumAccelerationObj.setIndicatorSprite(spritePathKnobMid);
knobDrumAccelerationObj.setScale(pathScaleKnobMid, sizeRatioScaleKnobMid);
//-----------------------------------------------------------------------------------------
const knobDrumDecelerationObj = new Knob(containerDrumDeceleration, sizeRatioKnobMid, 'drumDeceleration', devMode);
knobDrumDecelerationObj.setValueConfig(0.25, 4, 1);
knobDrumDecelerationObj.setSkewFactorByMidValue(1);
knobDrumDecelerationObj.setLabel('DRUM<br>DECELERATION', labelCSSMid);
knobDrumDecelerationObj.setLabelResponsive(true, 2, 'x');
knobDrumDecelerationObj.setLabelEditable(true);
knobDrumDecelerationObj.setIndicatorSprite(spritePathKnobMid);
knobDrumDecelerationObj.setScale(pathScaleKnobMid, sizeRatioScaleKnobMid);


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const knobHornMicPanObj_L = new Knob(containerHornMicPan_L, sizeRatioKnobSamll, 'hornMicPan_L', devMode);
knobHornMicPanObj_L.setValueConfig(-100, 100, 0);
knobHornMicPanObj_L.setLabel('PAN', labelCSSSmall);
knobHornMicPanObj_L.setLabelResponsive(true, 0);
knobHornMicPanObj_L.setLabelEditable(true);
knobHornMicPanObj_L.setIndicatorSprite(spritePathKnobSmall);
knobHornMicPanObj_L.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobHornMicPanObj_R = new Knob(containerHornMicPan_R, sizeRatioKnobSamll, 'hornMicPan_R', devMode);
knobHornMicPanObj_R.setValueConfig(-100, 100, 0);
knobHornMicPanObj_R.setLabel('PAN', labelCSSSmall);
knobHornMicPanObj_R.setLabelResponsive(true, 0);
knobHornMicPanObj_R.setLabelEditable(true);
knobHornMicPanObj_R.setIndicatorSprite(spritePathKnobSmall);
knobHornMicPanObj_R.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobDrumMicPanObj_L = new Knob(containerDrumMicPan_L, sizeRatioKnobSamll, 'drumMicPan_L', devMode);
knobDrumMicPanObj_L.setValueConfig(-100, 100, 0);
knobDrumMicPanObj_L.setLabel('PAN', labelCSSSmall);
knobDrumMicPanObj_L.setLabelResponsive(true, 0);
knobDrumMicPanObj_L.setLabelEditable(true);
knobDrumMicPanObj_L.setIndicatorSprite(spritePathKnobSmall);
knobDrumMicPanObj_L.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobDrumMicPanObj_R = new Knob(containerDrumMicPan_R, sizeRatioKnobSamll, 'drumMicPan_R', devMode);
knobDrumMicPanObj_R.setValueConfig(-100, 100, 0);
knobDrumMicPanObj_R.setLabel('PAN', labelCSSSmall);
knobDrumMicPanObj_R.setLabelResponsive(true, 0);
knobDrumMicPanObj_R.setLabelEditable(true);
knobDrumMicPanObj_R.setIndicatorSprite(spritePathKnobSmall);
knobDrumMicPanObj_R.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobOutputGainObj = new Knob(containerOutputGain, sizeRatioKnobBig, 'outputGain', devMode);
knobOutputGainObj.setValueConfig(-120, 6, 0);
knobOutputGainObj.setSkewFactorByMidValue(-6);
knobOutputGainObj.setLabel('OUTPUT GAIN', labelCSSBig);
knobOutputGainObj.setLabelResponsive(true, 1, 'dB');
knobOutputGainObj.setLabelEditable(true);
knobOutputGainObj.setIndicatorSprite(spritePathKnobBig);
knobOutputGainObj.setScale(pathScaleKnobBig, sizeRatioScaleKnobBig);