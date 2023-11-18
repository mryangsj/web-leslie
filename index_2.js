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

// slider control
function initSlider(sliderId, handleId, syncHandleId) {
  const slider = document.getElementById(sliderId);
  const handle = document.getElementById(handleId);
  const syncHandle = document.getElementById(syncHandleId);

  let isDragging = false;

  handle.addEventListener('mousedown', (event) => {
    isDragging = true;

    // 如果激活状态，更新handle-horn-r的位置
    if (isSyncActivatedHorn) {
      if(sliderId ==='slider-horn-l' || sliderId === 'slider-horn-r'){
        handleHornRPosition = handle.offsetTop;
      }
    }

    // 如果激活状态，同步更新handle-horn-l的位置
    if (isSyncActivatedHorn && syncHandle) {
      if(sliderId ==='slider-horn-l' || sliderId === 'slider-horn-r'){
        syncHandle.style.top = `${handleHornRPosition}px`;
      }
    }

    // 如果激活状态，更新handle-drum-r的位置
    if (isSyncActivatedDrum) {
      if(sliderId ==='slider-drum-l' || sliderId === 'slider-drum-r'){
      handleDrumRPosition = handle.offsetTop;
      }
    }

    // 如果激活状态，同步更新handle-drum-l的位置
    if (isSyncActivatedDrum && syncHandle) {
      if(sliderId ==='slider-drum-l' || sliderId === 'slider-drum-r'){
        syncHandle.style.top = `${handleDrumRPosition}px`;
    }
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
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
      if (isSyncActivatedHorn) {
        if(sliderId ==='slider-horn-l' || sliderId === 'slider-horn-r'){
          handleHornRPosition = handle.offsetTop;
        }
      }
  
      // 如果激活状态，同步更新handle-horn-l的位置
      if (isSyncActivatedHorn && syncHandle) {
        if(sliderId ==='slider-horn-l' || sliderId === 'slider-horn-r'){
          syncHandle.style.top = `${handleHornRPosition}px`;
        }
      }

      

      if (isSyncActivatedDrum) {
        if(sliderId ==='slider-drum-l' || sliderId === 'slider-drum-r'){
        handleDrumRPosition = handle.offsetTop;
        }
      }
  
      // 如果激活状态，同步更新handle-drum-l的位置
      if (isSyncActivatedDrum && syncHandle) {
        if(sliderId ==='slider-drum-l' || sliderId === 'slider-drum-r'){
          syncHandle.style.top = `${handleDrumRPosition}px`;
      }
      }

      // Update handle position
      handle.style.top = `${handlePosition}px`;
    }
  });
}

// Initialize sliders with synchronization
initSlider('slider-horn-l', 'handle-horn-l', 'handle-horn-r');
initSlider('slider-horn-r', 'handle-horn-r', 'handle-horn-l');
// Initialize sliders for drum with synchronization
initSlider('slider-drum-l', 'handle-drum-l', 'handle-drum-r');
initSlider('slider-drum-r', 'handle-drum-r', 'handle-drum-l');
// Initialize other sliders without synchronization
initSlider('slider-output', 'handle-output', '');

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
