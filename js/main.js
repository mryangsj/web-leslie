// get elements
const audioElement = document.querySelector("audio");
const playButton = document.querySelector("button");
const volumeControl = document.querySelector("#volume");

// create audio context
const audioContext = new AudioContext();
const gainNode = audioContext.createGain();

// pass it into the audio context
const track = audioContext.createMediaElementSource(audioElement);

// connect audio graph from audio source node to the destination.
track.connect(gainNode).connect(audioContext.destination);


playButton.addEventListener(
  "click",
  () => {
    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // play or pause track depending on state
    if (playButton.dataset.playing === "false") {
      audioElement.play();
      playButton.dataset.playing = "true";
    } else if (playButton.dataset.playing === "true") {
      audioElement.pause();
      playButton.dataset.playing = "false";
    }
  },
  false,
);

audioElement.addEventListener(
  "ended",
  () => {
    play.dataset.playing = "false";
  },
  false,
);

volumeControl.addEventListener(
  "input",
  () => {
    gainNode.gain.value = volumeControl.value;

  },
  false,
)

async function createMyAudioProcessor() {
  if (!audioContext) {
    try {
      audioContext = new AudioContext();
      await audioContext.resume();
      await audioContext.audioWorklet.addModule("js/leslieProcessor.js");
    } catch (e) {
      return null;
    }
  }

  return new AudioWorkletNode(audioContext, "leslie");
}
