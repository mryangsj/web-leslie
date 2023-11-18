import Knob from './js/Knob.js';
   
   //knob control
    const containerSpring = document.getElementById('knobSpring')
    const containerMicDistance = document.getElementById('knobMicDistance')
    const containerLowSpeed = document.getElementById('knobLowSpeed')
    const containerAcce = document.getElementById('knobAcce')
    const containerFastSpeed = document.getElementById('knobFastSpeed')
    const containerDece = document.getElementById('knobDece')

    const containerGain = document.getElementById('knobGain')
    const containerVolume = document.getElementById('knobVolume')
    const containerHPF = document.getElementById('knobHPF')
    const containerLow = document.getElementById('knobLow')
    const containerMid = document.getElementById('knobMid')
    const containerHigh = document.getElementById('knobHigh')

    const containerHighF = document.getElementById('knobHighF')
    const containerHighG = document.getElementById('knobHighG')
    const containerMidF = document.getElementById('knobMidF')
    const containerMidQ = document.getElementById('knobMidQ')
    const containerMidG = document.getElementById('knobMidG')
    const containerLowF = document.getElementById('knobLowF')
    const containerLowG = document.getElementById('knobLowG')

    const containerLinkLR1 = document.getElementById('knobLinkLR1')
    const containerLinkLR2 = document.getElementById('knobLinkLR2')
    const containerLinkLR3 = document.getElementById('knobLinkLR3')
    const containerLinkLR4 = document.getElementById('knobLinkLR4')

      function createKnob(container, knobName,spritePath,spriteLength) {
        // const container = document.getElementById(containerId);
        let knobSize = 70;
        // if (window.innerWidth > 1500) {
        //   knobSize = 120;
        // } else if (window.innerWidth > 1200) {
        //   knobSize = 90;
        // }
        // 创建新的 Knob 实例
        const knob = new Knob(knobSize, knobName, 0, 1, 0.5, 2, `dB`, spritePath, spriteLength);
        knob.style.top = `50%`;
        knob.style.left = `30%`;
        knob.style.transform = `translate(-50%, -50%)`;
        document.body.style.cursor = `grabbing`;
        
        // 添加到容器中
        container.appendChild(knob);
        return knob;
        
      }
      
    createKnob(containerSpring, 'SPRING');
    createKnob(containerMicDistance, 'MIC-DISTANCE');
    createKnob(containerLowSpeed, 'LOW-SPEED');
    createKnob(containerAcce, 'ACCELERATION');
    createKnob(containerFastSpeed, 'FAST-SPEED');
    createKnob(containerDece, 'DECELERATION');

    createKnob(containerGain, 'GAIN');
    createKnob(containerVolume, 'VOLUME');
    createKnob(containerHPF, 'INPUT-HPF');
    createKnob(containerLow, 'LOW');
    createKnob(containerMid, 'MID');
    createKnob(containerHigh, 'HIGH');

    createKnob(containerHighF, 'GAIN');
    createKnob(containerHighG, 'VOLUME');
    createKnob(containerMidF, 'INPUT-HPF');
    createKnob(containerMidQ, 'LOW');
    createKnob(containerMidG, 'MID');
    createKnob(containerLowF, 'HIGH');
    createKnob(containerLowG, 'HIGH');

    createKnob(containerLinkLR1, 'LinkLR1','resources/KnobMid.png',129);
    createKnob(containerLinkLR2, 'LinkLR2','resources/KnobMid.png',129);
    createKnob(containerLinkLR3, 'LinkLR3','resources/KnobMid.png',129);
    createKnob(containerLinkLR4, 'LinkLR4','resources/KnobMid.png',129);