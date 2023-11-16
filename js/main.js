import Knob from './knob.js';
import Switch from './switch.js';

//-----------------------------------------------------------------------------------------
// get elements
const audioPlayer = document.getElementById('audioPlayer');
const buttonPower = document.getElementById('button-power');
const rotor = document.querySelector('.rotor');

//-----------------------------------------------------------------------------------------
// create audio context
const audioContext = new AudioContext();
audioContext.suspend();

//-----------------------------------------------------------------------------------------
// create audio context nodes
const mp3Node = audioContext.createMediaElementSource(audioPlayer);

//-----------------------------------------------------------------------------------------
// add audio processor and connect audio context nodes
(async function () {
  await audioContext.audioWorklet.addModule('./js/audioProcessor.js')
})().then(() => {
  //-----------------------------------------------------------------------------------------
  // 创建leslie效果器并连接
  const leslieNode = new AudioWorkletNode(audioContext, 'leslie-processor');
  mp3Node.connect(leslieNode).connect(audioContext.destination);

  //-----------------------------------------------------------------------------------------
  // 接收leslie效果器的参数
  const slowSpeedParam = leslieNode.parameters.get('slowSpeed');
  const fastSpeedParam = leslieNode.parameters.get('fastSpeed');
  const outputGainParam = leslieNode.parameters.get('outputGain');

  //-----------------------------------------------------------------------------------------
  // 注册knob值改变事件
  knobSlowSpeed.addEventListener('changed', () => { slowSpeedParam.setValueAtTime(knobSlowSpeedObj.currentValue, audioContext.currentTime); });
  knobFastSpeed.addEventListener('changed', () => { fastSpeedParam.setValueAtTime(knobFastSpeedObj.currentValue, audioContext.currentTime); });
  knobOutput.addEventListener('changed', () => { outputGainParam.setValueAtTime(knobOutputObj.currentValue, audioContext.currentTime); });

  //-----------------------------------------------------------------------------------------
  // 控制rotor旋转
  function updateRotorDegree() {
    leslieNode.port.postMessage({ type: 'rotorInstantDegree' });
    requestAnimationFrame(updateRotorDegree);
  };
  requestAnimationFrame(updateRotorDegree);

  leslieNode.port.onmessage = (event) => {
    if (event.data.type === 'rotorInstantDegree') {
      rotor.style.transform = `rotate(${event.data.value}deg)`;
    }

  };
}).catch((err) => {
  console.log(err);
});

//-----------------------------------------------------------------------------------------
// 'MODE' switch
const switchModeObj = new Switch();

// 'SLOW SPEED' knob
const knobSlowSpeedObj = new Knob(100, 'SLOW SPEED', -50, 50, 0, 0, '%');
const knobSlowSpeed = knobSlowSpeedObj.dom;
knobSlowSpeed.style.top = '40%';
knobSlowSpeed.style.left = '10%';
knobSlowSpeed.style.transform = 'translate(-50%, -50%)';
// 'Fast SPEED' knob
const knobFastSpeedObj = new Knob(100, 'FAST SPEED', -50, 50, 0, 0, '%');
const knobFastSpeed = knobFastSpeedObj.dom;
knobFastSpeed.style.top = '60%';
knobFastSpeed.style.left = '10%';
knobFastSpeed.style.transform = 'translate(-50%, -50%)';
// 'ACCELERATION' knob
const knobAccelerationObj = new Knob(100, 'ACCELERATION', 0.25, 4, 1, 2, 'x');
const knobAcceleration = knobAccelerationObj.dom;
knobAcceleration.style.top = '40%';
knobAcceleration.style.left = '20%';
knobAcceleration.style.transform = 'translate(-50%, -50%)';
knobAccelerationObj.setSkewFactorByMidValue(1);
// 'DECELERATION' knob
const knobDecelerationObj = new Knob(100, 'DECELERATION', 0.25, 4, 1, 2, 'x');
const knobDeceleration = knobDecelerationObj.dom;
knobDeceleration.style.top = '60%';
knobDeceleration.style.left = '20%';
knobDeceleration.style.transform = 'translate(-50%, -50%)';
knobDecelerationObj.setSkewFactorByMidValue(1);
// 'OUTPUT' knob (master volume)
const knobOutputObj = new Knob(100, 'OUTPUT', -200, 6, 0, 1, 'dB');
const knobOutput = knobOutputObj.dom;
knobOutput.style.top = '50%';
knobOutput.style.left = '30%';
knobOutput.style.transform = 'translate(-50%, -50%)';
knobOutputObj.setSkewFactorByMidValue(-6);

//-----------------------------------------------------------------------------------------
// 注册总开关点击事件
buttonPower.addEventListener('click', () => {
  // 响应按钮点击事件
  if (buttonPower.getAttribute('aria-checked') === 'false') {
    // 更新信号量
    buttonPower.setAttribute('aria-checked', 'true');
    // 更新总开关按钮状态
    buttonPower.querySelector('span').innerText = 'OFF';
    // 恢复音频上下文
    audioContext.resume();
  } else {
    buttonPower.setAttribute('aria-checked', 'false');
    // 更新总开关按钮状态
    buttonPower.querySelector('span').innerText = 'ON';
    // 暂停音频上下文
    audioContext.suspend();
  }
});

//-----------------------------------------------------------------------------------------
// 注册播放器事件
audioPlayer.addEventListener('played', () => {
  play.dataset.playing = 'true';
},);

audioPlayer.addEventListener('ended', () => {
  play.dataset.playing = 'false';
},);


