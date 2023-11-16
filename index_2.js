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
      const percentage = handlePosition / slider.clientHeight;
  
      // Calculate the value based on the percentage (assuming a range from 0 to 1)
      const value = (1-percentage).toFixed(2); // Limit to two decimal places
  
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
    
