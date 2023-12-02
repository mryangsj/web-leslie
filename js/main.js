import Knob from '/js/Knob.js';
// import Switch from './switch.js';

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// get elements
const audioPlayer = document.getElementById('audioPlayer');
const btnPower = document.getElementById('btnPower');
const hornRotor = document.querySelector('#horn');
const drumRotor = document.querySelector('#drum');
const hornRate = document.querySelector('#hornRate');
const drumRate = document.querySelector('#drumRate');
const btnMode = document.querySelector('#btnMode');
const btnBrake = document.querySelector('#btnBrake');
const hornImg = document.querySelector('#leslieHorn');


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// 'MODE' switch
// const switchModeObj = new Switch();

//-----------------------------------------------------------------------------------------
// horn
// 'SLOW SPEED' knob of horn
const knobHornSlowSpeedObj = new Knob(100, 'SLOW SPEED', -100, 100, 0, 0, '%');
const knobHornSlowSpeed = knobHornSlowSpeedObj.dom;
knobHornSlowSpeed.style.top = '25%';
knobHornSlowSpeed.style.left = '10%';
knobHornSlowSpeed.style.transform = 'translate(-50%, -50%)';
// 'Fast SPEED' knob of horn
const knobHornFastSpeedObj = new Knob(100, 'FAST SPEED', -100, 100, 0, 0, '%');
const knobHornFastSpeed = knobHornFastSpeedObj.dom;
knobHornFastSpeed.style.top = '40%';
knobHornFastSpeed.style.left = '10%';
knobHornFastSpeed.style.transform = 'translate(-50%, -50%)';
// 'ACCELERATION' knob of horn
const knobHornAccelerationObj = new Knob(100, 'ACCELERATION', 0.25, 4, 1, 2, 'x');
const knobHornAcceleration = knobHornAccelerationObj.dom;
knobHornAcceleration.style.top = '55%';
knobHornAcceleration.style.left = '10%';
knobHornAcceleration.style.transform = 'translate(-50%, -50%)';
knobHornAccelerationObj.setSkewFactorByMidValue(1);
// 'DECELERATION' knob of horn
const knobHornDecelerationObj = new Knob(100, 'DECELERATION', 0.25, 4, 1, 2, 'x');
const knobHornDeceleration = knobHornDecelerationObj.dom;
knobHornDeceleration.style.top = '70%';
knobHornDeceleration.style.left = '10%';
knobHornDeceleration.style.transform = 'translate(-50%, -50%)';
knobHornDecelerationObj.setSkewFactorByMidValue(1);

//-----------------------------------------------------------------------------------------
// drum
// 'SLOW SPEED' knob of drum
const knobDrumSlowSpeedObj = new Knob(100, 'SLOW SPEED', -20, 20, 0, 0, '%');
const knobDrumSlowSpeed = knobDrumSlowSpeedObj.dom;
knobDrumSlowSpeed.style.top = '25%';
knobDrumSlowSpeed.style.left = '20%';
knobDrumSlowSpeed.style.transform = 'translate(-50%, -50%)';
// 'Fast SPEED' knob of drum
const knobDrumFastSpeedObj = new Knob(100, 'FAST SPEED', -20, 20, 0, 0, '%');
const knobDrumFastSpeed = knobDrumFastSpeedObj.dom;
knobDrumFastSpeed.style.top = '40%';
knobDrumFastSpeed.style.left = '20%';
knobDrumFastSpeed.style.transform = 'translate(-50%, -50%)';
// 'ACCELERATION' knob of drum
const knobDrumAccelerationObj = new Knob(100, 'ACCELERATION', 0.25, 4, 1, 2, 'x');
const knobDrumAcceleration = knobDrumAccelerationObj.dom;
knobDrumAcceleration.style.top = '55%';
knobDrumAcceleration.style.left = '20%';
knobDrumAcceleration.style.transform = 'translate(-50%, -50%)';
knobDrumAccelerationObj.setSkewFactorByMidValue(1);
// 'DECELERATION' knob of drum
const knobDrumDecelerationObj = new Knob(100, 'DECELERATION', 0.25, 4, 1, 2, 'x');
const knobDrumDeceleration = knobDrumDecelerationObj.dom;
knobDrumDeceleration.style.top = '70%';
knobDrumDeceleration.style.left = '20%';
knobDrumDeceleration.style.transform = 'translate(-50%, -50%)';
knobDrumDecelerationObj.setSkewFactorByMidValue(1);

