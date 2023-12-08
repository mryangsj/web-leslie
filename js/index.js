//-----------------------------------------------------------------------------------------
// 模拟点击#fileInput
function openFileUploader() {
  document.getElementById('fileInput').click();
}


//-----------------------------------------------------------------------------------------
// 将用户上传的音频文件添加到audioPlayer
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