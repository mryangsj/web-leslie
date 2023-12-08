export default class Switch {
  constructor(container, sizeRatio = 0.8, switchName = 'newSwitch', devMode = false, componentType = 'switch') {
    this.componentType = componentType;
    this.className = this.componentType;
    this.id = this.className + '-' + switchName;

    this.domContainer = container;
    this.sizeRatio = sizeRatio;
    this.switchName = switchName;

    this.valueStart = 0;
    this.valueEnd = 1;
    this.valueStep = 1;
    this.defaultValue = 0;
    this.currentValue = 0;

    this.stateValue = 0; // 0~1

    this.directionResponseToMouse = 'vertical'; // 'horizontal' or 'vertical'
    this.cursorTouch = 'pointer';
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
    this.domContainer.style.boxSizing = 'border-box';
    this.devMode ? this.domContainer.style.border = '0.5px solid red' : null;

    //-----------------------------------------------------------------------------------------
    // 创建domComponentBox节点
    this.domComponentBox = document.createElement('div');
    this.domContainer.appendChild(this.domComponentBox);

    // 设置domComponentBox的class和id
    this.domComponentBox.className = this.componentType + '-component-box';
    this.domComponentBox.id = this.domComponentBox.className + '-' + this.switchName;

    // 设置domComponentBox尺寸、布局、定位
    this.domComponentBox.style.width = `${this.sizeRatio * 100}%`;
    this.domComponentBox.style.aspectRatio = '1 / 1';
    this.domComponentBox.style.position = 'relative';
    this.domComponentBox.style.top = '50%';
    this.domComponentBox.style.left = '50%';
    this.domComponentBox.style.transform = 'translate(-50%, -50%)';

    // 设置domComponentBox样式
    this.domContainer.style.boxSizing = 'border-box';
    this.devMode ? this.domComponentBox.style.border = '0.5px solid pink' : null;

    //-----------------------------------------------------------------------------------------
    // 创建indicator节点
    this.domIndicator = document.createElement('div');
    this.domComponentBox.append(this.domIndicator);

    // 设置indicator的class和id
    this.domIndicator.className = this.componentType + '-indicator';
    this.domIndicator.id = this.domIndicator.className + '-' + this.switchName;

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
    // 创建labelBox节点
    this.domLabelBox = document.createElement('div');
    this.domComponentBox.append(this.domLabelBox);

    // 设置labelBox的class和id
    this.domLabelBox.className = this.componentType + '-label-box';
    this.domLabelBox.id = this.domLabelBox.className + '-' + this.switchName;

    // 设置labelBox尺寸、布局、定位
    this.domLabelBox.style.width = '100%';
    this.domLabelBox.style.height = '100%';
    this.domLabelBox.style.position = 'absolute';
    this.domLabelBox.style.top = '50%';
    this.domLabelBox.style.left = '50%';
    this.domLabelBox.style.transform = 'translate(-50%, -50%)';

    // 设置labelBox样式
    this.domLabelBox.style.zIndex = 1;
    this.devMode ? this.domLabelBox.style.border = '1px solid yellow' : null;


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
        // 吸附到最近的状态
        this.stateValue = this.valueToState(this.currentValue);
        // 触发stop-interacting事件
        document.body.dispatchEvent(new CustomEvent('stop-interacting'));
      }
    });

    //-----------------------------------------------------------------------------------------
    // 给indicator注册恢复默认值事件：按住command键(MacOS)、ctrl键(Windows)、alt键单击恢复默认值
    this.domIndicator.addEventListener('click', event => {
      // 恢复默认值
      if (event.altKey || event.metaKey || event.ctrlKey) {
        this.setIndicatorByValue(this.defaultValue);
        if (this.domLabel && this.isLabelResponsive) { this.setLabelShowValue() };
      }
      // 切换到下一状态
      else {
        const nextValue = this.currentValue + this.valueStep;
        if (nextValue > this.valueEnd) { this.setIndicatorByValue(this.valueStart); }
        else { this.setIndicatorByValue(nextValue); }
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
  }

  //-----------------------------------------------------------------------------------------
  mouseLeaveIndicatorHandler() {
    // 更新信号量
    this.isCursorOnIndicator = false;
    // 更新鼠标样式
    document.body.style.cursor = this.isIndicatorDragging ? this.cursorDraging : 'default';
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
    // 更新indicator的状态
    this.setIndicatorByState(nextState);
  }

  //-----------------------------------------------------------------------------------------
  // 设置控件的鼠标交互方向
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
    if (!Number.isInteger(valueStart) || !Number.isInteger(valueEnd) || !Number.isInteger(defaultValue)) {
      console.warn(this.id + ': valueStart, valueEnd and defaultValue should be integers.\nCurrent valueStart: ' + valueStart + '.\nCurrent valueEnd: ' + valueEnd + '.\nCurrent defaultValue: ' + defaultValue + '.')
    }
    this.valueStart = valueStart;
    this.valueEnd = valueEnd;
    this.defaultValue = defaultValue;
    this.currentValue = defaultValue;
    this.setIndicatorByValue(this.defaultValue);
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
          this.domComponentBox.style.width = `${this.sizeRatio * 100}%`;
          this.domComponentBox.style.height = '';
        } else if (fillDirection === 'height') {
          this.domComponentBox.style.height = `${this.sizeRatio * 100}%`;
          this.domComponentBox.style.width = '';
        } else {
          console.warn(this.componentType + ': fillDirection should be "width" or "height".');
        }

        // 设置indicatorBox的比例
        sampleWidth = imgSample.width;
        sampleHeight = imgSample.height;
        this.domComponentBox.style.aspectRatio = `${sampleWidth} / ${sampleHeight}`;

        // 微调indicatorBox的定位
        this.domComponentBox.style.top = `${(0.5 + positionTopLeftFinetune[0]) * 100}%`;
        this.domComponentBox.style.left = `${(0.5 + positionTopLeftFinetune[1]) * 100}%`;

        // 计算sprite的长度（！必须在调用setIndicatorByValue函数前计算好）
        const spriteAspectRatio = imgSprite.width / imgSprite.height;
        const sampleAspectRatio = sampleWidth / sampleHeight;
        this.spriteLength = sampleAspectRatio / spriteAspectRatio;
        if (!Number.isInteger(this.spriteLength)) { console.warn(this.componentType + ': spriteLength is an integer.'); }

        // 设置indicator的sprite
        this.domIndicator.style.background = `url(${spritePath})`;
        this.domIndicator.style.backgroundSize = `100% auto`;
        this.domIndicator.style.backgroundRepeat = 'no-repeat';
        this.setIndicatorByValue(this.currentValue, true);
      };
      imgSprite.src = spritePath;
    }
    imgSample.src = spritePathSample;
  }


  createLabelStatic(innerText = 'New Label', cssClassName) {
    // 创建label节点
    const label = document.createElement('span');
    this.domLabelBox.appendChild(label);
    // 设置label的class、id、CSS样式
    label.className = this.componentType + '-' + 'label';
    label.id = label.className + '-' + innerText;
    if (cssClassName) { label.classList.add(cssClassName); }
    // 设置label尺寸、定位
    label.style.width = 'auto';
    label.style.height = 'auto';

    label.innerText = innerText;
    label.style.position = 'absolute';
    label.style.textAlign = 'center';
    label.style.left = '50%';
    label.style.transform = 'translate(-50%, 0%)';
    label.style.whiteSpace = 'nowrap';
    this.devMode ? label.style.border = '0.5px solid yellow' : null;

    return label;
  }


  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  // 通过目标值来旋转indicator
  setIndicatorByValue(targetValue, isForceUpdate = false) {
    //判定是否有必要更新
    if (targetValue != this.currentValue || isForceUpdate) {
      const prevStateValue = this.stateValue;
      this.currentValue = targetValue;
      this.stateValue = this.valueToState(this.currentValue);

      // 判断是否要更新indicator的sprite
      const preIndex = this.getSpriteIndexByStateValue(prevStateValue);
      const curIndex = this.getSpriteIndexByStateValue();
      if (preIndex != curIndex || isForceUpdate) {
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
      this.eventTarget.dispatchEvent(eventChanged);
    }
  }

  //-----------------------------------------------------------------------------------------
  // 通过目标状态值来旋转indicator
  setIndicatorByState(targetState) {
    // 判定是否有必要更新
    if (targetState != this.stateValue) {
      const prevStateValue = this.stateValue;
      this.stateValue = targetState;
      this.currentValue = this.stateToValue(targetState);

      // 判断是否要更新indicator的sprite
      const preIndex = this.getSpriteIndexByStateValue(prevStateValue);
      const curIndex = this.getSpriteIndexByStateValue();
      if (preIndex != curIndex) {
        this.domIndicator.style.backgroundPosition = `0% ${curIndex / (this.spriteLength - 1) * 100}%`;
      }

      // 触发changed事件
      const eventChanged = new CustomEvent('changed', {
        detail: {
          // previousValue: prevValue,
          value: this.currentValue
        }
      });
      this.domContainer.dispatchEvent(eventChanged);
      this.eventTarget.dispatchEvent(eventChanged);
    }
  }

  //-----------------------------------------------------------------------------------------
  // 由indicator状态获取sprite的index
  getSpriteIndexByStateValue(stateValue = this.stateValue) {
    return Math.round(stateValue * (this.spriteLength - 1));
  }

  //-----------------------------------------------------------------------------------------
  // 捕获事件
  addEventListener(eventName, eventHandler) {
    this.eventTarget.addEventListener(eventName, eventHandler);
  }


  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  // 状态值转真值
  stateToValue(stateValue) {
    return Math.round(stateValue * this.valueEnd);
  }

  //-----------------------------------------------------------------------------------------
  // 真值转状态值
  valueToState(value) {
    if (!Number.isInteger(value)) {
      console.warn(this.id + ': value should be an integer.\nCurrent value: ' + value + '.');
    }
    return value * (1 / this.valueEnd);
  }
}