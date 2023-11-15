import Knob from './knob.js';

//-----------------------------------------------------------------------------------------
// get elements
const audioPlayer = document.getElementById('audioPlayer');
const buttonPower = document.getElementById('button-power');

//-----------------------------------------------------------------------------------------
// create audio context
const audioContext = new AudioContext();
audioContext.suspend();

//-----------------------------------------------------------------------------------------
// create audio context nodes
const mp3Node = audioContext.createMediaElementSource(audioPlayer);
const gainNode = audioContext.createGain();

//-----------------------------------------------------------------------------------------
// add audio processor and connect audio context nodes
async function addAudioProcessor() {
  await audioContext.audioWorklet.addModule('./js/audioProcessor.js')
}
addAudioProcessor()
  .then(() => {
    const noiseNode = new AudioWorkletNode(audioContext, 'white-noise-generator');
    // noiseNode.connect(gainNode).connect(audioContext.destination);
    mp3Node.connect(gainNode).connect(audioContext.destination);
  })
  .catch((err) => {
    console.log(err);
  });

//-----------------------------------------------------------------------------------------
// create knob (master volume)
const knobMasterVolumeObj = new Knob(100, 'OUTPUT', -200, 6, 0, 1, 'dB');
const knobMasterVolume = knobMasterVolumeObj.dom;
knobMasterVolume.style.top = '50%';
knobMasterVolume.style.left = '10%';
knobMasterVolume.style.transform = 'translate(-50%, -50%)';
knobMasterVolumeObj.setSkewFactorByMidValue(-6);

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

//-----------------------------------------------------------------------------------------
// 注册master volume事件
knobMasterVolume.addEventListener('drag', () => {
  const amp = Math.pow(10, knobMasterVolumeObj.currentValue / 20);
  gainNode.gain.value = amp;
});
