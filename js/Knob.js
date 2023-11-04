class Knob {
  constructor(width = 100, height, knobName = `New Knob`, degStart = -135, degEnd = 135, valueStart = -64, valueEnd = 12, defaultValue = -12, numberDecimals = 1, suffix = `dB`) {
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    this.widthFrame = width;
    this.heightFrame = this.widthFrame * 1.4;
    this.knobName = knobName;
    this.indicatorStartDeg = degStart;
    this.indicatorEndDeg = degEnd;
    this.valueStart = valueStart;
    this.valueEnd = valueEnd;
    this.defaultValue = defaultValue;
    this.numberDecimals = numberDecimals;
    this.suffix = suffix;
    this.isHovering = false;
    this.isEditing = false;

    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 创建frame节点
    this.frame = document.createElement(`div`);
    document.body.insertBefore(this.frame, document.body.children[0]);

    // 设置frame基本属性
    this.frame.className = "knob_frame";
    this.frame.id = this.frame.className + `_` + knobName;

    // 设置frame尺寸与定位
    this.frame.style.width = `${this.widthFrame}px`;
    this.frame.style.height = `${this.heightFrame}px`;
    this.frame.style.position = `absolute`;

    // 设置frame样式
    this.frame.style.backgroundColor = `gray`;

    //-----------------------------------------------------------------------------------------
    // 创建knob节点
    this.knob = document.createElement(`div`);
    this.frame.appendChild(this.knob);

    // 设置knob基本属性
    this.knob.className = `knob`;
    this.knob.id = this.knob.className + `_` + knobName;

    // 设置knob尺寸与定位
    this.knob.style.width = `${this.widthFrame}px`;
    this.knob.style.height = `${this.widthFrame}px`;
    this.knob.style.boxSizing = `border-box`;
    this.knob.style.position = `absolute`;
    this.knob.style.top = `0`;
    this.knob.style.left = `0`;

    // 设置knob基本样式
    this.knob.style.borderRadius = `50%`;
    this.knob.style.border = `1px solid black`;
    this.knob.style.backgroundColor = `pink`;

    //-----------------------------------------------------------------------------------------
    // 创建indicator
    this.indicator = document.createElement(`div`);
    this.knob.append(this.indicator);

    // 设置indicator基本属性
    this.indicator.className = `knob_indicator`;
    this.indicator.id = this.indicator.className + `_${knobName}`;

    // 设置indicator尺寸与定位
    this.ratioIndicator = 0.92;
    this.widthIndicator = this.widthFrame * this.ratioIndicator;
    this.heightIndicator = this.widthFrame * this.ratioIndicator;
    this.indicator.style.width = `${this.widthIndicator}px`;
    this.indicator.style.height = `${this.heightIndicator}px`;
    this.indicator.style.boxSizing = `border-box`;
    this.indicator.style.position = `absolute`;
    this.indicator.style.left = `50%`;
    this.indicator.style.top = `50%`;
    this.indicator.style.transform = `translate(-50%, -50%)`;

    // 设置indicator基本样式
    this.indicator.style.borderRadius = `50%`;
    this.indicator.style.backgroundColor = `skyblue`;
    this.indicator.style.cursor = "grab";

    //-----------------------------------------------------------------------------------------
    // 创建pointer节点
    this.pointer = document.createElement(`div`);
    this.indicator.append(this.pointer);

    // 设置pointer基本属性
    this.pointer.className = `knob_indicator_pointer`;
    this.pointer.id = this.pointer.className + `_${knobName}`;

    // 设置pointer尺寸与定位
    this.widthPointer = 4;
    this.heightPointer = this.heightIndicator * 0.35;
    this.pointer.style.width = `${this.widthPointer}px`;
    this.pointer.style.height = `${this.heightPointer}px`;
    this.pointer.style.position = `absolute`;
    this.pointer.style.left = `50%`;
    this.pointer.style.transformOrigin = `50% 100%`;
    this.pointer.style.transform = `translate(-50%, 0)`;

    // 设置pointer基本样式
    this.pointer.style.borderRadius = `${this.widthPointer * 0.5}px`;
    this.pointer.style.backgroundColor = `black`;

    //-----------------------------------------------------------------------------------------
    // 创建label节点
    this.label = document.createElement(`span`);
    this.frame.appendChild(this.label);

    // 设置label基本属性
    this.setLabelShowName();
    this.label.value = knobName;
    this.label.className = `knob_label`;
    this.label.id = this.label.className + `_${knobName}`;

    // 设置label尺寸与定位
    this.label.style.width = `${this.widthFrame}px`;
    this.label.style.height = `${this.heightFrame - this.widthFrame}px`;
    this.label.style.position = `absolute`;
    this.label.style.bottom = `0`;
    this.label.style.left = `50%`;
    this.label.style.transform = `translate(-50%, 0)`;

    // 设置label样式
    this.label.style.textAlign = `center`;
    this.label.style.lineHeight = this.label.style.height;
    this.label.style.fontSize = `${this.widthFrame * 0.2}px`;
    this.label.style.backgroundColor = `pink`;

    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 初始化
    this.setIndicatorFromValue(this.defaultValue);

    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 在构造函数中绑定方法，并保存为实例的属性
    this.mouseMoveOnIndicatorEventResponse = this.mouseMoveOnIndicatorEventResponse.bind(this);

    //-----------------------------------------------------------------------------------------
    // 给indicator注册点击事件：为拖动事件设置监听器
    this.indicator.addEventListener('mousedown', e => {
      this.indicator.addEventListener('mousemove', this.mouseMoveOnIndicatorEventResponse);
    })

    //-----------------------------------------------------------------------------------------
    // 给indicator注册释放事件：释放光标、移除拖动事件监听器
    this.indicator.addEventListener('mouseup', e => {
      document.exitPointerLock();
      this.indicator.removeEventListener('mousemove', this.mouseMoveOnIndicatorEventResponse);
    })

    //-----------------------------------------------------------------------------------------
    // 给indicator注册键盘+点击事件：按住alt键单击恢复默认值
    this.indicator.addEventListener('click', e => {
      if (e.altKey) {
        this.setIndicatorFromValue(this.defaultValue);
      }
    })

    //-----------------------------------------------------------------------------------------
    // 给frame注册双击事件：手动输入值
    this.frame.addEventListener('dblclick', e => {
      // 更新信号量
      this.isEditing = true;

      // 激活label可编辑状态
      this.label.setAttribute(`contenteditable`, true);

      // 去掉单位
      this.setLabelShowValue(false);

      // 获取光标并全选label
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(this.label);
      selection.removeAllRanges();
      selection.addRange(range);

      // 给label注册回车事件
      this.label.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          // 更新信号量
          this.isEditing = false;
          // 防止换行
          e.preventDefault();
          // 根据输入数据调整indicator
          this.setIndicatorFromText(this.label.innerHTML);
          // 取消label可编辑状态
          this.label.setAttribute(`contenteditable`, false);
          // 若用户鼠标已经离开，则恢复label标签
          if (!this.isHovering) this.setLabelShowName();
        }
      })

      // 给label注册失焦事件
      this.label.addEventListener('blur', e => {
        // 更新信号量
        this.isEditing = false;
        // 根据输入数据调整indicator
        this.setIndicatorFromText(this.label.innerHTML);
        // 取消label可编辑状态
        this.label.setAttribute(`contenteditable`, false);
        // 若用户鼠标已经离开，则恢复label标签
        if (!this.isHovering) this.setLabelShowName();
      })
    })

    //-----------------------------------------------------------------------------------------
    // 屏蔽右键菜单
    this.frame.addEventListener('contextmenu', e => {
      e.preventDefault(); // 阻止默认的右键菜单弹出
    }, false);

    //-----------------------------------------------------------------------------------------
    // 给frame添加鼠标移入事件：label显示当前值
    this.frame.addEventListener('mouseenter', () => {
      // 更新信号量
      this.isHovering = true;

      // 防止编辑状态下移入鼠标导致label改变
      if (!this.isEditing) {
        this.setLabelShowValue();
      }
    })

    //-----------------------------------------------------------------------------------------
    // 给knob添加鼠标移出事件：label显示控件名称
    this.frame.addEventListener('mouseleave', () => {
      // 更新信号量
      this.isHovering = false;

      // 如果label不在编辑状态，则移除label可编辑状态
      if (!this.isEditing) {
        this.setLabelShowName();
        this.label.setAttribute(`contenteditable`, false);
      }
    })

    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    return this.knob;
  }

  //-----------------------------------------------------------------------------------------
  mouseMoveOnIndicatorEventResponse(e) {
    // 固定并隐藏鼠标
    this.indicator.requestPointerLock();
    // 计算增量：indicator的增量与鼠标Y轴移动速度关联
    const increment = Math.abs(e.movementY);
    const sign = Math.sign(-e.movementY);
    let nextDeg = this.currentIndicatorDeg + sign * Math.pow(increment, 1.25) * 0.3;
    // let nextDeg = this.currentIndicatorDeg + sign * increment * 0.6;
    // 判断是否已达indicator的边界
    nextDeg = nextDeg <= this.indicatorStartDeg ? this.indicatorStartDeg : nextDeg;
    nextDeg = nextDeg >= this.indicatorEndDeg ? this.indicatorEndDeg : nextDeg;
    // 设置indicator的角度
    this.setIndicatorFromDeg(nextDeg);
  }

  //-----------------------------------------------------------------------------------------
  // 通过目标角度来旋转indicator
  setIndicatorFromDeg(targetDeg) {
    // 取目标角度
    this.currentIndicatorDeg = targetDeg % 360.0;
    // 根据目标角度更新indicator的样式
    this.indicator.style.transform = `translate(-50%, -50%) rotate(${targetDeg}deg)`;
    // 更新当前值
    this.currentValue = this.degToValue(this.currentIndicatorDeg);
    // 更新label
    this.setLabelShowValue();
  }

  //-----------------------------------------------------------------------------------------
  // 通过目标值来旋转indicator
  setIndicatorFromValue(targetValue) {
    // 更新当前值
    this.currentValue = targetValue;
    // 计算目标角度
    const targetDeg = this.valueToDeg(targetValue);
    // 根据目标角度更新indicator的样式
    this.indicator.style.transform = `translate(-50%, -50%) rotate(${targetDeg}deg)`;
    // 更新当前角度
    this.currentIndicatorDeg = targetDeg % 360.0;
    // 更新label
    this.setLabelShowValue();
  }

  //-----------------------------------------------------------------------------------------
  // 通过文本来旋转indicator
  setIndicatorFromText(inputText) {
    // 接收数字
    const targetNumber = parseFloat(inputText); // 尝试将输入转换为浮点数
    // 处理数字
    if (!isNaN(targetNumber) && targetNumber >= this.valueStart && targetNumber <= this.valueEnd) {
      this.setIndicatorFromValue(targetNumber);
    } else if (this.isHovering) {
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
  setLabelShowName() {
    this.label.innerHTML = this.knobName;
  }

  //-----------------------------------------------------------------------------------------
  setLabelShowValue(withSuffix = true) {
    const targetText = withSuffix ? this.currentValue.toFixed(this.numberDecimals) + this.suffix : this.currentValue.toFixed(this.numberDecimals);
    this.label.innerHTML = targetText;
  }

}