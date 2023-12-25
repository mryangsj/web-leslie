import Knob from '/js/Knob.js';

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const containerLeslieHorn = document.getElementById('meter-container-leslieHorn');
const containerLeslieDrum = document.getElementById('meter-container-leslieDrum');

const containerHornMicCorrelation = document.getElementById('meter-container-hornCorrelation');
const containerDrumMicCorrelation = document.getElementById('meter-container-drumCorrelation');


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// const devMode = true;
const devMode = false;
//-----------------------------------------------------------------------------------------
const sizeRatioLeslieHorn = 1;
const spritePathLeslieHorn = '/resources/image/leslie/leslie_horn.png';
const spritePathLeslieDrum = '/resources/image/leslie/leslie_drum.png';
const spriteFillDirectionLeslieHorn = 'width';


//-----------------------------------------------------------------------------------------
const sizeRatioLED = 1.23;
const spritePathLED = '/resources/image/led/led_correlation.png';
const spriteFillDirectionLED = 'width';
const positionTopLeftFinetuneLEDCorrelation = [0.2, -0.0016];
const labelCSSWheel = 'led-correlation-label';
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
export const leslieHornObj = new Knob(containerLeslieHorn, sizeRatioLeslieHorn, 'leslieHorn', devMode);
leslieHornObj.setIndicatorSprite(spritePathLeslieHorn, spriteFillDirectionLeslieHorn);
leslieHornObj.setValueConfig(0, 179, 0);
//-----------------------------------------------------------------------------------------
export const leslieDrumObj = new Knob(containerLeslieDrum, sizeRatioLeslieHorn, 'leslieDrum', devMode);
leslieDrumObj.setIndicatorSprite(spritePathLeslieDrum, spriteFillDirectionLeslieHorn);
leslieDrumObj.setValueConfig(0, 359, 0);
//-----------------------------------------------------------------------------------------
export const ledHornCorrelationObj = new Knob(containerHornMicCorrelation, sizeRatioLED, 'hornCorrelation', devMode);
ledHornCorrelationObj.setIndicatorSprite(spritePathLED, spriteFillDirectionLED, positionTopLeftFinetuneLEDCorrelation);
ledHornCorrelationObj.setLabel('HORN MIC CORRELATION', labelCSSWheel);
ledHornCorrelationObj.setValueConfig(-1, 1, 0);
//-----------------------------------------------------------------------------------------
export const ledDrumCorrelationObj = new Knob(containerDrumMicCorrelation, sizeRatioLED, 'drumCorrelation', devMode);
ledDrumCorrelationObj.setIndicatorSprite(spritePathLED, spriteFillDirectionLED, positionTopLeftFinetuneLEDCorrelation);
ledDrumCorrelationObj.setLabel('DRUM MIC CORRELATION', labelCSSWheel);
ledDrumCorrelationObj.setValueConfig(-1, 1, 0);