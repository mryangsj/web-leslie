export default class Knob {
  constructor(width = 100, knobLabel = 'New Knob', valueStart = 0, valueEnd = 1, defaultValue = 0.5, numberDecimals = 3, suffix = 'dB', spritePath = 'resources/KnobMid.png', spriteLength = 129, degStart = -150, degEnd = 150, devMode = true) {
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    this.ratioSizeDom = 1.3;
    this.widthDom = width;
    this.heightDom = this.widthDom * this.ratioSizeDom;
    this.knobName = knobLabel;
    this.indicatorStartDeg = degStart;
    this.indicatorEndDeg = degEnd;
    this.valueStart = valueStart;
    this.valueEnd = valueEnd;
    this.defaultValue = defaultValue;
    this.currentValue = defaultValue;
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
    // 创建DOM文档节点
    this.dom = document.createElement('div');
    document.body.insertBefore(this.dom, document.body.firstChild);

    // 设置dom基本属性
    this.dom.className = 'knob';
    this.dom.id = this.dom.className + '-' + knobLabel;

    // 设置dom尺寸与定位
    this.dom.style.width = `${this.widthDom}px`;
    this.dom.style.height = `${this.heightDom}px`;
    this.dom.style.position = 'absolute';

    // 设置dom样式
    devMode ? this.dom.style.backgroundColor = 'gray' : null;
    devMode ? this.dom.style.border = '1px solid black' : null;

    //-----------------------------------------------------------------------------------------
    // 创建indicatorBox节点
    this.domIndicatorBox = document.createElement('div');
    this.dom.appendChild(this.domIndicatorBox);

    // 设置indicatorBox基本属性
    this.domIndicatorBox.className = 'indicator-box';
    this.domIndicatorBox.id = this.domIndicatorBox.className + '-' + knobLabel;

    // 设置indicatorBox尺寸与定位
    this.domIndicatorBox.style.width = `${this.widthDom}px`;
    this.domIndicatorBox.style.height = `${this.widthDom}px`;
    this.domIndicatorBox.style.boxSizing = 'border-box';
    this.domIndicatorBox.style.position = 'absolute';
    this.domIndicatorBox.style.top = '0';
    this.domIndicatorBox.style.left = '0';

    // 设置indicatorBox基本样式
    devMode ? this.domIndicatorBox.style.backgroundColor = 'pink' : null;

    //-----------------------------------------------------------------------------------------
    // 创建indicator节点
    this.domIndicator = document.createElement('div');
    this.domIndicatorBox.append(this.domIndicator);

    // 设置indicator基本属性
    this.domIndicator.className = 'knob-indicator';
    this.domIndicator.id = this.domIndicator.className + '-' + `${knobLabel}`;

    // 设置indicator尺寸与定位
    this.ratioSizeIndicator = 1;
    this.widthIndicator = this.widthDom * this.ratioSizeIndicator;
    this.heightIndicator = this.widthDom * this.ratioSizeIndicator;
    this.domIndicator.style.width = `${this.widthIndicator}px`;
    this.domIndicator.style.height = `${this.heightIndicator}px`;
    this.domIndicator.style.boxSizing = 'border-box';
    this.domIndicator.style.position = 'absolute';
    this.domIndicator.style.left = '50%';
    this.domIndicator.style.top = '50%';
    this.domIndicator.style.transform = 'translate(-50%, -50%)';

    // 设置indicator基本样式
    this.domIndicator.style.overflow = 'default';
    this.domIndicator.style.background = `url(${this.spritePath})`;
    this.domIndicator.style.backgroundSize = '100% auto';

    //-----------------------------------------------------------------------------------------
    // 创建labelBox节点
    this.domLabelBox = document.createElement('div');
    this.dom.appendChild(this.domLabelBox);

    // 设置labelBox基本属性
    this.domLabelBox.className = 'knob-label-box';
    this.domLabelBox.id = this.domLabelBox.className + '-' + `${knobLabel}`;

    // 设置labelBox尺寸与定位
    this.domLabelBox.style.width = `${this.widthDom}px`;
    this.domLabelBox.style.height = `${this.heightDom - this.widthDom}px`;
    this.domLabelBox.style.position = 'absolute';
    this.domLabelBox.style.bottom = '0';
    this.domLabelBox.style.left = '50%';
    this.domLabelBox.style.transform = 'translate(-50%, 0)';

    // 设置label样式
    devMode ? this.domLabelBox.style.backgroundColor = 'skyblue' : null;

    //-----------------------------------------------------------------------------------------
    // 创建label节点
    this.domLabel = document.createElement('span');
    this.domLabelBox.appendChild(this.domLabel);

    // 设置label基本属性
    this.domLabel.className = 'knob-label';
    this.domLabel.id = this.domLabel.className + '-' + `${knobLabel}`;

    // 设置label尺寸与定位
    this.domLabel.style.width = 'auto';
    this.domLabel.style.height = 'auto';
    this.domLabel.style.position = 'absolute';
    this.domLabel.style.bottom = '0';
    this.domLabel.style.left = '50%';
    this.domLabel.style.transform = 'translate(-50%, 0)';

    // 设置label样式
    this.setLabelShowName();
    this.domLabel.style.fontSize = `${this.widthDom * 0.2}px`;
    document.body.style.cursor = 'default';
    this.domLabel.style.userSelect = 'none';
    this.domLabel.style.webkitUserSelect = 'none'; // for Safari
    devMode ? this.domLabel.style.backgroundColor = 'pink' : null;

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
        let nextDeg = this.currentIndicatorDeg + sign * Math.pow(increment, 1.3) * 0.3;
        // 判断是否已达indicator的边界
        nextDeg = nextDeg <= this.indicatorStartDeg ? this.indicatorStartDeg : nextDeg;
        nextDeg = nextDeg >= this.indicatorEndDeg ? this.indicatorEndDeg : nextDeg;
        // 设置indicator的角度
        this.setIndicatorByDeg(nextDeg);
        // label显示当前值
        this.setLabelShowValue();
        // 触发drag事件
        this.dom.dispatchEvent(new CustomEvent('drag'));
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
    // 给indicator注册键盘+点击事件：按住alt键单击恢复默认值
    this.domIndicator.addEventListener('click', e => {
      if (e.altKey) this.setIndicatorByValue(this.defaultValue);
    });

    //-----------------------------------------------------------------------------------------
    // 注册双击事件：手动输入值
    this.dom.addEventListener('dblclick', e => {
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
    this.dom.addEventListener('contextmenu', e => {
      e.preventDefault(); // 阻止默认的右键菜单弹出
    }, false);

    //-----------------------------------------------------------------------------------------
    // 添加鼠标移入事件
    this.dom.addEventListener('mouseenter', () => {
      // 更新信号量
      this.isCursorOnFrame = true;
      // 当label不在编辑状态时，label显示当前值
      if (!this.isEditing) this.setLabelShowValue();
    })

    //-----------------------------------------------------------------------------------------
    // 注册鼠标移出事件
    this.dom.addEventListener('mouseleave', () => {
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
  // 通过目标角度来旋转indicator
  setIndicatorByDeg(targetDeg) {
    // 取目标角度
    this.currentIndicatorDeg = targetDeg % 360.0;
    // 更新当前值
    this.currentValue = this.degToValue(this.currentIndicatorDeg);
    // 根据目标角度更新indicator的样式（精灵图）
    this.domIndicator.style.backgroundPosition = `0 ${-this.getIndexSprite() * this.widthIndicator}px`;
  }

  //-----------------------------------------------------------------------------------------
  // 通过目标值来旋转indicator
  setIndicatorByValue(targetValue) {
    // 更新当前值
    this.currentValue = targetValue;
    // 计算目标角度
    const targetDeg = this.valueToDeg(targetValue);
    // 更新当前角度
    this.currentIndicatorDeg = targetDeg % 360.0;
    // 根据目标角度更新indicator的样式（精灵图）
    this.domIndicator.style.backgroundPosition = `0 ${-this.getIndexSprite() * this.widthIndicator}px`;
  }

  //-----------------------------------------------------------------------------------------
  // 通过文本来设置indicator的角度
  setIndicatorByText(inputText) {
    // 接收数字
    const targetNumber = parseFloat(inputText); // 尝试将输入转换为浮点数
    // 处理数字
    if (!isNaN(targetNumber) && targetNumber >= this.valueStart && targetNumber <= this.valueEnd) {
      this.setIndicatorByValue(targetNumber);
    } else if (this.isCursorOnFrame) {
      this.setLabelShowValue(false);
    }
  }

  //-----------------------------------------------------------------------------------------
  // indicator的角度转输出值
  valueToDeg(value) {
    const deltaX = this.valueEnd - this.valueStart;
    const deltaY = this.indicatorEndDeg - this.indicatorStartDeg;
    const slop = deltaY / deltaX;
    const bias = (this.valueEnd * this.indicatorStartDeg - this.valueStart * this.indicatorEndDeg) / deltaX;
    return (slop * value + bias);
  }

  //-----------------------------------------------------------------------------------------
  // 输出值转indicator的角度
  degToValue(deg) {
    const deltaX = this.indicatorEndDeg - this.indicatorStartDeg;
    const deltaY = this.valueEnd - this.valueStart;
    const slop = deltaY / deltaX;
    const bias = (this.indicatorEndDeg * this.valueStart - this.indicatorStartDeg * this.valueEnd) / deltaX;
    return (slop * deg + bias);
  }

  //-----------------------------------------------------------------------------------------
  // 由indicator的角度获取sprite的index
  getIndexSprite() {
    const deltaX = this.indicatorEndDeg - this.indicatorStartDeg;
    const deltaY = this.spriteLength - 1;
    const slop = deltaY / deltaX;
    const bias = (- this.indicatorStartDeg * (this.spriteLength - 1)) / deltaX;
    return Math.round(slop * this.currentIndicatorDeg + bias);
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