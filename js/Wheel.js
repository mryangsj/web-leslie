import Knob from '/js/Knob.js';

export default class Wheel extends Knob {
  constructor(container, sizeRatio, wheelName, devMode) {
    super(container, sizeRatio, wheelName, devMode, 'wheel');
  }
}