export default class Knob extends EventTarget {
  #componentType = 'knob';

  #stateValue = 0; // 0~1
  #skewFactor = 1; // when skewFactor is 1, knob is linear; otherwise, it's nonlinear. skewFactor should be greater than 0 unless in very special cases.

  #valueStart = 0;
  #valueEnd = 1;
  #defaultValue = 0.5;

  #isMouseOnIndicator = false;
  #isMouseDownOnIndicator = false;
  #isIndicatorDragging = false;

  #directionResponseToMouseDragging = 'vertical'; // 'horizontal' or 'vertical'

  #isCursorResponsive = false;
  #cursorStyle_mouseEnter = 'grab';
  #cursorStyle_mouseDown = 'grabbing';
  #cursorStyle_mouseDraging = 'row-resize';

  #isLabelResponsive = false;
  #isLabelEditable = false;
  #isLabelEditing = false;

  constructor(container, sizeRatio = 0.8, knobName = 'newKnob', devMode = false, componentType = 'knob') {
    super();

    this.domContainer = container;
    this.sizeRatio = sizeRatio;
    this.knobName = knobName;
    this.devMode = devMode;
    this.#componentType = componentType;

    this.currentValue = 0.5;

    this.#domContainer_init();
    this.#domIndicatorBox_init();
    this.#domIndicator_init();

    this.#domIndicatorEventInit();
    this.#cursorEventInit();
  }


  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  #domContainer_init() {
    // 设置dom的尺寸、布局、定位
    this.domContainer.style.width = '100%';
    this.domContainer.style.height = '100%';
    this.domContainer.style.position = 'relative';
    // 设置dom的样式
    this.devMode ? this.domContainer.style.border = '0.5px solid red' : null;
  }


  #domIndicatorBox_init() {
    // 创建indicatorBox节点
    this.domIndicatorBox = document.createElement('div');
    this.domContainer.appendChild(this.domIndicatorBox);
    // 设置indicatorBox基本属性
    this.domIndicatorBox.className = this.#componentType + '-indicator-box';
    this.domIndicatorBox.id = this.domIndicatorBox.className + '-' + this.knobName;
    // 设置indicatorBox尺寸、布局、定位
    this.domIndicatorBox.style.width = `${this.sizeRatio * 100}%`;
    this.domIndicatorBox.style.aspectRatio = '1 / 1';
    this.domIndicatorBox.style.position = 'relative';
    this.domIndicatorBox.style.top = '50%';
    this.domIndicatorBox.style.left = '50%';
    this.domIndicatorBox.style.transform = 'translate(-50%, -50%)';
    // 设置indicatorBox样式
    this.devMode ? this.domIndicatorBox.style.border = '0.5px solid pink' : null;
  }

  #domIndicator_init() {
    // 创建indicator节点
    this.domIndicator = document.createElement('div');
    this.domIndicatorBox.appendChild(this.domIndicator);
    // 设置indicator基本属性
    this.domIndicator.className = this.#componentType + '-indicator';
    this.domIndicator.id = this.domIndicator.className + '-' + this.knobName;
    // 设置indicator尺寸、布局、定位
    this.domIndicator.style.width = '100%';
    this.domIndicator.style.height = '100%';
    this.domIndicator.style.position = 'absolute';
    this.domIndicator.style.top = '50%';
    this.domIndicator.style.left = '50%';
    this.domIndicator.style.transform = 'translate(-50%, -50%)';
    // 设置indicator基本样式
    this.domIndicator.style.zIndex = 2;
    this.devMode ? this.domIndicator.style.border = '0.5px solid blue' : null;
    // 触发双击事件
    this.domIndicator.addEventListener('dblclick', () => { this.dispatchEvent(new CustomEvent('dblclick-indicator')); });
  }

  #domIndicatorEventInit() {
    //-----------------------------------------------------------------------------------------
    // 给indicator注册鼠标移入移出事件
    this.mouseEnterIndicatorHandler_bind = this.#mouseEnterIndicatorHandler.bind(this);
    this.mouseLeaveIndicatorHandler_bind = this.#mouseLeaveIndicatorHandler.bind(this);
    this.domIndicator.addEventListener('mouseenter', this.mouseEnterIndicatorHandler_bind);
    this.domIndicator.addEventListener('mouseleave', this.mouseLeaveIndicatorHandler_bind);

    //-----------------------------------------------------------------------------------------
    // 当用户正在操作其它控件时，屏蔽鼠标移入移出事件
    document.body.addEventListener('start-interacting', event => {
      if (!this.#isMouseDownOnIndicator) {
        this.domIndicator.removeEventListener('mouseenter', this.mouseEnterIndicatorHandler_bind);
        this.domIndicator.removeEventListener('mouseleave', this.mouseLeaveIndicatorHandler_bind);
      }
    });

    //-----------------------------------------------------------------------------------------
    // 当用户停止操作其它控件时，恢复鼠标移入移出事件
    document.body.addEventListener('stop-interacting', event => {
      if (!this.#isMouseDownOnIndicator) {
        this.domIndicator.addEventListener('mouseenter', this.mouseEnterIndicatorHandler_bind);
        this.domIndicator.addEventListener('mouseleave', this.mouseLeaveIndicatorHandler_bind);
      }
    });

    //-----------------------------------------------------------------------------------------
    // 给indicator注册鼠标按下事件
    this.mouseDownHandler_bind = this.#mouseDownHandler.bind(this);
    this.domIndicator.addEventListener('mousedown', this.mouseDownHandler_bind);

    //-----------------------------------------------------------------------------------------
    // 给indicator注册鼠标移动事件（为了使鼠标在indicator范围外依然能响应，该事件注册在document上）
    document.addEventListener('mousemove', event => {
      if (this.#isMouseDownOnIndicator) {
        this.#mouseDraggingHandler(event, this.#directionResponseToMouseDragging);
        this.dispatchEvent(new CustomEvent('mouse-dragging-indicator'));
      }
    });

    //-----------------------------------------------------------------------------------------
    // 给indicator注册鼠标释放、拖动释放事件（为了使鼠标在indicator范围外依然能响应，该事件注册在document上）
    document.addEventListener('mouseup', event => {
      if (this.#isMouseDownOnIndicator) {
        this.#isMouseDownOnIndicator = false;
        this.#isIndicatorDragging = false;
        this.dispatchEvent(new CustomEvent('mouseup'));
        document.body.dispatchEvent(new CustomEvent('stop-interacting'));
      }
    });

    //-----------------------------------------------------------------------------------------
    // 给indicator注册恢复默认值事件：按住command键(MacOS)、ctrl键(Windows)、alt键单击恢复默认值
    this.domIndicator.addEventListener('click', event => {
      if (event.altKey || event.metaKey || event.ctrlKey) {
        this.setIndicatorByValue(this.#defaultValue);
      }
    });
  }

  #cursorEventInit() {
    this.addEventListener('mouse-enter-indicator', () => {
      if (this.#isCursorResponsive && !this.#isIndicatorDragging) {
        document.body.style.cursor = this.#cursorStyle_mouseEnter;
      }
    });

    this.addEventListener('mouse-leave-indicator', () => {
      if (this.#isCursorResponsive && !this.#isIndicatorDragging) {
        document.body.style.cursor = 'default';
      }
    });

    this.addEventListener('mouse-down-indicator', () => {
      if (this.#isCursorResponsive) {
        document.body.style.cursor = this.#cursorStyle_mouseDown;
      }
    });

    this.addEventListener('mouse-dragging-indicator', () => {
      if (this.#isCursorResponsive) {
        document.body.style.cursor = this.#cursorStyle_mouseDraging;
      }
    });

    this.addEventListener('mouseup', () => {
      if (this.#isCursorResponsive) {
        document.body.style.cursor = this.#isMouseOnIndicator ? this.#cursorStyle_mouseEnter : 'default';
      }
    });
  }

  //-----------------------------------------------------------------------------------------
  setCursorResponsive(isCursorResponsive, mouseEnter = 'grab', mouseDown = 'grabbing', mouseDraging = 'auto') {
    if (isCursorResponsive) {
      // update flag
      this.#isCursorResponsive = true;
      // update cursor style
      this.#isCursorResponsive = isCursorResponsive;
      this.#cursorStyle_mouseEnter = mouseEnter;
      this.#cursorStyle_mouseDown = mouseDown;
      // update cursor dragging style
      if (mouseDraging === 'auto') {
        switch (this.#directionResponseToMouseDragging) {
          case 'horizontal':
            mouseDraging = 'col-resize';
            break;
          case 'vertical':
            mouseDraging = 'row-resize';
            break;
          default:
            console.warn(this.#componentType + ': directionResponseToMouse should be "horizontal" or "vertical".');
            break;
        }
      }
      this.cursorStyle_mouseDraging = mouseDraging;
    }
    else {
      this.#isCursorResponsive = false;
    }
  }


  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  #mouseEnterIndicatorHandler() {
    this.#isMouseOnIndicator = true;
    this.dispatchEvent(new CustomEvent('mouse-enter-indicator'));
  }

  //-----------------------------------------------------------------------------------------
  #mouseLeaveIndicatorHandler() {
    this.#isMouseOnIndicator = false;
    this.dispatchEvent(new CustomEvent('mouse-leave-indicator'));
  }

  //-----------------------------------------------------------------------------------------
  #mouseDownHandler() {
    this.#isMouseDownOnIndicator = true;
    this.dispatchEvent(new CustomEvent('mouse-down-indicator'));
    document.body.dispatchEvent(new CustomEvent('start-interacting'));
  }

  //-----------------------------------------------------------------------------------------
  #mouseDraggingHandler(event, directionResponseToMouse) {
    // 更新信号量
    this.#isIndicatorDragging = true;

    // 计算增量：indicator的增量与鼠标Y轴移动速度关联
    let mouseSpeed;
    let sign;
    switch (directionResponseToMouse) {
      case 'horizontal':
        mouseSpeed = event.movementX;
        sign = Math.sign(mouseSpeed);
        break;
      case 'vertical':
        mouseSpeed = event.movementY;
        sign = Math.sign(-mouseSpeed);
        break;
      default:
        console.warn(this.#componentType + ': directionResponseToMouse should be "horizontal" or "vertical".');
        break;
    }

    const increment = Math.abs(mouseSpeed);
    let nextState = this.#stateValue + sign * Math.pow(increment, 1) * 0.005;
    // 判断是否已达indicator的边界
    if (nextState < 0) { nextState = 0; }
    if (nextState > 1) { nextState = 1; }
    // 设置indicator的角度
    this.setIndicatorByState(nextState);
  }

  //-----------------------------------------------------------------------------------------
  setDerectionResponseToMouse(directionResponseToMouse = 'vertical') {
    switch (directionResponseToMouse) {
      case 'horizontal':
        this.#directionResponseToMouseDragging = 'horizontal';
        break;
      case 'vertical':
        this.#directionResponseToMouseDragging = 'vertical';
        break;
      default:
        console.warn(this.#componentType + ': directionResponseToMouse should be "horizontal" or "vertical".');
        break;
    }
  }


  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  // 设置value范围及默认值
  setValueConfig(valueStart, valueEnd, defaultValue) {
    this.#valueStart = valueStart;
    this.#valueEnd = valueEnd;
    this.#defaultValue = defaultValue;
    this.setIndicatorByValue(this.#defaultValue);
  }

  //-----------------------------------------------------------------------------------------
  // 设置中间值来非线性地调整knob
  setSkewForCenter(midValue) {
    if (midValue > this.#valueStart && midValue < this.#valueEnd) {
      const targetX = 0.5;
      const targetY = midValue;
      this.#skewFactor = Math.log((targetY - this.#valueStart) / (this.#valueEnd - this.#valueStart)) / Math.log(targetX);
      this.setIndicatorByValue(this.currentValue);
      return true;
    } else {
      this.#skewFactor = 1;
      return false;
    }
  }


  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  // 配置indicator的sprite
  setIndicatorSprite(spritePath, fillDirection = 'width', positionTopLeftFinetune = [0, 0], sampleSuffix = '_sample') {
    // 获取样本图片的路径
    const dotIndex = spritePath.lastIndexOf('.');
    const spritePathSample = spritePath.slice(0, dotIndex) + sampleSuffix + spritePath.slice(dotIndex);

    // 加载样本以获取样本的尺寸，以便设置indicatorBox的尺寸比例
    let sampleWidth, sampleHeight;
    const imgSample = new Image();
    imgSample.onload = () => {
      // 加载sprite
      const imgSprite = new Image();
      imgSprite.onload = () => {
        // 设置indicatorBox的尺寸
        switch (fillDirection) {
          case 'width':
            this.domIndicatorBox.style.width = `${this.sizeRatio * 100}%`;
            this.domIndicatorBox.style.height = '';
            break;
          case 'height':
            this.domIndicatorBox.style.height = `${this.sizeRatio * 100}%`;
            this.domIndicatorBox.style.width = '';
            break;
          default:
            console.warn(this.#componentType + ': fillDirection should be "width" or "height".');
            break;
        }

        // 设置indicatorBox的比例
        sampleWidth = imgSample.width;
        sampleHeight = imgSample.height;
        this.domIndicatorBox.style.aspectRatio = `${sampleWidth} / ${sampleHeight}`;

        // 微调indicatorBox的定位
        this.domIndicatorBox.style.top = `${(0.5 + positionTopLeftFinetune[0]) * 100}%`;
        this.domIndicatorBox.style.left = `${(0.5 + positionTopLeftFinetune[1]) * 100}%`;

        // 计算sprite的长度（！必须在调用setIndicatorByValue函数前计算好）
        const spriteAspectRatio = imgSprite.width / imgSprite.height;
        const sampleAspectRatio = sampleWidth / sampleHeight;
        this.spriteLength = sampleAspectRatio / spriteAspectRatio;
        if (!Number.isInteger(this.spriteLength)) { console.warn(this.#componentType + ': spriteLength is an integer.'); }

        // 设置indicator的sprite
        this.domIndicator.style.background = `url(${spritePath})`;
        this.domIndicator.style.backgroundSize = '100%';
        this.setIndicatorByValue(this.currentValue, true);
      };
      imgSprite.src = spritePath;
    }
    imgSample.src = spritePathSample;
  }


  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  // 设置scale
  setScale(scalePath, sizeRatio = 0.85, positionTopLeftFinetune = [0, 0]) {
    // 创建scale节点
    this.domScale = document.createElement('div');
    this.domIndicatorBox.appendChild(this.domScale);
    // 设置scale基本属性
    this.domScale.className = this.#componentType + '-scale';
    this.domScale.id = this.domScale.className + '-' + this.knobName;
    // 设置scale尺寸
    const imgScale = new Image();
    imgScale.onload = () => {
      this.domScale.style.width = `${sizeRatio * 100}%`;
      this.domScale.style.aspectRatio = `${imgScale.width} / ${imgScale.height}`;
    };
    imgScale.src = scalePath;
    // 设置scale布局、定位
    this.domScale.style.position = 'absolute';
    this.domScale.style.top = `${(0.5 + positionTopLeftFinetune[0]) * 100}%`;
    this.domScale.style.left = `${(0.5 + positionTopLeftFinetune[1]) * 100}%`;
    this.domScale.style.transform = 'translate(-50%, -50%)';
    // 设置scale样式
    this.domScale.style.background = `url(${scalePath})`;
    this.domScale.style.backgroundSize = '100% auto';
    this.domScale.style.zIndex = 1;
    this.devMode ? this.domScale.style.border = '0.5px solid green' : null;
  }


  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  // 设置label
  setLabel(innerText, className) {
    // 创建label节点
    this.domLabel = document.createElement('span');
    this.domIndicatorBox.appendChild(this.domLabel);
    // 设置label基本属性
    this.domLabel.className = this.#componentType + '-label';
    this.domLabel.id = this.domLabel.className + '-' + this.knobName;
    // 设置label尺寸、布局、定位
    this.domLabel.style.width = 'auto';
    this.domLabel.style.height = 'auto';
    // 设置label必要样式
    this.labelInnerText = innerText;
    this.#setLabelShowInnerText();
    this.domLabel.style.position = 'absolute';
    this.domLabel.style.textAlign = 'center';
    this.domLabel.style.left = '50%';
    this.domLabel.style.transform = 'translate(-50%, 0%)';
    this.domLabel.style.whiteSpace = 'nowrap';
    this.domLabel.style.zIndex = 1;
    this.devMode ? this.domLabel.style.border = '0.5px solid yellow' : null;

    // 建议的自定义属性
    // this.domLabel.style.top = '100%';
    // this.domLabel.style.fontSize = '0.7vw';
    // this.domLabel.style.fontFamily = "'Azoft Sans Bold', sans-serif";
    // this.domLabel.style.fontWeight = 'bold';
    // this.domLabel.style.color = 'rgba(255, 255, 255, 0.5)';

    if (className) { this.domLabel.classList.add(className); }

    this.#labelEventInit();
  }

  #labelEventInit() {
    this.addEventListener('mouse-enter-indicator', () => {
      if (this.#isLabelResponsive && !this.#isLabelEditing) {
        this.setLabelShowValue();
      }
    });

    this.addEventListener('mouse-leave-indicator', () => {
      if (this.#isLabelResponsive && !this.#isLabelEditing) {
        this.#setLabelShowInnerText();
        this.domLabel.setAttribute('contenteditable', false);
      }
    });

    this.addEventListener('mouse-dragging-indicator', () => {
      if (this.#isLabelResponsive && !this.#isLabelEditing) {
        this.setLabelShowValue();
      }
    });

    this.addEventListener('mouseup', () => {
      if (this.#isLabelResponsive && !this.#isMouseOnIndicator) {
        this.#setLabelShowInnerText();
      }
    });

    // 捕获indicator双击事件：激活label可编辑状态并全选label
    this.addEventListener('dblclick-indicator', () => {
      if (this.#isLabelEditable) {
        // 更新信号量
        this.#isLabelEditing = true;
        // 激活label可编辑状态
        this.domLabel.setAttribute('contenteditable', true);
        // 去掉单位
        this.setLabelShowValue(false);
        // 获取光标并全选label
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(this.domLabel);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });

    // 给label注册回车事件
    this.domLabel.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        // 防止换行
        event.preventDefault();
        // 触发blur事件
        this.domLabel.blur();
      }
    });

    // 给label注册失焦事件
    this.domLabel.addEventListener('blur', event => {
      // 更新信号量
      this.#isLabelEditing = false;
      // 根据输入数据调整indicator
      this.setIndicatorByText(this.domLabel.innerHTML);
      // 取消label可编辑状态
      this.domLabel.setAttribute('contenteditable', false);
      // 更新label
      this.#isMouseOnIndicator ? this.setLabelShowValue() : this.#setLabelShowInnerText();
    });
  }

  //-----------------------------------------------------------------------------------------
  #setLabelShowInnerText() { this.domLabel.innerHTML = this.labelInnerText; }

  //-----------------------------------------------------------------------------------------
  setLabelShowValue(withSuffix = true) {
    if (withSuffix) { this.domLabel.innerHTML = this.currentValue.toFixed(this.numberDecimals) + this.suffix; }
    else { this.domLabel.innerHTML = this.currentValue.toFixed(this.numberDecimals); }
  }

  //-----------------------------------------------------------------------------------------
  setLabelResponsive(isLabelResponsive, numberDecimals = 2, suffix = '') {
    if (isLabelResponsive) {
      this.#isLabelResponsive = true;
      this.numberDecimals = numberDecimals;
      this.suffix = suffix;
    }
    else {
      this.isLabelResponsive = false;
    }
  }

  //-----------------------------------------------------------------------------------------
  setLabelEditable(isLabelEditable) { this.#isLabelEditable = isLabelEditable ? true : false; }


  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  // 通过targe value来更新indicator状态
  setIndicatorByValue(targetValue, isForceUpdate = false) {
    //判定是否有必要更新
    if (targetValue != this.currentValue || isForceUpdate === true) {
      const prevStateValue = this.#stateValue;
      this.currentValue = targetValue;
      this.#stateValue = this.valueToState(this.currentValue);

      // 判断是否要更新indicator的sprite
      const preIndex = this.getSpriteIndexByStateValue(prevStateValue);
      const curIndex = this.getSpriteIndexByStateValue();
      if (preIndex != curIndex || isForceUpdate === true) {
        this.domIndicator.style.backgroundPosition = `0% ${curIndex / (this.spriteLength - 1) * 100}%`;
      }

      // 触发changed事件
      const eventChanged = new CustomEvent('changed', {
        detail: {
          // previousValue: prevValue,
          value: targetValue
        }
      });
      this.domContainer.dispatchEvent(eventChanged);
      this.dispatchEvent(eventChanged);
    }
  }

  //-----------------------------------------------------------------------------------------
  setIndicatorByState(targetState) { this.setIndicatorByValue(this.stateToValue(targetState)); }

  //-----------------------------------------------------------------------------------------
  // 通过text number来更新indicator状态
  setIndicatorByText(inputText) {
    const targetNumber = parseFloat(inputText); // 尝试将输入转换为浮点数
    if (!isNaN(targetNumber) && targetNumber >= this.#valueStart && targetNumber <= this.#valueEnd) {
      this.setIndicatorByValue(targetNumber);
    } else if (this.#isMouseOnIndicator) {
      console.warn(this.#componentType + ': inputText should be a number between valueStart and valueEnd.');
    }
  }


  //-----------------------------------------------------------------------------------------
  stateToValue(stateValue) { return (this.#valueEnd - this.#valueStart) * Math.pow(stateValue, this.#skewFactor) + this.#valueStart; }
  valueToState(value) { return Math.pow((value - this.#valueStart) / (this.#valueEnd - this.#valueStart), 1 / this.#skewFactor); }
  getSpriteIndexByStateValue(stateValue = this.#stateValue) { return Math.round(stateValue * (this.spriteLength - 1)); }
  getDefaultValue() { return this.#defaultValue; }
  getValue() { return this.currentValue; }
}