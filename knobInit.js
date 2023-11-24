import Knob from './js/Knob.js';

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// get container
const containerSpring = document.getElementById('knobSpring')
const containerMicDistance = document.getElementById('knobMicDistance')
const containerLowSpeed = document.getElementById('knobLowSpeed')
const containerAcce = document.getElementById('knobAcce')
const containerFastSpeed = document.getElementById('knobFastSpeed')
const containerDece = document.getElementById('knobDece')

const containerGain = document.getElementById('knobGain')
const containerVolume = document.getElementById('knobVolume')
const containerHPF = document.getElementById('knobHPF')
const containerLow = document.getElementById('knobLow')
const containerMid = document.getElementById('knobMid')
const containerHigh = document.getElementById('knobHigh')

const containerHighF = document.getElementById('knobHighF')
const containerHighG = document.getElementById('knobHighG')
const containerMidF = document.getElementById('knobMidF')
const containerMidQ = document.getElementById('knobMidQ')
const containerMidG = document.getElementById('knobMidG')
const containerLowF = document.getElementById('knobLowF')
const containerLowG = document.getElementById('knobLowG')

const containerLinkLR1 = document.getElementById('knobLinkLR1')
const containerLinkLR2 = document.getElementById('knobLinkLR2')
const containerLinkLR3 = document.getElementById('knobLinkLR3')
const containerLinkLR4 = document.getElementById('knobLinkLR4')


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// caculate suitable knob size
// calculate the width-to-height ratio
const width = window.innerWidth;
const height = window.innerHeight;
const ratio = width / height;
// const container = document.getElementById(containerId);
let knobSize = 70;

if (ratio > 1.5 && window.innerWidth > 1500) {
  // increase knob size for larger width-to-height ratios
  knobSize = 100;
} else if (ratio > 1.3 && window.innerWidth > 1200) {
  // increase knob size for larger width-to-height ratios
  knobSize = 80;
}

// if (window.innerWidth > 1500) {
//   knobSize = 120;
// } else if (window.innerWidth > 1200) {
//   knobSize = 90;
// }


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
function createKnob(container, knobLabel, valueStart, valueEnd, defaultValue, numberDecimals, suffix, spritePath, spriteLength, midValue, devMode = true) {
  // create knob object
  const knobObj = new Knob(knobSize, knobLabel, valueStart, valueEnd, defaultValue, numberDecimals, suffix, spritePath, spriteLength, devMode);
  const knobDom = knobObj.dom;
  // set skew factor
  if (midValue) { knobObj.setSkewFactorByMidValue(midValue); }
  // configure knob position
  knobDom.style.top = '50%';
  knobDom.style.left = '30%';
  knobDom.style.transform = 'translate(-50%, -50%)';
  // add knob to container
  container.appendChild(knobDom);
  return knobObj;
}


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const knobSpringObj = createKnob(containerSpring, 'SPRING', 0, 10, 0, 1, '', 'resources/KnobMid.png', 129);
const knobMidDistanceObj = createKnob(containerMicDistance, 'MIC DISTANCE', 1, 10, 1, 1, '', 'resources/KnobMid.png', 129);
const knobSlowSpeedObj = createKnob(containerLowSpeed, 'SLOW SPEED', -20, 20, 0, 0, '%', 'resources/KnobMid.png', 129);
const knobAccelerationObj = createKnob(containerAcce, 'ACCELERATION', 0.25, 4, 1, 2, 'x', 'resources/KnobMid.png', 129, 1);
const knobFastSpeedObj = createKnob(containerFastSpeed, 'FAST SPEED', -20, 20, 0, 0, '%', 'resources/KnobMid.png', 129);
const knobDecelerationObj = createKnob(containerDece, 'DECELERATION', 0.25, 4, 1, 2, 'x', 'resources/KnobMid.png', 129, 1);
//-----------------------------------------------------------------------------------------
const knobGainObj = createKnob(containerGain, 'GAIN', 1.0, 10, 4.4, 1, '', 'resources/KnobMid.png', 129);
const knobVolumeObj = createKnob(containerVolume, 'VOLUME', 1, 10, 4.1, 1, '', 'resources/KnobMid.png', 129);
const knobHPFObj = createKnob(containerHPF, 'INPUT HPF', 20, 200, 20, 0, 'Hz', 'resources/KnobMid.png', 129);
const knobLowObj = createKnob(containerLow, 'LOW', 0, 10, 5, 1, '', 'resources/KnobMid.png', 129);
const knobMidObj = createKnob(containerMid, 'MID', 0, 10, 5, 1, '', 'resources/KnobMid.png', 129);
const knobHighObj = createKnob(containerHigh, 'HIGH', 0, 10, 5, 1, '', 'resources/KnobMid.png', 129);
//-----------------------------------------------------------------------------------------
const knobHighFreqObj = createKnob(containerHighF, 'HIGH FREQ', 1.5, 18, 4, 2, 'KHz', 'resources/KnobMid.png', 129, 3.5);
const knobHighGainObj = createKnob(containerHighG, 'HIGH GAIN', -15, 15, 0, 1, 'dB', 'resources/KnobMid.png', 129);
const knobMidFreqObj = createKnob(containerMidF, 'MID FREQ', 100, 15000, 1000, 1, 'Hz', 'resources/KnobMid.png', 129, 2000);
const knobMidQObj = createKnob(containerMidQ, 'MID Q', 0.1, 5, 1, 1, '', 'resources/KnobMid.png', 129, 0.7);
const knobMidGainObj = createKnob(containerMidG, 'MID GAIN', -15, 15, 0, 1, 'dB', 'resources/KnobMid.png', 129);
const knobLowFreqObj = createKnob(containerLowF, 'LOW FREQ', 20, 400, 100, 0, 'Hz', 'resources/KnobMid.png', 129, 80);
const knobLowGainObj = createKnob(containerLowG, 'LOW GAIN', -15, 15, 0, 1, 'dB', 'resources/KnobMid.png', 129);
//-----------------------------------------------------------------------------------------
createKnob(containerLinkLR1, 'C', -1.0, 1.0, 0, 1, '', 'resources/KnobMid.png', 129);
createKnob(containerLinkLR2, 'C', -1.0, 1.0, 0, 1, '', 'resources/KnobMid.png', 129);
createKnob(containerLinkLR3, 'C', -1.0, 1.0, 0, 1, '', 'resources/KnobMid.png', 129);
createKnob(containerLinkLR4, 'C', -1.0, 1.0, 0, 1, '', 'resources/KnobMid.png', 129);