//-----------------------------------------------------------------------------------------
// 'HORN' knob (horn volume)
const knobHornObj = new Knob(100, 'HORN', -200, 6, 0, 1, 'dB');
const knobHorn = knobHornObj.dom;
knobHorn.style.top = '50%';
knobHorn.style.left = '60%';
knobHorn.style.transform = 'translate(50%, -50%)';
knobHornObj.setSkewFactorByMidValue(-3);

//-----------------------------------------------------------------------------------------
// 'DRUM' knob (drum volume)
const knobDrumObj = new Knob(100, 'DRUM', -200, 3, 0, 1, 'dB');
const knobDrum = knobDrumObj.dom;
knobDrum.style.top = '50%';
knobDrum.style.left = '70%';
knobDrum.style.transform = 'translate(50%, -50%)';
knobDrumObj.setSkewFactorByMidValue(-3);

//-----------------------------------------------------------------------------------------
// 'OUTPUT' knob (master volume)
const knobOutputObj = new Knob(100, 'OUTPUT', -200, 3, 0, 1, 'dB');
const knobOutput = knobOutputObj.dom;
knobOutput.style.top = '50%';
knobOutput.style.left = '90%';
knobOutput.style.transform = 'translate(-50%, -50%)';
knobOutputObj.setSkewFactorByMidValue(-3);


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// create audio context
const audioContext = new AudioContext();
audioContext.suspend();

//-----------------------------------------------------------------------------------------
// create audio context nodes
const mp3Node = audioContext.createMediaElementSource(audioPlayer);

