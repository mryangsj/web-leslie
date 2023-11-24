const knob1 = document.getElementById('knob1');
const pointer1 = document.getElementById('pointer1');
const slider1 = document.getElementById('slider1');

const knob2 = document.getElementById('knob2');
const pointer2 = document.getElementById('pointer2');
const slider2 = document.getElementById('slider2');

const knob3 = document.getElementById('knob3');
const pointer3 = document.getElementById('pointer3');
const slider3 = document.getElementById('slider3');

const knob4 = document.getElementById('knob4');
const pointer4 = document.getElementById('pointer4');
const slider4 = document.getElementById('slider4');

const knob5 = document.getElementById('knob5');
const pointer5 = document.getElementById('pointer5');
const slider5 = document.getElementById('slider5');

// 获取指针初始角度的函数
function getPointerAngle(y, knobCenterX, pointer) {
  const x = pointer.getBoundingClientRect().left + pointer.offsetWidth / 2 - knobCenterX;
  const angle = Math.atan2(y, x) * (180 / Math.PI);
  return angle + 90;
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
    if (slider === slider3) {
      initialPointerAngle -= 150;
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const rect = knob.getBoundingClientRect();
      const knobCenterY = rect.top + rect.height / 2;

      // 计算滑块的相对位置，与指针旋转角度关联
      const sliderRelativePosition = knobCenterY - event.clientY + parseFloat(window.getComputedStyle(slider).top); // 加入 slider 的偏移
      const sliderNormalizedPosition = Math.min(Math.max(sliderRelativePosition / (rect.height - slider.clientHeight), 0), 1);

      // 限制滑块的位置范围
      const sliderPosition = Math.min(Math.max(sliderRelativePosition, 0), rect.height - slider.clientHeight);

      // 计算对应的指针旋转角度
      const angle = initialPointerAngle - (sliderNormalizedPosition * 300 - 150);
      pointer.style.transform = `rotate(${angle}deg)`;

      // 计算对应的 normalizedValue
      const normalizedValue = 1 - sliderNormalizedPosition;
      console.log(normalizedValue);
    }
  });
}

handleSliderMovement(knob1, pointer1, slider1);
handleSliderMovement(knob2, pointer2, slider2);
handleSliderMovement(knob3, pointer3, slider3);
handleSliderMovement(knob4, pointer4, slider4);
handleSliderMovement(knob5, pointer5, slider5);


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
        console.log("0");
      } else if (offsetX <= twoThirds) {
        console.log("1");
      } else {
        console.log("2");
      }
    }
  }
});


