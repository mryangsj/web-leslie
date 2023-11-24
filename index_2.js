//upload audio
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

//button control
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

// slider control
// 全局变量用于存储激活状态和handle-horn-r的位置
let isSyncActivatedHorn = false;
let isSyncActivatedDrum = false;
let handleHornRPosition = 0;
let handleDrumRPosition = 0;


// 更新元素的内容
function updateElementValues(containerElement, elements) {
  // 清空容器的内容
  containerElement.innerHTML = '';

  elements.forEach((element) => {
    const spanElement = document.createElement('span');
    spanElement.textContent = element.value;

    // 应用样式
    spanElement.style.textAlign = 'center';
    spanElement.style.color = '#D4CEAF';
    spanElement.style.marginTop = '5%';

    // 将 span 元素添加到容器中
    containerElement.appendChild(spanElement);
  });
}


// slider control
function initSlider(sliderId, handleId, syncHandleId, containerElementId, textElementId,) {
  const slider = document.getElementById(sliderId);
  const handle = document.getElementById(handleId);
  const syncHandle = document.getElementById(syncHandleId);
  const containerElement = document.querySelector(containerElementId);
  const textElement = document.querySelector(textElementId);

  let isDragging = false;
  let value = 0.5;

  handle.addEventListener('mousedown', (event) => {
    isDragging = true;

    // 如果激活状态，更新 handle 的位置
    if (isSyncActivatedHorn || isSyncActivatedDrum) {
      const handlePosition = handle.offsetTop;
      if (sliderId === 'slider-horn-l' || sliderId === 'slider-horn-r') {
        handleHornRPosition = handlePosition;
      } else if (sliderId === 'slider-drum-l' || sliderId === 'slider-drum-r') {
        handleDrumRPosition = handlePosition;
      }
    }

    if (textElement) {
      textElement.style.display = 'none';
    }

    // 显示相应的文本元素
    if (containerElement) {
      containerElement.style.display = '';
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;

    // 显示 .horn_text
    if (textElement) {
      textElement.style.display = '';
    }

    // 显示相应的文本元素
    if (containerElement) {
      containerElement.style.display = 'none';
    }
  });

  window.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const sliderRect = slider.getBoundingClientRect();
      const handleTop = event.clientY - sliderRect.top;

      // Limit handle position within the slider
      const handlePosition = Math.min(Math.max(handleTop, 0), slider.clientHeight);

      // Calculate the percentage position of the handle within the slider
      const percentage = handlePosition / slider.clientHeight;

      // Calculate the value based on the percentage (assuming a range from 0 to 1)
      const value = (1 - percentage).toFixed(2); // Limit to two decimal places

      // Log the value to the console
      console.log(value);

      // 如果激活状态，更新handle-horn-r的位置
      if (isSyncActivatedHorn && syncHandle) {
        if (sliderId === 'slider-horn-l' || sliderId === 'slider-horn-r') {
          handleHornRPosition = handle.offsetTop;
          syncHandle.style.top = `${handleHornRPosition}px`;
        }
      }

      if (isSyncActivatedDrum && syncHandle) {
        if (sliderId === 'slider-drum-l' || sliderId === 'slider-drum-r') {
          handleDrumRPosition = handle.offsetTop;
          syncHandle.style.top = `${handleDrumRPosition}px`;
        }
      }

      // Update handle position
      handle.style.top = `${handlePosition}px`;

      // 更新对应元素的值
      const elementsToUpdate = [
        { element: syncHandle, value: value },
      ];

      // 否则只更新单个元素
      updateElementValues(containerElement, elementsToUpdate);
    }
  });
}

// 初始化 sliders
function initSliders() {
  // Initialize sliders with synchronization
  initSlider('slider-horn-l', 'handle-horn-l', 'handle-horn-r', '.horn_HZ', '.horn_text');
  initSlider('slider-horn-r', 'handle-horn-r', 'handle-horn-l', '.horn_HZ', '.horn_text');
  // Initialize sliders for drum with synchronization
  initSlider('slider-drum-l', 'handle-drum-l', 'handle-drum-r', '.drum_HZ', '.drum_text');
  initSlider('slider-drum-r', 'handle-drum-r', 'handle-drum-l', '.drum_HZ', '.drum_text');
  // Initialize other sliders without synchronization
  initSlider('slider-output', 'handle-output', '', '.output_HZ', '.output_text');
}

// 初始化所有 sliders
initSliders();


// 添加按钮点击事件监听器
const button_link1 = document.getElementById('button_link1');
const button_link2 = document.getElementById('button_link2');
button_link1.addEventListener('click', toggleButton);
button_link2.addEventListener('click', toggleButton);

function toggleButton() {
  this.classList.toggle('active');

  // 根据按钮的不同，设置不同的同步状态
  if (this === button_link1) {
    isSyncActivatedHorn = this.classList.contains('active');
    console.log(isSyncActivatedHorn)
  }
  if (this === button_link2) {
    isSyncActivatedDrum = this.classList.contains('active');
    console.log(isSyncActivatedDrum)
  }
  console.log(isSyncActivatedHorn)
  console.log(isSyncActivatedDrum)
}

//switch button
const switchButton = document.getElementById('switchButton');

switchButton.addEventListener('click', function () {
  // 切换点击状态
  switchButton.classList.toggle('clicked');

  // 根据点击状态设置背景图片
  if (switchButton.classList.contains('clicked')) {
    console.log(1); // 输出状态码 1
  } else {
    console.log(0); // 输出状态码 0
  }
});