//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// add audio processor and connect audio context nodes
(async function () {
  await audioContext.audioWorklet.addModule('./js/audioProcessor.js')
})().then(() => {
  //-----------------------------------------------------------------------------------------
  // 创建分频器
  const hpfNode = new BiquadFilterNode(audioContext, { type: 'highpass', frequency: 800 });
  const lpfNode = new BiquadFilterNode(audioContext, { type: 'lowpass', frequency: 800 });
  // 创建leslie效果器
  const leslieNode = new AudioWorkletNode(audioContext, 'leslie-processor', {
    numberOfInputs: 2,
    numberOfOutputs: 2,
    outputChannelCount: [2, 2],
  });
  // 创建panner
  const pannerHornNode = new StereoPannerNode(audioContext, { pan: 0 });
  const pannerDrumNode = new StereoPannerNode(audioContext, { pan: 0 });
  // 创建gain
  const hornGainNode = new GainNode(audioContext, { gain: 1 });
  const drumGainNode = new GainNode(audioContext, { gain: 1 });
  const outputGainNode = new GainNode(audioContext, { gain: 1 });
  // 连接
  mp3Node.connect(hpfNode);
  mp3Node.connect(lpfNode);
  hpfNode.connect(leslieNode, 0, 0);
  lpfNode.connect(leslieNode, 0, 1);
  // leslieNode.connect(audioContext.destination);
  leslieNode.connect(pannerHornNode, 0, 0);
  leslieNode.connect(pannerDrumNode, 1, 0);
  pannerHornNode.connect(hornGainNode);
  pannerDrumNode.connect(drumGainNode);
  hornGainNode.connect(outputGainNode);
  drumGainNode.connect(outputGainNode);
  outputGainNode.connect(audioContext.destination);


  //-----------------------------------------------------------------------------------------
  // 注册knob值改变事件
  knobHornSlowSpeed.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setHornSlowSpeedFineTune', value: knobHornSlowSpeedObj.currentValue }); });
  knobHornFastSpeed.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setHornFastSpeedFineTune', value: knobHornFastSpeedObj.currentValue }); });
  knobHornAcceleration.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setHornAccelerationFineTune', value: knobHornAccelerationObj.currentValue }); });
  knobHornDeceleration.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setHornDecelerationFineTune', value: knobHornDecelerationObj.currentValue }); });
  knobDrumSlowSpeed.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setDrumSlowSpeedFineTune', value: knobDrumSlowSpeedObj.currentValue }); });
  knobDrumFastSpeed.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setDrumFastSpeedFineTune', value: knobDrumFastSpeedObj.currentValue }); });
  knobDrumAcceleration.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setDrumAccelerationFineTune', value: knobDrumAccelerationObj.currentValue }); });
  knobDrumDeceleration.addEventListener('changed', () => { leslieNode.port.postMessage({ type: 'setDrumDecelerationFineTune', value: knobDrumDecelerationObj.currentValue }); });
  knobHorn.addEventListener('changed', () => { hornGainNode.gain.value = Math.pow(10, knobHornObj.currentValue / 20); });
  knobDrum.addEventListener('changed', () => { drumGainNode.gain.value = Math.pow(10, knobDrumObj.currentValue / 20); });
  knobOutput.addEventListener('changed', () => { outputGainNode.gain.value = Math.pow(10, knobOutputObj.currentValue / 20); });

  //-----------------------------------------------------------------------------------------
  // 注册模式切换按钮点击事件
  btnMode.addEventListener('click', () => {
    // 响应按钮点击事件
    if (btnMode.getAttribute('aria-checked') === 'slow') {
      // 更新信号量
      btnMode.setAttribute('aria-checked', 'fast');
      // 更新按钮状态
      btnMode.querySelector('span').innerText = 'FAST';
      // 更新leslie效果器的参数
      leslieNode.port.postMessage({ type: 'setRotorMode', value: 1 });
    } else {
      btnMode.setAttribute('aria-checked', 'slow');
      // 更新按钮状态
      btnMode.querySelector('span').innerText = 'SLOW';
      // 更新leslie效果器的参数
      leslieNode.port.postMessage({ type: 'setRotorMode', value: 0 });
    }
  });

  //-----------------------------------------------------------------------------------------
  // 注册刹车按钮点击事件
  btnBrake.addEventListener('click', () => {
    // 响应按钮点击事件
    if (btnBrake.getAttribute('aria-checked') === 'false') {
      // 更新信号量
      btnBrake.setAttribute('aria-checked', 'true');
      // 更新按钮状态
      btnBrake.querySelector('span').innerText = 'Brake-ON';
      // 更新leslie效果器的参数
      leslieNode.port.postMessage({ type: 'setRotorBrake', value: true });
    } else {
      btnBrake.setAttribute('aria-checked', 'false');
      // 更新按钮状态
      btnBrake.querySelector('span').innerText = 'Brake-OFF';
      // 更新leslie效果器的参数
      leslieNode.port.postMessage({ type: 'setRotorBrake', value: false });
    }
  });

  //-----------------------------------------------------------------------------------------
  // 控制rotor转动
  function updateRotor() {
    if (audioContext.state === 'running') {
      leslieNode.port.postMessage({ type: 'getRotorInstantDegree' });
      leslieNode.port.postMessage({ type: 'getRotorInstantRate' });
    }
    requestAnimationFrame(updateRotor);
  };
  requestAnimationFrame(updateRotor);

  leslieNode.port.onmessage = (event) => {
    if (event.data.type === 'rotorInstantDegree') {
      hornRotor.style.transform = `rotate(${event.data.value[0]}deg)`;
      drumRotor.style.transform = `rotate(${event.data.value[1]}deg)`;
      // console.log(event.data.value);
    } else if (event.data.type === 'rotorInstantRate') {
      hornRate.innerText = `${event.data.value[0].toFixed(2)}Hz`;
      drumRate.innerText = `${event.data.value[1].toFixed(2)}Hz`;
    }

    // if (event.data.type === 'rotorInstantDegree') {
    //   const hornDegree = event.data.value[0];
    //   const index = Math.round(hornDegree / 360 * (72 - 1));
    //   hornImg.style.backgroundPosition = `0 ${-index * 1080}px`;
    // }
  };
}).catch((err) => {
  console.log(err);
});


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
// 注册总开关点击事件
btnPower.addEventListener('click', () => {
  // 响应按钮点击事件
  if (btnPower.getAttribute('aria-checked') === 'false') {
    // 更新信号量
    btnPower.setAttribute('aria-checked', 'true');
    // 更新总开关按钮状态
    btnPower.querySelector('span').innerText = 'ON';
    // 恢复音频上下文
    audioContext.resume();
  } else {
    btnPower.setAttribute('aria-checked', 'false');
    // 更新总开关按钮状态
    btnPower.querySelector('span').innerText = 'OFF';
    // 暂停音频上下文
    audioContext.suspend();
  }
});
