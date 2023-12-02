import Switch from '/js/Switch.js';

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
const containerPower = document.getElementById('switch-container-power');


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
const switchPowerObj = new Switch(containerPower, sizeRatioSwitch, 'power', devMode);
switchPowerObj.setIndicatorSprite(spritePathSwitch, spriteFillDirection);
switchPowerObj.setValueConfig(0, 1, 0);
switchPowerObj.createLabelStatic('ON', labelCSSSwitch_top);
switchPowerObj.createLabelStatic('OFF', labelCSSSwitch_bottom);
const switchPower_label_OFF = document.createElement('div');
const switchPower_label_ON = document.createElement('div');