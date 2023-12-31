import Wheel from '/js/Wheel.js';

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const containerHornSpeed = document.getElementById('wheel-container-hornSpeed');
const containerDrumSpeed = document.getElementById('wheel-container-drumSpeed');


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// const devMode = true;
const devMode = false;
//-----------------------------------------------------------------------------------------
const sizeRatioWheel = 0.76;
const spritePathWheel = '/resources/image/wheel/wheel_vertical.png';
const spriteFillDirection = 'height';
const sizeRatioScaleWheel = 0.8;
const spritePathScaleWheel = '/resources/image/wheel/wheel_scale.png';
const labelCSSWheel = 'wheel-label';
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
export const wheelHornSpeedObj = new Wheel(containerHornSpeed, sizeRatioWheel, 'hornSpeed', devMode);
wheelHornSpeedObj.setIndicatorSprite(spritePathWheel, spriteFillDirection);
wheelHornSpeedObj.setScale(spritePathScaleWheel, sizeRatioScaleWheel);
wheelHornSpeedObj.setValueConfig(-30, 30, 0);
wheelHornSpeedObj.setCursorResponsive(true);
wheelHornSpeedObj.setLabel('HORN<br>SPEED', labelCSSWheel);
wheelHornSpeedObj.setLabelResponsive(true, 1, '%');
wheelHornSpeedObj.setLabelEditable(true);
//-----------------------------------------------------------------------------------------
export const wheelDrumSpeedObj = new Wheel(containerDrumSpeed, sizeRatioWheel, 'drumSpeed', devMode);
wheelDrumSpeedObj.setIndicatorSprite(spritePathWheel, spriteFillDirection);
wheelDrumSpeedObj.setScale(spritePathScaleWheel, sizeRatioScaleWheel);
wheelDrumSpeedObj.setValueConfig(-30, 30, 0);
wheelDrumSpeedObj.setCursorResponsive(true);
wheelDrumSpeedObj.setLabel('DRUM<br>SPEED', labelCSSWheel);
wheelDrumSpeedObj.setLabelResponsive(true, 1, '%');
wheelDrumSpeedObj.setLabelEditable(true);