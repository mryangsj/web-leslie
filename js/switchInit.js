import Switch from '/js/Switch.js';

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const containerPower = document.getElementById('switch-container-power');

const containerButtonSlow = document.getElementById('button-container-buttonSlow');
const containerButtonFast = document.getElementById('button-container-buttonFast');
const containerButtonBrake = document.getElementById('button-container-buttonBrake');

const containerHornLevelLink = document.getElementById('switch-container-hornMicLevelLink');
const containerDrumLevelLink = document.getElementById('switch-container-drumMicLevelLink');


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// const devMode = true;
const devMode = false;
//-----------------------------------------------------------------------------------------
const sizeRatioSwitch = 1.4;
const spritePathSwitch = '/resources/image/switch/switch.png';
const spriteFillDirection = 'width';
const labelCSSSwitch_top = 'switch-label_top';
const labelCSSSwitch_bottom = 'switch-label_bottom';
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
export const switchPowerObj = new Switch(containerPower, sizeRatioSwitch, 'power', devMode);
switchPowerObj.setIndicatorSprite(spritePathSwitch, spriteFillDirection);
switchPowerObj.setValueConfig(0, 1, 0);
switchPowerObj.createLabelStatic('ON', labelCSSSwitch_top);
switchPowerObj.createLabelStatic('OFF', labelCSSSwitch_bottom);


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const sizeRatioButton = 1.1;
const spritePathButton = '/resources/image/button/button.png';
const spriteFillDirectionButton = 'width';
const positionTopLeftFinetuneButton = [-0.02, 0];
const labelCSSButton = 'button-label_center';
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
export const buttonSlowObj = new Switch(containerButtonSlow, sizeRatioButton, 'buttonSlow', devMode);
buttonSlowObj.setIndicatorSprite(spritePathButton, spriteFillDirectionButton, positionTopLeftFinetuneButton);
buttonSlowObj.setValueConfig(0, 1, 1);
buttonSlowObj.createLabelStatic('SLOW', labelCSSButton);
//-----------------------------------------------------------------------------------------
export const buttonFastObj = new Switch(containerButtonFast, sizeRatioButton, 'buttonFast', devMode);
buttonFastObj.setIndicatorSprite(spritePathButton, spriteFillDirectionButton, positionTopLeftFinetuneButton);
buttonFastObj.setValueConfig(0, 1, 0);
buttonFastObj.createLabelStatic('FAST', labelCSSButton);
//-----------------------------------------------------------------------------------------
export const buttonBrakeObj = new Switch(containerButtonBrake, sizeRatioButton, 'buttonBrake', devMode);
buttonBrakeObj.setIndicatorSprite(spritePathButton, spriteFillDirectionButton, positionTopLeftFinetuneButton);
buttonBrakeObj.setValueConfig(0, 1, 0);
buttonBrakeObj.createLabelStatic('BRAKE', labelCSSButton);


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const sizeRatioSwitchLink = 0.7;
const spritePathSwitchLink = '/resources/image/button/button_small.png';
const spriteFillDirectionSwitchLink = 'width';
const positionTopLeftFinetuneSwitchLink = [0, 0];
const labelCSSSwitchLink = 'button-label_bottom';
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
export const switchHornLevelLinkObj = new Switch(containerHornLevelLink, sizeRatioSwitchLink, 'hornLevelLink', devMode);
switchHornLevelLinkObj.setIndicatorSprite(spritePathSwitchLink, spriteFillDirectionSwitchLink, positionTopLeftFinetuneSwitchLink);
switchHornLevelLinkObj.setValueConfig(0, 1, 1);
switchHornLevelLinkObj.createLabelStatic('LINK', labelCSSSwitchLink);
switchHornLevelLinkObj.domContainer.style.width = '40%';
//-----------------------------------------------------------------------------------------
export const switchDrumLevelLinkObj = new Switch(containerDrumLevelLink, sizeRatioSwitchLink, 'drumLevelLink', devMode);
switchDrumLevelLinkObj.setIndicatorSprite(spritePathSwitchLink, spriteFillDirectionSwitchLink, positionTopLeftFinetuneSwitchLink);
switchDrumLevelLinkObj.setValueConfig(0, 1, 1);
switchDrumLevelLinkObj.createLabelStatic('LINK', labelCSSSwitchLink);
switchDrumLevelLinkObj.domContainer.style.width = '40%';