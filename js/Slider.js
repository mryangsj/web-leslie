import Knob from '/js/Knob.js';

export default class Slider extends Knob {
  constructor(container, sizeRatio, wheelName, devMode) {
    super(container, sizeRatio, wheelName, devMode, 'slider');
  }
}