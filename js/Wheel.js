import Knob from '/js/Knob.js';

export default class Wheel extends Knob {
  constructor(container, sizeRatio, wheelName, devMode) {
    super(container, sizeRatio, wheelName, devMode);

    //-----------------------------------------------------------------------------------------
    // 创建indicatorBox尺寸
    this.domIndicatorBox.style.width = '';
    this.domIndicatorBox.style.height = '';
    this.domIndicatorBox.style.aspectRatio = '';

    //-----------------------------------------------------------------------------------------
    // 设置indicator尺寸
    this.domIndicator.style.width = '100%';
    this.domIndicator.style.height = '100%';
    this.domIndicator.style.aspectRatio = '';
  }

  setIndicatorSprite(spritePath) {
    // 获取样本图片的路径
    const dotIndex = spritePath.lastIndexOf('.');
    const spritePathSample = spritePath.slice(0, dotIndex) + '_sample' + spritePath.slice(dotIndex);
    let sampleWidth, sampleHeight;

    // 加载样本以获取样本的尺寸，以便设置indicatorBox的尺寸
    const imgSample = new Image();
    imgSample.onload = () => {
      sampleWidth = imgSample.width;
      sampleHeight = imgSample.height;
      const sampleRatio = sampleWidth / sampleHeight;
      const parentRatio = this.domContainer.offsetWidth / this.domContainer.offsetHeight;

      // 加载正式图片
      const img = new Image();
      img.onload = () => {
        // 设置indicatorBox的尺寸
        if (parentRatio > sampleRatio) {
          this.domIndicatorBox.style.height = `${this.sizeRatio * 100}%`;
        } else {
          this.domIndicatorBox.style.width = `${this.sizeRatio * 100}%`;
        }
        this.domIndicatorBox.style.aspectRatio = `${sampleWidth} / ${sampleHeight}`;
        // 设置indicator的sprite
        this.spriteLength = img.height / sampleHeight;
        this.domIndicator.style.background = `url(${spritePath})`;
        this.domIndicator.style.backgroundSize = `100% auto`;
        this.setIndicatorByValue(this.currentValue);
      }
      img.src = spritePath;
    }
    imgSample.src = spritePathSample;
  }

  //-----------------------------------------------------------------------------------------
  // 设置scale
  setScale(scalePath, sizeRatio = 0.85) {
    // 创建scale节点
    this.domScale = document.createElement('div');
    this.domIndicatorBox.appendChild(this.domScale);
    // 设置scale基本属性
    this.domScale.className = 'knob-scale';
    this.domScale.id = this.domScale.className + '-' + this.knobName;
    // 设置scale尺寸、布局、定位
    this.domScale.style.width = `${sizeRatio * 100}%`;
    this.domScale.style.height = `${sizeRatio * 100}%`;
    this.domScale.style.position = 'absolute';
    this.domScale.style.top = '50%';
    this.domScale.style.left = '50%';
    this.domScale.style.transform = 'translate(-50%, -50%)';
    // 设置scale样式
    this.domScale.style.background = `url(${scalePath})`;
    this.domScale.style.backgroundSize = '100% auto';
    this.domScale.style.backgroundPosition = 'center';
    this.domScale.style.backgroundRepeat = 'no-repeat';
    this.domScale.style.zIndex = 1;
    this.devMode ? this.domScale.style.border = '0.5px solid green' : null;
  }
}