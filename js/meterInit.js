import Knob from '/js/Knob.js';

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const containerHornMicCorrelation = document.getElementById('meter-container-hornCorrelation');
const containerDrumMicCorrelation = document.getElementById('meter-container-drumCorrelation');


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// const devMode = true;
const devMode = false;
//-----------------------------------------------------------------------------------------
const sizeRatioLED = 1.23;
const spritePathLED = '/resources/image/led/led_correlation.png';
const spriteFillDirection = 'width';
const positionTopLeftFinetuneLEDCorrelation = [0.2, -0.0016];
const labelCSSWheel = 'led-correlation-label';
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const ledHornCorrelationObj = new Knob(containerHornMicCorrelation, sizeRatioLED, 'hornCorrelation', devMode);
ledHornCorrelationObj.setIndicatorSprite(spritePathLED, spriteFillDirection, positionTopLeftFinetuneLEDCorrelation);
ledHornCorrelationObj.setLabel('HORN MIC CORRELATION', labelCSSWheel);
//-----------------------------------------------------------------------------------------
const ledDrumCorrelationObj = new Knob(containerDrumMicCorrelation, sizeRatioLED, 'drumCorrelation', devMode);
ledDrumCorrelationObj.setIndicatorSprite(spritePathLED, spriteFillDirection, positionTopLeftFinetuneLEDCorrelation);
ledDrumCorrelationObj.setLabel('DRUM MIC CORRELATION', labelCSSWheel);