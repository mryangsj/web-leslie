import Knob from '/js/Knob copy.js';

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


const devMode = false;

const sizeRatioKnobSamll = 0.85;
const spritePathKnobSmall = 'resources/image/knob/knob_small.png';
const sizeRatioScaleKnobSmall = 0.85;
const pathScaleKnobSmall = 'resources/image/knob/knob_small_scale.png'

const sizeRatioKnobMid = 1.2;
const spritePathKnobMid = 'resources/image/knob/knob_mid.png';
const sizeRatioScaleKnobMid = 0.85;
const pathScaleKnobMid = 'resources/image/knob/knob_mid_scale.png'

const sizeRatioKnobBig = 0.67;
const spritePathKnobBig = 'resources/image/knob/knob_big.png';
const sizeRatioScaleKnobBig = 0.95;
const pathScaleKnobBig = 'resources/image/knob/knob_mid_scale.png'
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const knobInputGainObj = new Knob(containerGain, sizeRatioKnobBig, 'INPUT GAIN', devMode);
knobInputGainObj.setValueConfig(1.0, 10, 4.4,);
knobInputGainObj.setValueDecimals(1);
knobInputGainObj.setIndicatorSprite(spritePathKnobBig);
knobInputGainObj.setScale(pathScaleKnobBig, sizeRatioScaleKnobBig);
//-----------------------------------------------------------------------------------------
const knobInputHPFObj = new Knob(containerInputHPF, sizeRatioKnobSamll, 'INPUT HPF', devMode);
knobInputHPFObj.setValueConfig(20, 200, 20);
knobInputHPFObj.setValueDecimals(0);
knobInputHPFObj.setValueSuffix('Hz');
knobInputHPFObj.setIndicatorSprite(spritePathKnobSmall);
knobInputHPFObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobInputLPFObj = new Knob(containerInputLPF, sizeRatioKnobSamll, 'INPUT LPF', devMode);
knobInputLPFObj.setValueConfig(8000, 20000, 20000);
knobInputLPFObj.setValueDecimals(0);
knobInputLPFObj.setValueSuffix('Hz');
knobInputLPFObj.setIndicatorSprite(spritePathKnobSmall);
knobInputLPFObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobHighFreqObj = new Knob(containerHighFreq, sizeRatioKnobSamll, 'HIGH SHELF<br>FREQ', devMode);
knobHighFreqObj.setValueConfig(1.5, 18, 4);
knobHighFreqObj.setSkewFactorByMidValue(3.5);
knobHighFreqObj.setValueDecimals(1);
knobHighFreqObj.setValueSuffix('kHz');
knobHighFreqObj.setIndicatorSprite(spritePathKnobSmall);
knobHighFreqObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobHighGainObj = new Knob(containerHighGain, sizeRatioKnobSamll, 'HIGH SHELF<br>GAIN', devMode);
knobHighGainObj.setValueConfig(-15, 15, 0);
knobHighGainObj.setValueDecimals(1);
knobHighGainObj.setValueSuffix('dB');
knobHighGainObj.setIndicatorSprite(spritePathKnobSmall);
knobHighGainObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobMidFreqObj = new Knob(containerMidFreq, sizeRatioKnobSamll, 'MID FREQ', devMode);
knobMidFreqObj.setValueConfig(100, 15000, 1000);
knobMidFreqObj.setSkewFactorByMidValue(2000);
knobMidFreqObj.setValueDecimals(0);
knobMidFreqObj.setValueSuffix('Hz');
knobMidFreqObj.setIndicatorSprite(spritePathKnobSmall);
knobMidFreqObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobMidGainObj = new Knob(containerMidGain, sizeRatioKnobSamll, 'MID GAIN', devMode);
knobMidGainObj.setValueConfig(-15, 15, 0);
knobMidGainObj.setValueDecimals(1);
knobMidGainObj.setValueSuffix('dB');
knobMidGainObj.setIndicatorSprite(spritePathKnobSmall);
knobMidGainObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobLowFreqObj = new Knob(containerLowFreq, sizeRatioKnobSamll, 'LOW SHELF<br>FREQ', devMode);
knobLowFreqObj.setValueConfig(20, 400, 100);
knobLowFreqObj.setSkewFactorByMidValue(80);
knobLowFreqObj.setValueDecimals(0);
knobLowFreqObj.setValueSuffix('Hz');
knobLowFreqObj.setIndicatorSprite(spritePathKnobSmall);
knobLowFreqObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobLowGainObj = new Knob(containerLowGain, sizeRatioKnobSamll, 'LOW SHELF<br>GAIN', devMode);
knobLowGainObj.setValueConfig(-15, 15, 0);
knobLowGainObj.setValueDecimals(1);
knobLowGainObj.setValueSuffix('dB');
knobLowGainObj.setIndicatorSprite(spritePathKnobSmall);
knobLowGainObj.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const knobHornAccelerationObj = new Knob(containerHornAcceleration, sizeRatioKnobMid, 'HORN<br>ACCELERATION', devMode);
knobHornAccelerationObj.setValueConfig(0.25, 4, 1);
knobHornAccelerationObj.setSkewFactorByMidValue(1);
knobHornAccelerationObj.setValueDecimals(2);
knobHornAccelerationObj.setValueSuffix('x');
knobHornAccelerationObj.setIndicatorSprite(spritePathKnobMid);
knobHornAccelerationObj.setScale(pathScaleKnobMid, sizeRatioScaleKnobMid);
//-----------------------------------------------------------------------------------------
const knobHornDecelerationObj = new Knob(containerHornDeceleration, sizeRatioKnobMid, 'HORN<br>DECELERATION', devMode);
knobHornDecelerationObj.setValueConfig(0.25, 4, 1);
knobHornDecelerationObj.setSkewFactorByMidValue(1);
knobHornDecelerationObj.setValueDecimals(2);
knobHornDecelerationObj.setValueSuffix('x');
knobHornDecelerationObj.setIndicatorSprite(spritePathKnobMid);
knobHornDecelerationObj.setScale(pathScaleKnobMid, sizeRatioScaleKnobMid);
//-----------------------------------------------------------------------------------------
const knobDrumAccelerationObj = new Knob(containerDrumAcceleration, sizeRatioKnobMid, 'DRUM<br>ACCELERATION', devMode);
knobDrumAccelerationObj.setValueConfig(0.25, 4, 1);
knobDrumAccelerationObj.setSkewFactorByMidValue(1);
knobDrumAccelerationObj.setValueDecimals(2);
knobDrumAccelerationObj.setValueSuffix('x');
knobDrumAccelerationObj.setIndicatorSprite(spritePathKnobMid);
knobDrumAccelerationObj.setScale(pathScaleKnobMid, sizeRatioScaleKnobMid);
//-----------------------------------------------------------------------------------------
const knobDrumDecelerationObj = new Knob(containerDrumDeceleration, sizeRatioKnobMid, 'DRUM<br>DECELERATION', devMode);
knobDrumDecelerationObj.setValueConfig(0.25, 4, 1);
knobDrumDecelerationObj.setSkewFactorByMidValue(1);
knobDrumDecelerationObj.setValueDecimals(2);
knobDrumDecelerationObj.setValueSuffix('x');
knobDrumDecelerationObj.setIndicatorSprite(spritePathKnobMid);
knobDrumDecelerationObj.setScale(pathScaleKnobMid, sizeRatioScaleKnobMid);


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const knobHornMicPanObj_L = new Knob(containerHornMicPan_L, sizeRatioKnobSamll, 'C', devMode);
knobHornMicPanObj_L.setValueConfig(-100, 100, 0);
knobHornMicPanObj_L.setValueDecimals(0);
knobHornMicPanObj_L.setIndicatorSprite(spritePathKnobSmall);
knobHornMicPanObj_L.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobHornMicPanObj_R = new Knob(containerHornMicPan_R, sizeRatioKnobSamll, 'C', devMode);
knobHornMicPanObj_R.setValueConfig(-100, 100, 0);
knobHornMicPanObj_R.setValueDecimals(0);
knobHornMicPanObj_R.setIndicatorSprite(spritePathKnobSmall);
knobHornMicPanObj_R.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobDrumMicPanObj_L = new Knob(containerDrumMicPan_L, sizeRatioKnobSamll, 'C', devMode);
knobDrumMicPanObj_L.setValueConfig(-100, 100, 0);
knobDrumMicPanObj_L.setValueDecimals(0);
knobDrumMicPanObj_L.setIndicatorSprite(spritePathKnobSmall);
knobDrumMicPanObj_L.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobDrumMicPanObj_R = new Knob(containerDrumMicPan_R, sizeRatioKnobSamll, 'C', devMode);
knobDrumMicPanObj_R.setValueConfig(-100, 100, 0);
knobDrumMicPanObj_R.setValueDecimals(0);
knobDrumMicPanObj_R.setIndicatorSprite(spritePathKnobSmall);
knobDrumMicPanObj_R.setScale(pathScaleKnobSmall, sizeRatioScaleKnobSmall);
//-----------------------------------------------------------------------------------------
const knobOutputGainObj = new Knob(containerOutputGain, sizeRatioKnobBig, 'OUTPUT GAIN', devMode);
knobOutputGainObj.setValueConfig(-120, 6, 0);
knobOutputGainObj.setSkewFactorByMidValue(-6);
knobOutputGainObj.setValueDecimals(1);
knobOutputGainObj.setValueSuffix('dB');
knobOutputGainObj.setIndicatorSprite(spritePathKnobBig);
knobOutputGainObj.setScale(pathScaleKnobBig, sizeRatioScaleKnobBig);