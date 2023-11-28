export default class Knob {
  constructor(container, knobLabel = 'New Knob', valueStart = 20, valueEnd = 20000, defaultValue = 1000, numberDecimals = 1, suffix = 'Hz', spritePath = 'resources/KnobMid.png', spriteLength = 129, devMode = true) {
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    this.domContainer = container;
    this.knobName = knobLabel;

    this.valueStart = valueStart;
    this.valueEnd = valueEnd;
    this.defaultValue = defaultValue;
    this.currentValue = defaultValue;

    this.stateValue = 0; // 0~1
    this.skewFactor = 1; // 当skewFactor为1时，knob是线性控件；非1时为非线性控件。除非极为特殊的情况，否则skewFactor应该大于0。

    this.numberDecimals = numberDecimals;
    this.suffix = suffix;

    this.spritePath = spritePath;
    this.spriteLength = spriteLength;

    this.isCursorOnIndicator = false;
    this.isCursorOnFrame = false;
    this.isMouseDownOnIndicator = false;
    this.isDragging = false;
    this.isEditing = false;

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
    // 创建indicator节点
    this.domIndicator = document.createElement('div');
    this.domContainer.append(this.domIndicator);

    // 设置indicator基本属性
    this.domIndicator.className = 'knob-indicator';
    this.domIndicator.id = this.domIndicator.className + '-' + knobLabel;

    // 设置indicator尺寸、布局、定位
    this.domIndicator.style.width = '100%';
    this.domIndicator.style.aspectRatio = '1/1';
    this.domIndicator.style.position = 'absolute';
    this.domIndicator.style.top = '50%';
    this.domIndicator.style.left = '50%';
    this.domIndicator.style.transform = 'translate(-50%, -50%)';

    // 设置indicator基本样式
    this.domIndicator.style.background = `url(${this.spritePath})`;
    this.domIndicator.style.backgroundSize = '100% auto';
    this.domIndicator.style.zIndex = 2;
    this.devMode ? this.domIndicator.style.border = '0.5px solid blue' : null;

    //-----------------------------------------------------------------------------------------
    // 创建scale节点
    this.domScale = document.createElement('div');
    this.domContainer.appendChild(this.domScale);

    // 设置scale基本属性
    this.domScale.className = 'knob-scale';
    this.domScale.id = this.domScale.className + '-' + knobLabel;

    // 设置scale尺寸、布局、定位
    this.domScale.style.width = '85%';
    this.domScale.style.aspectRatio = '1/1';
    this.domScale.style.position = 'absolute';
    this.domScale.style.top = '50%';
    this.domScale.style.left = '50%';
    this.domScale.style.transform = 'translate(-50%, -50%)';

    // 设置scale样式
    this.domScale.style.background = 'url(/resources/image/knob/knob_mid_scale.png)';
    this.domScale.style.backgroundSize = '100% auto';
    this.domScale.style.backgroundRepeat = 'no-repeat';
    this.domScale.style.zIndex = 1;
    this.devMode ? this.domScale.style.border = '0.5px solid green' : null;


    //-----------------------------------------------------------------------------------------
    // 创建label节点
    this.domLabel = document.createElement('span');
    this.domContainer.appendChild(this.domLabel);

    // 设置label基本属性
    this.domLabel.className = 'knob-label';
    this.domLabel.id = this.domLabel.className + '-' + knobLabel;

    // 设置label尺寸、布局、定位
    this.domLabel.style.width = 'auto';
    this.domLabel.style.height = 'auto';
    this.domLabel.style.position = 'absolute';
    this.domLabel.style.bottom = '-4%';
    this.domLabel.style.left = '50%';
    this.domLabel.style.transform = 'translate(-50%, 0%)';

    // 设置label样式
    this.setLabelShowName();
    this.domLabel.style.textAlign = 'center';
    this.domLabel.style.whiteSpace = 'nowrap';
    this.domLabel.style.fontSize = '0.85vw';
    this.domLabel.style.fontFamily = 'Azonft Sans';
    this.domLabel.style.color = 'rgba(255, 255, 255, 0.5)';
    document.body.style.cursor = 'default';
    this.domLabel.style.userSelect = 'none';
    this.domLabel.style.webkitUserSelect = 'none'; // for Safari
    this.domLabel.style.zIndex = 1;
    this.devMode ? this.domLabel.style.border = '0.5px solid yellow' : null;


    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 通过默认值初始化
    this.setIndicatorByValue(this.defaultValue);

    //-----------------------------------------------------------------------------------------
    // 给indicator注册鼠标移入事件
    this.domIndicator.addEventListener('mouseenter', e => {
      // 更新信号量
      this.isCursorOnIndicator = true;
      // 鼠标不在拖动状态时，鼠标样式为grab；在拖动状态时，鼠标样式为grabbing
      document.body.style.cursor = this.isDragging ? 'grabbing' : 'grab';
    });

    //-----------------------------------------------------------------------------------------
    // 给indicator注册鼠标移出事件
    this.domIndicator.addEventListener('mouseleave', e => {
      // 更新信号量
      this.isCursorOnIndicator = false;
      // 鼠标不在拖动状态时，鼠标样式恢复默认；在拖动状态时，鼠标样式为grabbing
      document.body.style.cursor = this.isDragging ? 'grabbing' : 'default';
    });

    //-----------------------------------------------------------------------------------------
    // 给indicator注册鼠标按下事件
    this.domIndicator.addEventListener('mousedown', e => {
      // 更新信号量
      this.isMouseDownOnIndicator = true;
      // 鼠标在indicator中时，鼠标样式为grabbing
      document.body.style.cursor = 'grabbing';
    });

    //-----------------------------------------------------------------------------------------
    // 注册鼠标移动事件
    document.addEventListener('mousemove', e => {
      // 判定鼠标拖动事件
      if (this.isMouseDownOnIndicator) {
        // 更新信号量
        this.isDragging = true;
        // 计算增量：indicator的增量与鼠标Y轴移动速度关联
        const increment = Math.abs(e.movementY);
        const sign = Math.sign(-e.movementY);
        let nextState = this.stateValue + sign * Math.pow(increment, 1) * 0.005;
        // 判断是否已达indicator的边界
        if (nextState < 0) { nextState = 0; }
        if (nextState > 1) { nextState = 1; }
        // 设置indicator的角度
        this.setIndicatorByState(nextState);
        // label显示当前值
        this.setLabelShowValue();
      }
    });

    //-----------------------------------------------------------------------------------------
    // 鼠标释放事件（即拖动时也会释放拖动事件）
    document.addEventListener('mouseup', e => {
      // 更新信号量
      this.isMouseDownOnIndicator = false;
      this.isDragging = false;
      // 鼠标不在frame中时，label显示控件名称
      if (!this.isCursorOnFrame) this.setLabelShowName();
      // 鼠标不在indicator中时，鼠标样式恢复默认；在indicator中时，鼠标样式为grab
      document.body.style.cursor = this.isCursorOnIndicator ? 'grab' : 'default';
    });

    //-----------------------------------------------------------------------------------------
    // 给indicator注册键盘+点击事件：按住command键(MacOS)、ctrl键(Windows)、alt键单击恢复默认值
    this.domIndicator.addEventListener('click', e => {
      if (e.altKey || e.metaKey || e.ctrlKey) this.setIndicatorByValue(this.defaultValue);
      this.setLabelShowValue();
    });

    //-----------------------------------------------------------------------------------------
    // 注册双击事件：手动输入值
    this.domContainer.addEventListener('dblclick', e => {
      // 更新信号量
      this.isEditing = true;
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
    });

    //-----------------------------------------------------------------------------------------
    // 给label注册回车事件
    this.domLabel.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        // 防止换行
        e.preventDefault();
        // 触发blur事件
        this.domLabel.blur();
      }
    });

    //-----------------------------------------------------------------------------------------
    // 给label注册失焦事件
    this.domLabel.addEventListener('blur', e => {
      // 更新信号量
      this.isEditing = false;
      // 根据输入数据调整indicator
      this.setIndicatorByText(this.domLabel.innerHTML);
      // 取消label可编辑状态
      this.domLabel.setAttribute('contenteditable', false);
      // 更新label
      this.isCursorOnFrame ? this.setLabelShowValue() : this.setLabelShowName();
    })

    //-----------------------------------------------------------------------------------------
    // 屏蔽右键菜单
    this.domContainer.addEventListener('contextmenu', e => {
      e.preventDefault(); // 阻止默认的右键菜单弹出
    }, false);

    //-----------------------------------------------------------------------------------------
    // 添加鼠标移入事件
    this.domContainer.addEventListener('mouseenter', () => {
      // 更新信号量
      this.isCursorOnFrame = true;
      // 当label不在编辑状态时，label显示当前值
      if (!this.isEditing) this.setLabelShowValue();
    })

    //-----------------------------------------------------------------------------------------
    // 注册鼠标移出事件
    this.domContainer.addEventListener('mouseleave', () => {
      // 更新信号量
      this.isCursorOnFrame = false;
      // 当label不在编辑状态时，label显示控件名称
      if (!this.isEditing) {
        this.setLabelShowName();
        this.domLabel.setAttribute('contenteditable', false);
      }
    })
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
  // 设置中间值来非线性地调整knob
  setSkewFactorByMidValue(midValue) {
    if (midValue > this.valueStart && midValue < this.valueEnd) {
      this.midValue = midValue;
      this.skewFactor = Math.log((midValue - this.valueStart) / (this.valueEnd - this.valueStart)) / Math.log(0.5);
      this.setIndicatorByValue(this.currentValue);
      return true;
    } else {
      return false;
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

  //-----------------------------------------------------------------------------------------
  setLabelShowName() {
    this.domLabel.innerHTML = this.knobName;
  }

  //-----------------------------------------------------------------------------------------
  setLabelShowValue(withSuffix = true) {
    const targetText = withSuffix ? this.currentValue.toFixed(this.numberDecimals) + this.suffix : this.currentValue.toFixed(this.numberDecimals);
    this.domLabel.innerHTML = targetText;
  }
}