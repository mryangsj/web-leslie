import Wheel from '/js/Wheel.js';

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const containerHornSpeed = document.getElementById('wheel-container-hornSpeed');
const containerDrumSpeed = document.getElementById('wheel-container-drumSpeed');


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const devMode = false;
//-----------------------------------------------------------------------------------------
const sizeRatioWheel = 0.71;
const spritePathWheel = '/resources/image/wheel/wheel_vertical.png';
const sizeRatioScaleWheel = 0.8;
const spritePathScaleWheel = '/resources/image/wheel/wheel_scale.png';
const labelCSSWheel = 'wheel-label';
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const wheelHornSpeedObj = new Wheel(containerHornSpeed, sizeRatioWheel, 'hornSpeed', devMode);
wheelHornSpeedObj.setIndicatorSprite(spritePathWheel);
wheelHornSpeedObj.setScale(spritePathScaleWheel, sizeRatioScaleWheel);
wheelHornSpeedObj.setValueConfig(-50, 50, 0);
wheelHornSpeedObj.setLabel('HORN<br>SPEED', labelCSSWheel);
wheelHornSpeedObj.setLabelResponsive(true, 1, '%');
wheelHornSpeedObj.setLabelEditable(true);


const wheelDrumSpeedObj = new Wheel(containerDrumSpeed, sizeRatioWheel, 'drumSpeed', devMode);
wheelDrumSpeedObj.setIndicatorSprite(spritePathWheel);
wheelDrumSpeedObj.setScale(spritePathScaleWheel, sizeRatioScaleWheel);
wheelDrumSpeedObj.setValueConfig(-50, 50, 0);
wheelDrumSpeedObj.setLabel('DRUM<br>SPEED', labelCSSWheel);
wheelDrumSpeedObj.setLabelResponsive(true, 1, '%');
wheelHornSpeedObj.setLabelEditable(true);