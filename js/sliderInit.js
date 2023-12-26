import Slider from '/js/Slider.js';

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const containerHornMicWidth = document.getElementById('slider-container-hornMicWidth');
const containerDrumMicWidth = document.getElementById('slider-container-drumMicWidth');

const containerHornMicLevel_L = document.getElementById('slider-container-hornMicLevel_L');
const containerHornMicLevel_R = document.getElementById('slider-container-hornMicLevel_R');
const containerDrumMicLevel_L = document.getElementById('slider-container-drumMicLevel_L');
const containerDrumMicLevel_R = document.getElementById('slider-container-drumMicLevel_R');


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const devMode = false;
// const devMode = true;
//-----------------------------------------------------------------------------------------
const sizeRatioSliderHor = 1.15;
const spritePathSliderHor = 'resources/image/slider/slider_hor.png';
const spriteFillDirectionHor = 'width';
const spritePathScaleSliderHor = 'resources/image/slider/slider_hor_scale.png';
const sizeRatioScaleSliderHor = 0.735;
const positionTopLeftFinetuneSiliderHor = [-0.3, 0.006];
const positionTopLeftFinetuneScaleSiliderHor = [0.0054, -0.0035];
//-----------------------------------------------------------------------------------------
const sizeRatioSliderVer = 1.05;
const spritePathSliderVer = 'resources/image/slider/slider_ver.png';
const spriteFillDirectionVer = 'height';
const spritePathScaleSliderVer = 'resources/image/slider/slider_ver_scale.png';
const sizeRatioScaleSliderVer = 0.618;
const positionTopLeftFinetuneSiliderVer = [-0.08, 0];
const positionTopLeftFinetuneScaleSiliderVer = [0.00497, 0];
const labelCSSSlider = 'slider-ver-label';


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
export const sliderHornMicWidthObj = new Slider(containerHornMicWidth, sizeRatioSliderHor, 'hornMicWidth', devMode);
sliderHornMicWidthObj.setIndicatorSprite(spritePathSliderHor, spriteFillDirectionHor, positionTopLeftFinetuneSiliderHor);
sliderHornMicWidthObj.setScale(spritePathScaleSliderHor, sizeRatioScaleSliderHor, positionTopLeftFinetuneScaleSiliderHor);
sliderHornMicWidthObj.setValueConfig(0, 90, 45);
sliderHornMicWidthObj.setDerectionResponseToMouse('horizontal');
sliderHornMicWidthObj.setCursorResponsive(true);
sliderHornMicWidthObj.setLabel('HORN MIC WIDTH', labelCSSSlider);
sliderHornMicWidthObj.setLabelResponsive(true, 1, '°');
sliderHornMicWidthObj.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const sliderDrumMicWidthObj = new Slider(containerDrumMicWidth, sizeRatioSliderHor, 'drumMicWidth', devMode);
sliderDrumMicWidthObj.setIndicatorSprite(spritePathSliderHor, spriteFillDirectionHor, positionTopLeftFinetuneSiliderHor);
sliderDrumMicWidthObj.setScale(spritePathScaleSliderHor, sizeRatioScaleSliderHor, positionTopLeftFinetuneScaleSiliderHor);
sliderDrumMicWidthObj.setValueConfig(0, 90, 30);
sliderDrumMicWidthObj.setDerectionResponseToMouse('horizontal');
sliderDrumMicWidthObj.setCursorResponsive(true);
sliderDrumMicWidthObj.setLabel('DRUM MIC WIDTH', labelCSSSlider);
sliderDrumMicWidthObj.setLabelResponsive(true, 1, '°');
sliderDrumMicWidthObj.setLabelEditable(true);


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
export const sliderHornMicLevelObj_L = new Slider(containerHornMicLevel_L, sizeRatioSliderVer, 'hornMic_L', devMode);
sliderHornMicLevelObj_L.setIndicatorSprite(spritePathSliderVer, spriteFillDirectionVer, positionTopLeftFinetuneSiliderVer);
sliderHornMicLevelObj_L.setScale(spritePathScaleSliderVer, sizeRatioScaleSliderVer, positionTopLeftFinetuneScaleSiliderVer);
sliderHornMicLevelObj_L.setValueConfig(-120, 6, 0);
sliderHornMicLevelObj_L.setSkewForCenter(-12);
sliderHornMicLevelObj_L.setCursorResponsive(true);
sliderHornMicLevelObj_L.setLabel('L', labelCSSSlider);
sliderHornMicLevelObj_L.setLabelResponsive(true, 1, 'dB');
sliderHornMicLevelObj_L.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const sliderHornMicLevelObj_R = new Slider(containerHornMicLevel_R, sizeRatioSliderVer, 'hornMic_R', devMode);
sliderHornMicLevelObj_R.setIndicatorSprite(spritePathSliderVer, spriteFillDirectionVer, positionTopLeftFinetuneSiliderVer);
sliderHornMicLevelObj_R.setScale(spritePathScaleSliderVer, sizeRatioScaleSliderVer, positionTopLeftFinetuneScaleSiliderVer);
sliderHornMicLevelObj_R.setValueConfig(-120, 6, 0);
sliderHornMicLevelObj_R.setSkewForCenter(-12);
sliderHornMicLevelObj_R.setCursorResponsive(true);
sliderHornMicLevelObj_R.setLabel('R', labelCSSSlider);
sliderHornMicLevelObj_R.setLabelResponsive(true, 1, 'dB');
sliderHornMicLevelObj_R.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const sliderDrumMicLevelObj_L = new Slider(containerDrumMicLevel_L, sizeRatioSliderVer, 'drumMic_L', devMode);
sliderDrumMicLevelObj_L.setIndicatorSprite(spritePathSliderVer, spriteFillDirectionVer, positionTopLeftFinetuneSiliderVer);
sliderDrumMicLevelObj_L.setScale(spritePathScaleSliderVer, sizeRatioScaleSliderVer, positionTopLeftFinetuneScaleSiliderVer);
sliderDrumMicLevelObj_L.setValueConfig(-120, 6, 0);
sliderDrumMicLevelObj_L.setSkewForCenter(-12);
sliderDrumMicLevelObj_L.setCursorResponsive(true);
sliderDrumMicLevelObj_L.setLabel('L', labelCSSSlider);
sliderDrumMicLevelObj_L.setLabelResponsive(true, 1, 'dB');
sliderDrumMicLevelObj_L.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const sliderDrumMicLevelObj_R = new Slider(containerDrumMicLevel_R, sizeRatioSliderVer, 'drumMic_R', devMode);
sliderDrumMicLevelObj_R.setIndicatorSprite(spritePathSliderVer, spriteFillDirectionVer, positionTopLeftFinetuneSiliderVer);
sliderDrumMicLevelObj_R.setScale(spritePathScaleSliderVer, sizeRatioScaleSliderVer, positionTopLeftFinetuneScaleSiliderVer);
sliderDrumMicLevelObj_R.setValueConfig(-120, 6, 0);
sliderDrumMicLevelObj_R.setSkewForCenter(-12);
sliderDrumMicLevelObj_R.setCursorResponsive(true);
sliderDrumMicLevelObj_R.setLabel('R', labelCSSSlider);
sliderDrumMicLevelObj_R.setLabelResponsive(true, 1, 'dB');
sliderDrumMicLevelObj_R.setLabelEditable(true);