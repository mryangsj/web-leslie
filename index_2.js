function openFileUploader() {
document.getElementById('fileInput').click();
}

function handleFileSelect(event) {
  const fileInput = event.target;
  const files = fileInput.files;

  if (files.length > 0) {
    const selectedFile = files[0];
    console.log('Selected File:', selectedFile);

    const audioPlayer = document.getElementById('audioPlayer');

    const audioSource = URL.createObjectURL(selectedFile);
    audioPlayer.src = audioSource;
  }
}

let activeButton = null;

document.addEventListener('DOMContentLoaded', function () {
  // Select the first button and set it as active by default
  const firstButton = document.querySelector('.button_container button');
  toggleColor(firstButton, 0);
});

function toggleColor(button, containerIndex) {
  if (activeButton) {
      activeButton.classList.remove('active');
  }

  if (activeButton !== button) {
      button.classList.add('active');
      activeButton = button;
  } else {
      activeButton = null;
  }

  // Hide all knob containers
  const knobContainers = document.querySelectorAll('.knob_container');
  knobContainers.forEach((container, index) => {
      if (index === containerIndex) {
          // Show the selected knob container
          //container.style.display = 'block';
          container.classList.remove('knob_container_hide');
      } else {
          // Hide other knob containers
          container.classList.add('knob_container_hide')
      }
  });
}

const knob_spring = document.getElementById('knob_spring');
const pointer_spring = document.getElementById('pointer_spring');
const slider_spring = document.getElementById('slider_spring');

const knob_mic_distance = document.getElementById('knob_mic_distance');
const pointer_mic_distance = document.getElementById('pointer_mic_distance');
const slider_mic_distance = document.getElementById('slider_mic_distance');

const knob_slow_speed = document.getElementById('knob_slow_speed');
const pointer_slow_speed = document.getElementById('pointer_slow_speed');
const slider_slow_speed = document.getElementById('slider_slow_speed');

const knob_acce = document.getElementById('knob_acce');
const pointer_acce = document.getElementById('pointer_acce');
const slider_acce = document.getElementById('slider_acce');

const knob_fast_spd = document.getElementById('knob_fast_spd');
const pointer_fast_spd = document.getElementById('pointer_fast_spd');
const slider_fast_spd = document.getElementById('slider_fast_spd');

const knob_dece = document.getElementById('knob_dece');
const pointer_dece = document.getElementById('pointer_dece');
const slider_dece = document.getElementById('slider_dece');

const knob_gain = document.getElementById('knob_gain');
const pointer_gain = document.getElementById('pointer_gain');
const slider_gain = document.getElementById('slider_gain');

const knob_VOLUME = document.getElementById('knob_VOLUME');
const pointer_VOLUME = document.getElementById('pointer_VOLUME');
const slider_VOLUME = document.getElementById('slider_VOLUME');

const knob_HPF = document.getElementById('knob_HPF');
const pointer_HPF = document.getElementById('pointer_HPF');
const slider_HPF = document.getElementById('slider_HPF');

const knob_LOW = document.getElementById('knob_LOW');
const pointer_LOW = document.getElementById('pointer_LOW');
const slider_LOW = document.getElementById('slider_LOW');

const knob_MID = document.getElementById('knob_MID');
const pointer_MID = document.getElementById('pointer_MID');
const slider_MID = document.getElementById('slider_MID');

const knob_HIGH = document.getElementById('knob_HIGH');
const pointer_HIGH = document.getElementById('pointer_HIGH');
const slider_HIGH = document.getElementById('slider_HIGH');

const knob_EQ = document.getElementById('knob_EQ');
const pointer_EQ = document.getElementById('pointer_EQ');
const slider_EQ = document.getElementById('slider_EQ');

const knob_horn_l = document.getElementById('knob-horn-l');
const pointer_horn_l = document.getElementById('pointer-horn-l');
const knobslider_horn_l = document.getElementById('knobslider-horn-l');

const knob_horn_r = document.getElementById('knob-horn-r');
const pointer_horn_r = document.getElementById('pointer-horn-r');
const knobslider_horn_r = document.getElementById('knobslider-horn-r');

const knob_drum_l = document.getElementById('knob-drum-l');
const pointer_drum_l = document.getElementById('pointer-drum-l');
const knobslider_drum_l= document.getElementById('knobslider-drum-l');

const knob_drum_r = document.getElementById('knob-drum-r');
const pointer_drum_r = document.getElementById('pointer-drum-r');
const knobslider_drum_r= document.getElementById('knobslider-drum-r');

// 获取指针初始角度的函数
function getPointerAngle(y, knobCenterX, pointer) {
const x = pointer.getBoundingClientRect().left + pointer.offsetWidth / 2 - knobCenterX;
const angle = Math.atan2(y, x) * (180 / Math.PI);
return angle+90;
}

