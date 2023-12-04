export default class Knob {
  constructor(container, sizeRatio = 0.8, knobName = 'newKnob', devMode = false, componentType = 'knob') {
    this.componentType = componentType;

    this.domContainer = container;
    this.sizeRatio = sizeRatio;
    this.knobName = knobName;

    this.valueStart = 0;
    this.valueEnd = 1;
    this.defaultValue = 0.5;
    this.currentValue = 0.5;

    this.stateValue = 0; // 0~1
    this.skewFactor = 1; // 当skewFactor为1时，knob是线性控件；非1时为非线性控件。除非极为特殊的情况，否则skewFactor应该大于0。

    this.directionResponseToMouse = 'vertical'; // 'horizontal' or 'vertical'
    this.cursorTouch = 'grab';
    this.cursorDraging = 'row-resize'; // 'row-resize' for vertical knob, 'col-resize' for horizontal knob

    this.isLabelResponsive = false;
    this.isLabelEditable = false;
    this.isLabelEditing = false;

    this.isCursorOnIndicator = false;
    this.isMouseDownOnIndicator = false;
    this.isIndicatorDragging = false;

    this.eventTarget = new EventTarget();

    this.devMode = devMode;


    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 设置dom的尺寸、布局、定位
    this.domContainer.style.width = '100%';
    this.domContainer.style.height = '100%';
    this.domContainer.style.position = 'relative';

    // 设置dom的样式
    this.devMode ? this.domContainer.style.border = '0.5px solid red' : null;

    //-----------------------------------------------------------------------------------------
    // 创建indicatorBox节点
    this.domIndicatorBox = document.createElement('div');
    this.domContainer.appendChild(this.domIndicatorBox);

    // 设置indicatorBox基本属性
    this.domIndicatorBox.className = this.componentType + '-indicator-box';
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


    //-----------------------------------------------------------------------------------------
    // 创建indicator节点
    this.domIndicator = document.createElement('div');
    this.domIndicatorBox.append(this.domIndicator);

    // 设置indicator基本属性
    this.domIndicator.className = this.componentType + '-indicator';
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


    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 给indicator注册鼠标移入移出事件
    this.mouseEnterIndicatorHandler_bind = this.mouseEnterIndicatorHandler.bind(this);
    this.mouseLeaveIndicatorHandler_bind = this.mouseLeaveIndicatorHandler.bind(this);
    this.domIndicator.addEventListener('mouseenter', this.mouseEnterIndicatorHandler_bind);
    this.domIndicator.addEventListener('mouseleave', this.mouseLeaveIndicatorHandler_bind);

    //-----------------------------------------------------------------------------------------
    // 当用户正在操作其它控件时，屏蔽鼠标移入移出事件
    document.body.addEventListener('start-interacting', event => {
      if (!this.isMouseDownOnIndicator) {
        this.domIndicator.removeEventListener('mouseenter', this.mouseEnterIndicatorHandler_bind);
        this.domIndicator.removeEventListener('mouseleave', this.mouseLeaveIndicatorHandler_bind);
      }
    });

    //-----------------------------------------------------------------------------------------
    // 当用户停止操作其它控件时，恢复鼠标移入移出事件
    document.body.addEventListener('stop-interacting', event => {
      if (!this.isMouseDownOnIndicator) {
        this.domIndicator.addEventListener('mouseenter', this.mouseEnterIndicatorHandler_bind);
        this.domIndicator.addEventListener('mouseleave', this.mouseLeaveIndicatorHandler_bind);
      }
    });

    //-----------------------------------------------------------------------------------------
    // 给indicator注册鼠标按下事件
    this.mouseDownHandler_bind = this.mouseDownHandler.bind(this);
    this.domIndicator.addEventListener('mousedown', this.mouseDownHandler_bind);

    //-----------------------------------------------------------------------------------------
    // 给indicator注册鼠标移动事件（为了使鼠标在indicator范围外依然能响应，该事件注册在document上）
    document.addEventListener('mousemove', event => {
      if (this.isMouseDownOnIndicator) {
        this.mouseDraggingHandler(event, this.directionResponseToMouse);
      }
    });

    //-----------------------------------------------------------------------------------------
    // 给indicator注册鼠标释放、拖动释放事件（为了使鼠标在indicator范围外依然能响应，该事件注册在document上）
    document.addEventListener('mouseup', event => {
      if (this.isMouseDownOnIndicator) {
        // 更新信号量
        this.isMouseDownOnIndicator = false;
        this.isIndicatorDragging = false;
        // 更新鼠标样式
        document.body.style.cursor = this.isCursorOnIndicator ? this.cursorTouch : 'default';
        // 当label需要响应鼠标事件时，若鼠标不在knob上，label显示标签
        if (this.domLabel && this.isLabelResponsive && !this.isCursorOnIndicator) { this.setLabelShowInnerText(); }
        // 触发stop-interacting事件
        document.body.dispatchEvent(new CustomEvent('stop-interacting'));
      }
    });

    //-----------------------------------------------------------------------------------------
    // 给indicator注册恢复默认值事件：按住command键(MacOS)、ctrl键(Windows)、alt键单击恢复默认值
    this.domIndicator.addEventListener('click', event => {
      if (event.altKey || event.metaKey || event.ctrlKey) {
        this.setIndicatorByValue(this.defaultValue);
        if (this.domLabel && this.isLabelResponsive) { this.setLabelShowValue() };
      }
    });

    //-----------------------------------------------------------------------------------------
    // 屏蔽右键菜单
    this.domContainer.addEventListener('contextmenu', event => {
      event.preventDefault(); // 阻止默认的右键菜单弹出
    }, false);
  }



  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  mouseEnterIndicatorHandler() {
    // 更新信号量
    this.isCursorOnIndicator = true;
    // 更新鼠标样式
    document.body.style.cursor = this.isIndicatorDragging ? this.cursorDraging : this.cursorTouch;
    // 当label需要响应鼠标事件时，若不在编辑状态，label显示当前值
    if (this.domLabel && this.isLabelResponsive && !this.isLabelEditing) { this.setLabelShowValue(); };
  }

  //-----------------------------------------------------------------------------------------
  mouseLeaveIndicatorHandler() {
    // 更新信号量
    this.isCursorOnIndicator = false;
    // 更新鼠标样式
    document.body.style.cursor = this.isIndicatorDragging ? this.cursorDraging : 'default';
    // 当label需要响应鼠标事件时，若不在编辑状态，label显示标签且撤回可编辑状态
    if (this.domLabel && this.isLabelResponsive && !this.isLabelEditing) {
      this.setLabelShowInnerText();
      this.domLabel.setAttribute('contenteditable', false);
    };
  }

  //-----------------------------------------------------------------------------------------
  mouseDownHandler() {
    // 更新信号量
    this.isMouseDownOnIndicator = true;
    // 更新鼠标样式
    document.body.style.cursor = this.cursorDraging;
    // 触发start-interacting事件
    document.body.dispatchEvent(new CustomEvent('start-interacting'));
  }

  //-----------------------------------------------------------------------------------------
  mouseDraggingHandler(event, directionResponseToMouse) {
    // 更新信号量
    this.isIndicatorDragging = true;
    // 计算增量：indicator的增量与鼠标Y轴移动速度关联
    let mouseSpeed;
    let sign;
    if (directionResponseToMouse === 'vertical') {
      mouseSpeed = event.movementY;
      sign = Math.sign(-mouseSpeed);
    } else if (directionResponseToMouse === 'horizontal') {
      mouseSpeed = event.movementX;
      sign = Math.sign(mouseSpeed);
    }
    const increment = Math.abs(mouseSpeed);
    let nextState = this.stateValue + sign * Math.pow(increment, 1) * 0.005;
    // 判断是否已达indicator的边界
    if (nextState < 0) { nextState = 0; }
    if (nextState > 1) { nextState = 1; }
    // 设置indicator的角度
    this.setIndicatorByState(nextState);
    // label显示当前值
    if (this.domLabel && this.isLabelResponsive) { this.setLabelShowValue(); }
  }

  //-----------------------------------------------------------------------------------------
  setDerectionResponseToMouse(directionResponseToMouse = 'vertical') {
    switch (directionResponseToMouse) {
      case 'horizontal':
        this.directionResponseToMouse = 'horizontal';
        this.cursorDraging = 'col-resize';
        break;
      case 'vertical':
        this.directionResponseToMouse = 'vertical';
        this.cursorDraging = 'row-resize';
        break;
      default:
        console.warn(this.componentType + ': directionResponseToMouse should be "horizontal" or "vertical".');
        break;
    }
  }


  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  // 设置value范围及默认值
  setValueConfig(valueStart, valueEnd, defaultValue) {
    this.valueStart = valueStart;
    this.valueEnd = valueEnd;
    this.defaultValue = defaultValue;
    this.setIndicatorByValue(this.defaultValue);
  }

  //-----------------------------------------------------------------------------------------
  // 设置中间值来非线性地调整knob
  setSkewFactorByMidValue(midValue) {
    if (midValue > this.valueStart && midValue < this.valueEnd) {
      const targetX = 0.5;
      const targetY = midValue;
      this.skewFactor = Math.log((targetY - this.valueStart) / (this.valueEnd - this.valueStart)) / Math.log(targetX);
      this.setIndicatorByValue(this.currentValue);
      return true;
    } else {
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
        if (fillDirection === 'width') {
          this.domIndicatorBox.style.width = `${this.sizeRatio * 100}%`;
          this.domIndicatorBox.style.height = '';
        } else if (fillDirection === 'height') {
          this.domIndicatorBox.style.height = `${this.sizeRatio * 100}%`;
          this.domIndicatorBox.style.width = '';
        } else {
          console.warn(this.componentType + ': fillDirection should be "width" or "height".');
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
        if (!Number.isInteger(this.spriteLength)) { console.warn(this.componentType + ': spriteLength is an integer.'); }

        // 设置indicator的sprite
        this.domIndicator.style.background = `url(${spritePath})`;
        this.domIndicator.style.backgroundSize = `100%`;
        // this.domIndicator.style.backgroundRepeat = 'no-repeat';
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
    this.domScale.className = this.componentType + '-scale';
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
    // this.domScale.style.backgroundRepeat = 'no-repeat';
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
    this.domLabel.className = this.componentType + '-label';
    this.domLabel.id = this.domLabel.className + '-' + this.knobName;
    // 设置label尺寸、布局、定位
    this.domLabel.style.width = 'auto';
    this.domLabel.style.height = 'auto';
    // 设置label必要样式
    this.labelInnerText = innerText;
    this.setLabelShowInnerText();
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
  }

  //-----------------------------------------------------------------------------------------
  setLabelShowInnerText() { this.domLabel.innerHTML = this.labelInnerText; }

  //-----------------------------------------------------------------------------------------
  setLabelShowValue(withSuffix = true) {
    if (withSuffix) { this.domLabel.innerHTML = this.currentValue.toFixed(this.numberDecimals) + this.suffix; }
    else { this.domLabel.innerHTML = this.currentValue.toFixed(this.numberDecimals); }
  }

  //-----------------------------------------------------------------------------------------
  // 设置label是否响应鼠标事件
  setLabelResponsive(isLabelResponsive, numberDecimals = 2, suffix = '') {
    if (isLabelResponsive) {
      this.isLabelResponsive = isLabelResponsive;
      this.numberDecimals = numberDecimals;
      this.suffix = suffix;
    }
    else {
      this.isLabelResponsive = false;
    }
  }

  //-----------------------------------------------------------------------------------------
  // 设置label是否可编辑
  setLabelEditable(isLabelEditable) {
    if (this.domLabel && isLabelEditable) {
      // 更新信号量
      this.isLabelEditable = isLabelEditable;

      // 注册双击事件：手动输入值
      this.domIndicator.addEventListener('dblclick', event => {
        if (this.domLabel && this.isLabelEditable) {
          // 更新信号量
          this.isLabelEditing = true;
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
        this.isLabelEditing = false;
        // 根据输入数据调整indicator
        this.setIndicatorByText(this.domLabel.innerHTML);
        // 取消label可编辑状态
        this.domLabel.setAttribute('contenteditable', false);
        // 更新label
        this.isCursorOnIndicator ? this.setLabelShowValue() : this.setLabelShowInnerText();
      });
    }
    else {
      this.isLabelEditable = false;
    }
  }


  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  // 通过targe value来更新indicator状态
  setIndicatorByValue(targetValue, isForceUpdate = false) {
    //判定是否有必要更新
    if (targetValue != this.currentValue || isForceUpdate) {
      const prevValue = this.currentValue;
      const prevStateValue = this.stateValue;
      this.currentValue = targetValue;
      this.stateValue = this.valueToState(this.currentValue);

      // 判断是否要更新indicator的sprite
      const preIndex = this.getSpriteIndexByStateValue(prevStateValue);
      const curIndex = this.getSpriteIndexByStateValue();
      if (preIndex != curIndex || isForceUpdate) {
        this.domIndicator.style.backgroundPosition = `0% ${curIndex / (this.spriteLength - 1) * 100}%`;
        this.domIndicator.style.backgroundRepeat = 'repeat-y';
      }

      // 触发changed事件
      const eventChanged = new CustomEvent('changed', {
        detail: {
          // previousValue: prevValue,
          value: targetValue
        }
      });
      this.domContainer.dispatchEvent(eventChanged);
      this.eventTarget.dispatchEvent(eventChanged);
    }
  }

  //-----------------------------------------------------------------------------------------
  // 通过targe state value来更新indicator状态
  setIndicatorByState(targetState) {
    this.setIndicatorByValue(this.stateToValue(targetState));
  }

  //-----------------------------------------------------------------------------------------
  // 获取sprite的index
  getSpriteIndexByStateValue(stateValue = this.stateValue) {
    return Math.round(stateValue * (this.spriteLength - 1));
  }

  //-----------------------------------------------------------------------------------------
  // 通过text number来更新indicator状态
  setIndicatorByText(inputText) {
    const targetNumber = parseFloat(inputText); // 尝试将输入转换为浮点数
    if (!isNaN(targetNumber) && targetNumber >= this.valueStart && targetNumber <= this.valueEnd) {
      this.setIndicatorByValue(targetNumber);
    } else if (this.isCursorOnIndicator) {
      console.warn(this.componentType + ': inputText should be a number between valueStart and valueEnd.');
    }
  }

  //-----------------------------------------------------------------------------------------
  // 捕获事件
  addEventListener(eventName, eventHandler) {
    this.eventTarget.addEventListener(eventName, eventHandler);
  }


  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  // 状态值转输出值
  stateToValue(stateValue) {
    return (this.valueEnd - this.valueStart) * Math.pow(stateValue, this.skewFactor) + this.valueStart;
  }

  //-----------------------------------------------------------------------------------------
  // 输出值转状态值
  valueToState(value) {
    return Math.pow((value - this.valueStart) / (this.valueEnd - this.valueStart), 1 / this.skewFactor);
  }
}