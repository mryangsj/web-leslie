import Meter from '/js/Meter.js';

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const containerLeslieBackground = document.getElementById('meter-container-leslieBackground');
const containerLeslieHorn = document.getElementById('meter-container-leslieHorn');
const containerLeslieDrum = document.getElementById('meter-container-leslieDrum');

const containerLeslieHornMic = document.getElementById('meter-container-leslieHornMic');
const containerLeslieDrumMic = document.getElementById('meter-container-leslieDrumMic');

const containerHornMicCorrelation = document.getElementById('meter-container-hornCorrelation');
const containerDrumMicCorrelation = document.getElementById('meter-container-drumCorrelation');

const containerRMS_L = document.getElementById('meter-container-rms_L');
const containerRMS_R = document.getElementById('meter-container-rms_R');


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// const devMode = true;
const devMode = false;
//-----------------------------------------------------------------------------------------
const sizeRatioLeslieHorn = 1;
const spritePathLeslieBackground = '/resources/image/leslie/leslie_background.png';
const spritePathLeslieHorn = '/resources/image/leslie/leslie_horn.png';
const spritePathLeslieDrum = '/resources/image/leslie/leslie_drum.png';
const spritePathLeslieHornMic = '/resources/image/leslie/leslie_hornMic.png';
const spritePathLeslieDrumMic = '/resources/image/leslie/leslie_drumMic.png';
const spriteFillDirectionLeslieHorn = 'width';
//-----------------------------------------------------------------------------------------
export const leslieBackgroundObj = new Meter(containerLeslieBackground, sizeRatioLeslieHorn, 'leslieBackground', devMode);
leslieBackgroundObj.setIndicatorSprite(spritePathLeslieBackground, spriteFillDirectionLeslieHorn);
leslieBackgroundObj.setValueConfig(0, 1, 0);
//-----------------------------------------------------------------------------------------
export const leslieHornObj = new Meter(containerLeslieHorn, sizeRatioLeslieHorn, 'leslieHorn', devMode);
leslieHornObj.setIndicatorSprite(spritePathLeslieHorn, spriteFillDirectionLeslieHorn);
leslieHornObj.setValueConfig(0, 179, 0);
//-----------------------------------------------------------------------------------------
export const leslieDrumObj = new Meter(containerLeslieDrum, sizeRatioLeslieHorn, 'leslieDrum', devMode);
leslieDrumObj.setIndicatorSprite(spritePathLeslieDrum, spriteFillDirectionLeslieHorn);
leslieDrumObj.setValueConfig(0, 359, 0);
//-----------------------------------------------------------------------------------------
export const leslieHornMicObj = new Meter(containerLeslieHornMic, sizeRatioLeslieHorn, 'leslieHornMic', devMode);
leslieHornMicObj.setIndicatorSprite(spritePathLeslieHornMic, spriteFillDirectionLeslieHorn);
leslieHornMicObj.setValueConfig(0, 90, 0);
//-----------------------------------------------------------------------------------------
export const leslieDrumMicObj = new Meter(containerLeslieDrumMic, sizeRatioLeslieHorn, 'leslieDrumMic', devMode);
leslieDrumMicObj.setIndicatorSprite(spritePathLeslieDrumMic, spriteFillDirectionLeslieHorn);
leslieDrumMicObj.setValueConfig(0, 90, 0);


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const sizeRatioLEDCor = 1.23;
const spritePathLEDCor = '/resources/image/led/led_correlation.png';
const spriteFillDirectionLED = 'width';
const positionTopLeftFinetuneLEDCorrelation = [0.2, -0.0016];
const labelCSSWheel = 'led-correlation-label';
//-----------------------------------------------------------------------------------------
export const ledHornCorrelationObj = new Meter(containerHornMicCorrelation, sizeRatioLEDCor, 'hornCorrelation', devMode);
ledHornCorrelationObj.setIndicatorSprite(spritePathLEDCor, spriteFillDirectionLED, positionTopLeftFinetuneLEDCorrelation);
ledHornCorrelationObj.setLabel('HORN MIC CORRELATION', labelCSSWheel);
ledHornCorrelationObj.setValueConfig(-1, 1, 0);
//-----------------------------------------------------------------------------------------
export const ledDrumCorrelationObj = new Meter(containerDrumMicCorrelation, sizeRatioLEDCor, 'drumCorrelation', devMode);
ledDrumCorrelationObj.setIndicatorSprite(spritePathLEDCor, spriteFillDirectionLED, positionTopLeftFinetuneLEDCorrelation);
ledDrumCorrelationObj.setLabel('DRUM MIC CORRELATION', labelCSSWheel);
ledDrumCorrelationObj.setValueConfig(-1, 1, 0);


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const sizeRatioLEDVol = 1.23;
const spritePathLEDVol = '/resources/image/led/led_volume.png';
//-----------------------------------------------------------------------------------------
export const meterRMS_L_Obj = new Meter(containerRMS_L, sizeRatioLEDVol, 'rms_L', devMode);
meterRMS_L_Obj.setIndicatorSprite(spritePathLEDVol, spriteFillDirectionLED);
meterRMS_L_Obj.setLabel('OUT RMS+', labelCSSWheel);
meterRMS_L_Obj.setValueConfig(-60, 0, -60);
//-----------------------------------------------------------------------------------------
export const meterRMS_R_Obj = new Meter(containerRMS_R, sizeRatioLEDVol, 'rms_R', devMode);
meterRMS_R_Obj.setIndicatorSprite(spritePathLEDVol, spriteFillDirectionLED);
meterRMS_R_Obj.setValueConfig(-60, 0, -60);