function handleSliderMovement(knob, pointer, slider) {
  let isDragging = false;
  let knobCenterX; // 提供 knob 的水平中心位置
  let initialPointerAngle; // 记录指针的初始角度

  slider.addEventListener('mousedown', (event) => {
    isDragging = true;
    // 记录初始角度
    const rect = knob.getBoundingClientRect();
    knobCenterX = rect.left + rect.width / 2;
    const knobCenterY = rect.top + rect.height / 2;
    initialPointerAngle = getPointerAngle(knobCenterY, knobCenterX, pointer);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const rect = slider.getBoundingClientRect();
      const sliderTop = rect.top;
      const sliderHeight = rect.height;

      // 计算滑块的相对位置，与指针旋转角度关联
      const sliderRelativePosition = event.clientY - sliderTop;
      const sliderNormalizedPosition = Math.min(Math.max(sliderRelativePosition / sliderHeight, 0), 1);

      // 计算对应的指针旋转角度
      const angle = initialPointerAngle - (sliderNormalizedPosition * 300 - 150);
      pointer.style.transform = `rotate(${angle}deg)`;

      // 计算对应的 normalizedValue
      const normalizedValue = 1 - sliderNormalizedPosition;
      console.log(normalizedValue);
    }
  });
}

handleSliderMovement(knob_spring, pointer_spring, slider_spring);
handleSliderMovement(knob_mic_distance, pointer_mic_distance, slider_mic_distance);
handleSliderMovement(knob_slow_speed, pointer_slow_speed, slider_slow_speed);
handleSliderMovement(knob_acce, pointer_acce, slider_acce);
handleSliderMovement(knob_fast_spd, pointer_fast_spd, slider_fast_spd);
handleSliderMovement(knob_dece, pointer_dece, slider_dece);

handleSliderMovement(knob_gain, pointer_gain, slider_gain);
handleSliderMovement(knob_VOLUME, pointer_VOLUME, slider_VOLUME);
handleSliderMovement(knob_HPF, pointer_HPF, slider_HPF);
handleSliderMovement(knob_LOW, pointer_LOW, slider_LOW);
handleSliderMovement(knob_MID, pointer_MID, slider_MID);
handleSliderMovement(knob_HIGH, pointer_HIGH, slider_HIGH);

handleSliderMovement(knob_EQ, pointer_EQ, slider_EQ);

handleSliderMovement(knob_horn_l, pointer_horn_l, knobslider_horn_l);
handleSliderMovement(knob_horn_r, pointer_horn_r, knobslider_horn_r);
handleSliderMovement(knob_drum_l, pointer_drum_l, knobslider_drum_l);
handleSliderMovement(knob_drum_r, pointer_drum_r, knobslider_drum_r);

document.addEventListener("DOMContentLoaded", function () {
    const rotationTrack = document.querySelector(".rotation-track");
    const rotationFill = document.querySelector(".rotation-fill");
    const rotationThumb = document.querySelector(".rotation-thumb");
  
    rotationThumb.addEventListener("mousedown", (e) => {
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", handleDrag);
      });
    });
  
    function handleDrag(e) {
      const offsetX = e.clientX - rotationTrack.getBoundingClientRect().left;
      const percentage = (offsetX / rotationTrack.clientWidth) * 100;
  
      if (percentage >= 0 && percentage <= 100) {
        rotationFill.style.width = `${percentage}%`;
        rotationThumb.style.left = `${percentage}%`;
  
        // 计算在前1/3，中间1/3，最后1/3的范围
        const oneThird = rotationTrack.clientWidth / 3;
        const twoThirds = oneThird * 2;
  
        if (offsetX <= oneThird) {
          console.log ("0");
        } else if (offsetX <= twoThirds) {
          console.log ("1");
        } else {
          console.log ("2");
        }
      }
    }
  });

  function initSlider(sliderId, handleId) {
    const slider = document.getElementById(sliderId);
    const handle = document.getElementById(handleId);
  
    let isDragging = false;
  
    handle.addEventListener('mousedown', (event) => {
      isDragging = true;
    });
  
    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
  
    window.addEventListener('mousemove', (event) => {
      if (isDragging) {
        const sliderRect = slider.getBoundingClientRect();
        const handleTop = event.clientY - sliderRect.top - handle.clientHeight / 2;
  
        // Limit handle position within the slider
        const handlePosition = Math.min(Math.max(handleTop, 0), slider.clientHeight);
  
        // Calculate the percentage position of the handle within the slider
        const percentage = 1 - handlePosition / slider.clientHeight;
  
        // Calculate the value based on the percentage (assuming a range from 0 to 1)
        const value = percentage.toFixed(2); // Limit to two decimal places
  
        // Update handle position
        handle.style.top = `${handlePosition}px`;
  
        // Log the value to the console
        console.log(value);
      }
    });
  }
  
  // Initialize each slider
  initSlider('slider-horn-l', 'handle-horn-1');
  initSlider('slider-horn-r', 'handle-horn-r');
  initSlider('slider-drum-l', 'handle-drum-l');
  initSlider('slider-drum-r', 'handle-drum-r');
  initSlider('slider-output', 'handle-output');
  