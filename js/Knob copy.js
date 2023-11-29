export default class Knob {
  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  constructor(container, sizeRatio = 0.8, knobName = 'NEWKNOB', devMode = false) {
    this.domContainer = container;
    this.sizeRatio = sizeRatio;
    this.knobName = knobName;

    this.valueStart = 0;
    this.valueEnd = 1;
    this.defaultValue = 0.5;
    this.currentValue = 0.5;

    this.stateValue = 0; // 0~1
    this.skewFactor = 1; // 当skewFactor为1时，knob是线性控件；非1时为非线性控件。除非极为特殊的情况，否则skewFactor应该大于0。

    this.isLabelResponsive = false;
    this.isLabelEditable = false;
    this.isLabelEditing = false;

    this.isCursorOnIndicator = false;
    this.isMouseDownOnIndicator = false;
    this.isIndicatorDragging = false;

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
    this.domIndicatorBox.className = 'knob-indicator-box';
    this.domIndicatorBox.id = this.domIndicatorBox.className + '-' + this.knobName;

    // 设置indicatorBox尺寸、布局、定位
    this.domIndicatorBox.style.width = `${this.sizeRatio * 100}%`;
    this.domIndicatorBox.style.aspectRatio = '1/1';
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
    this.domIndicator.className = 'knob-indicator';
    this.domIndicator.id = this.domIndicator.className + '-' + this.knobName;

    // 设置indicator尺寸、布局、定位
    this.domIndicator.style.width = '100%';
    this.domIndicator.style.aspectRatio = '1/1';
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
    this.boundMouseEnterIndicatorHandler = this.mouseEnterIndicatorHandler.bind(this);
    this.boundMouseLeaveIndicatorHandler = this.mouseLeaveIndicatorHandler.bind(this);
    this.domIndicator.addEventListener('mouseenter', this.boundMouseEnterIndicatorHandler);
    this.domIndicator.addEventListener('mouseleave', this.boundMouseLeaveIndicatorHandler);

    //-----------------------------------------------------------------------------------------
    // 给indicator注册鼠标按下事件
    this.domIndicator.addEventListener('mousedown', event => {
      // 更新信号量
      this.isMouseDownOnIndicator = true;
      // 鼠标在indicator中时，鼠标样式为grabbing
      document.body.style.cursor = 'grabbing';
      // 触发start-interacting事件
      document.body.dispatchEvent(new CustomEvent('start-interacting'));
    });

    //-----------------------------------------------------------------------------------------
    // 当用户正在操作其它控件时，屏蔽鼠标事件
    document.body.addEventListener('start-interacting', event => {
      if (!this.isMouseDownOnIndicator) {
        this.domIndicator.removeEventListener('mouseenter', this.boundMouseEnterIndicatorHandler);
        this.domIndicator.removeEventListener('mouseleave', this.boundMouseLeaveIndicatorHandler);
      }
    });

    //-----------------------------------------------------------------------------------------
    // 当用户停止操作其它控件时，恢复鼠标事件
    document.body.addEventListener('stop-interacting', event => {
      if (!this.isMouseDownOnIndicator) {
        this.domIndicator.addEventListener('mouseenter', this.boundMouseEnterIndicatorHandler);
        this.domIndicator.addEventListener('mouseleave', this.boundMouseLeaveIndicatorHandler);
      }
    });

    //-----------------------------------------------------------------------------------------
    // 注册鼠标移动事件
    document.addEventListener('mousemove', event => {
      // 判定鼠标拖动事件
      if (this.isMouseDownOnIndicator) {
        // 更新信号量
        this.isIndicatorDragging = true;
        // 计算增量：indicator的增量与鼠标Y轴移动速度关联
        const increment = Math.abs(event.movementY);
        const sign = Math.sign(-event.movementY);
        let nextState = this.stateValue + sign * Math.pow(increment, 1) * 0.005;
        // 判断是否已达indicator的边界
        if (nextState < 0) { nextState = 0; }
        if (nextState > 1) { nextState = 1; }
        // 设置indicator的角度
        this.setIndicatorByState(nextState);
        // label显示当前值
        if (this.domLabel && this.isLabelResponsive) { this.setLabelShowValue(); }
      }
    });

    //-----------------------------------------------------------------------------------------
    // 鼠标释放事件（即拖动时也会释放拖动事件）
    document.addEventListener('mouseup', event => {
      if (this.isMouseDownOnIndicator) {
        // 更新信号量
        this.isMouseDownOnIndicator = false;
        this.isIndicatorDragging = false;
        // 鼠标在indicator中时，鼠标样式为grabbing
        document.body.style.cursor = this.isCursorOnIndicator ? 'grab' : 'default';
        // 当label需要响应鼠标事件时，若鼠标不在knob上，label显示标签
        if (this.domLabel && this.isLabelResponsive && !this.isCursorOnIndicator) { this.setLabelShowInnerText(); }
        // 触发stop-interacting事件
        document.body.dispatchEvent(new CustomEvent('stop-interacting'));
      }
    });

    //-----------------------------------------------------------------------------------------
    // 给indicator注册键盘+点击事件：按住command键(MacOS)、ctrl键(Windows)、alt键单击恢复默认值
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
    // 鼠标不在拖动状态时，鼠标样式为grab；在拖动状态时，鼠标样式为grabbing
    document.body.style.cursor = this.isIndicatorDragging ? 'grabbing' : 'grab';
    // 当label需要响应鼠标事件时，若不在编辑状态，label显示当前值
    if (this.domLabel && this.isLabelResponsive && !this.isLabelEditing) { this.setLabelShowValue(); };
  }

  //-----------------------------------------------------------------------------------------
  mouseLeaveIndicatorHandler() {
    // 更新信号量
    this.isCursorOnIndicator = false;
    // 鼠标不在拖动状态时，鼠标样式恢复默认；在拖动状态时，鼠标样式为grabbing
    document.body.style.cursor = this.isIndicatorDragging ? 'grabbing' : 'default';
    // 当label需要响应鼠标事件时，若不在编辑状态，label显示标签且撤回可编辑状态
    if (this.domLabel && this.isLabelResponsive && !this.isLabelEditing) {
      this.setLabelShowInnerText();
      this.domLabel.setAttribute('contenteditable', false);
    };
  }


  //-----------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  // 设置value范围及默认值
  setValueConfig(valueStart, valueEnd, defaultValue) {
    this.valueStart = valueStart;
    this.valueEnd = valueEnd;
    this.defaultValue = defaultValue;
    this.currentValue = defaultValue;
    this.setIndicatorByValue(this.defaultValue);
  }

  //-----------------------------------------------------------------------------------------
  // 设置中间值来非线性地调整knob
  setSkewFactorByMidValue(midValue) {
    if (midValue > this.valueStart && midValue < this.valueEnd) {
      this.skewFactor = Math.log((midValue - this.valueStart) / (this.valueEnd - this.valueStart)) / Math.log(0.5);
      this.setIndicatorByValue(this.currentValue);
      return true;
    } else {
      return false;
    }
  }

  //-----------------------------------------------------------------------------------------
  // 配置indicator的sprite
  setIndicatorSprite(spritePath) {
    const img = new Image();
    img.onload = () => {
      this.spriteLength = img.height / img.width;
      this.domIndicator.style.background = `url(${spritePath})`;
      this.domIndicator.style.backgroundSize = '100% auto';
      this.setIndicatorByValue(this.currentValue);
    }
    img.src = spritePath;
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
    this.domScale.style.aspectRatio = '1/1';
    this.domScale.style.position = 'absolute';
    this.domScale.style.top = '50%';
    this.domScale.style.left = '50%';
    this.domScale.style.transform = 'translate(-50%, -50%)';
    // 设置scale样式
    this.domScale.style.background = `url(${scalePath})`;
    this.domScale.style.backgroundSize = '100% auto';
    this.domScale.style.backgroundRepeat = 'no-repeat';
    this.domScale.style.zIndex = 1;
    this.devMode ? this.domScale.style.border = '0.5px solid green' : null;
  }

  //-----------------------------------------------------------------------------------------
  // 设置label
  setLabel(innerText, className) {
    // 创建label节点
    this.domLabel = document.createElement('span');
    this.domIndicatorBox.appendChild(this.domLabel);
    // 设置label基本属性
    this.domLabel.className = 'knob-label';
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
  // 通过目标值来旋转indicator
  setIndicatorByValue(targetValue) {
    // 更新当前值
    this.currentValue = targetValue;
    // 更新当前状态值
    this.stateValue = this.valueToState(this.currentValue);
    // 根据目标角度更新indicator的样式（精灵图）
    this.domIndicator.style.backgroundPosition = `0% ${this.getIndexSprite() / (this.spriteLength - 1) * 100}%`;
    // 触发changed事件
    this.domContainer.dispatchEvent(new CustomEvent('changed'));
  }

  //-----------------------------------------------------------------------------------------
  // 通过目标状态值来旋转indicator
  setIndicatorByState(targetState) {
    // 更新当前状态值
    this.stateValue = targetState;
    // 更新当前值
    this.currentValue = this.stateToValue(this.stateValue);
    // 根据目标角度更新indicator的样式（精灵图）
    this.domIndicator.style.backgroundPosition = `0% ${this.getIndexSprite() / (this.spriteLength - 1) * 100}%`;
    // 触发changed事件
    this.domContainer.dispatchEvent(new CustomEvent('changed'));
  }

  //-----------------------------------------------------------------------------------------
  // 通过文本来设置indicator的角度
  setIndicatorByText(inputText) {
    // 接收数字
    const targetNumber = parseFloat(inputText); // 尝试将输入转换为浮点数
    // 处理数字
    if (!isNaN(targetNumber) && targetNumber >= this.valueStart && targetNumber <= this.valueEnd) {
      this.setIndicatorByValue(targetNumber);
      this.domContainer.dispatchEvent(new CustomEvent('changed')); // 触发changed事件
    } else if (this.isCursorOnFrame) {
      this.setLabelShowValue(false);
    }
  }

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

  //-----------------------------------------------------------------------------------------
  // 由indicator的角度获取sprite的index
  getIndexSprite() {
    return Math.round(this.stateValue * (this.spriteLength - 1));
  }
}