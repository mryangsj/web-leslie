class Knob {
  constructor(width = 100, height = 100, knobName = `New Knob`) {
    //-----------------------------------------------------------------------------------------
    // 创建frame节点
    this.frame = document.createElement(`div`);
    document.body.insertBefore(this.frame, document.body.children[0]);

    // 设置frame基本属性
    this.frame.className = "knob_frame";
    this.frame.id = this.frame.className + `_` + knobName;

    // 设置frame尺寸与定位

    //-----------------------------------------------------------------------------------------
    // 创建knob节点
    this.knob = document.createElement(`div`);
    this.frame.insertBefore(this.knob, this.frame.children[0]);

    // 设置knob基本属性
    this.knob.className = `knob`;
    this.knob.id = this.knob.className + `_` + knobName;

    // 设置knob基本样式
    this.setKnobSize(width, height);
    this.knob.style.borderRadius = `50%`;
    this.knob.style.border = `1px solid black`;
    this.knob.style.backgroundColor = `pink`;
    this.knob.style.position = `absolute`;

    //-----------------------------------------------------------------------------------------
    // 创建indicator
    this.indicator = document.createElement(`div`);
    this.knob.insertBefore(this.indicator, this.knob.children[0]);

    // 设置indicator基本属性
    this.indicator.className = `knob_indicator`;
    this.indicator.id = this.indicator.className + `_${knobName}`;

    // 设置indicator基本样式
    this.setIndicatorSize(0.92);
    this.indicator.style.borderRadius = `50%`;
    this.indicator.style.backgroundColor = `skyblue`;
    this.indicator.style.position = `absolute`;
    this.indicator.style.left = `50%`;
    this.indicator.style.top = `50%`;
    this.indicator.style.transform = `translate(-50%, -50%)`;
    this.indicator.style.overflow = `hidden`;
    this.indicator.style.cursor = "grab";

    //-----------------------------------------------------------------------------------------
    // 创建pointer节点
    this.pointer = document.createElement(`div`);
    this.indicator.insertBefore(this.pointer, this.indicator.children[0]);

    // 设置pointer基本属性
    this.pointer.className = `knob_indicator_pointer`;
    this.pointer.id = this.pointer.className + `_${knobName}`;

    // 设置pointer基本样式
    this.setPointerSize(0.35, 4);
    this.pointer.style.backgroundColor = `black`;
    this.pointer.style.position = `absolute`;
    this.pointer.style.left = `50%`;
    this.pointer.style.transformOrigin = `50% 100%`;
    this.pointer.style.transform = `translate(-50%, 0)`;

    //-----------------------------------------------------------------------------------------
    // 创建label节点
    this.label = document.createElement(`span`);
    this.indicator.insertAdjacentElement("afterend", this.label);

    // 设置label基本属性
    this.label.innerHTML = knobName;
    this.label.value = knobName;
    this.label.className = `knob_label`;
    this.label.id = this.label.className + `_${knobName}`;

    // 设置label尺寸与定位
    this.label.style.position = `absolute`;
    this.label.style.bottom = `-35%`;
    this.label.style.left = `50%`;
    this.label.style.transform = `translate(-50%, 0)`;

    // 设置label样式
    this.label.style.fontSize = `${this.width * 0.18}px`;
    this.label.style.backgroundColor = `pink`;

    //-----------------------------------------------------------------------------------------
    this.setValueRange(0, 1);
    this.setDefaultValue(0.25);
    this.setRotationRange(-135.0, 135.0);

    this.setIndicatorDeg(this.valueToDeg(this.defaultValue));

    //-----------------------------------------------------------------------------------------
    // 在构造函数中绑定方法，并保存为实例的属性
    this.mouseMoveOnIndicatorEventResponse = this.mouseMoveOnIndicatorEventResponse.bind(this);

    // 给indicator注册点击事件：为拖动事件设置监听器
    this.indicator.addEventListener('mousedown', e => {
      this.indicator.addEventListener('mousemove', this.mouseMoveOnIndicatorEventResponse);
    })

    // 给indicator注册释放事件：释放光标、移除拖动事件监听器
    this.indicator.addEventListener('mouseup', e => {
      document.exitPointerLock();
      this.indicator.removeEventListener('mousemove', this.mouseMoveOnIndicatorEventResponse);
    })

    // 给indicator注册键盘+点击事件：按住alt键单击恢复默认值
    this.indicator.addEventListener('click', e => {
      if (e.altKey) {
        this.setIndicatorDeg(this.valueToDeg(this.defaultValue));
      }
    })

    // 给indicator注册双击事件：手动输入值
    this.indicator.addEventListener('dblclick', e => {
      // 激活label可编辑状态
      this.label.setAttribute(`contenteditable`, true);
      // 获取光标
      this.label.focus();
      // 全选label
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(this.label);
      selection.removeAllRanges();
      selection.addRange(range);
      // 用户输入数字后按下回车或点击空白，检查数字合法性，将数字赋值给this.numer
    })

    // 屏蔽knob右键菜单
    this.knob.addEventListener('contextmenu', e => {
      e.preventDefault(); // 阻止默认的右键菜单弹出
    }, false);

    // 给indicator添加双击事件

    // 给knob添加鼠标移入事件：label显示当前值
    this.knob.addEventListener('mouseenter', () => {
      this.label.innerHTML = this.getCurrentValue().toFixed(3);
    })

    // 给knob添加鼠标移出事件：label显示控件名称
    this.knob.addEventListener('mouseleave', () => {
      this.label.innerHTML = knobName;
    })

    //-----------------------------------------------------------------------------------------
    return this.knob;
  }

  // 设置knob尺寸
  setKnobSize(width, height) {
    this.width = width;
    this.height = height;
    this.knob.style.width = `${this.width}px`;
    this.knob.style.height = `${this.height}px`;
  }

  setIndicatorSize(scale) {
    this.indicatorWidth = this.width * scale;
    this.indicatorHeight = this.height * scale;
    this.indicator.style.width = `${this.indicatorWidth}px`;
    this.indicator.style.height = `${this.indicatorHeight}px`;
  }

  // 设置pointer的长度与宽度（本函数同时设置了圆角）
  // heightRatio: pointer的长度相对于indicator的比例
  // width: pointer的宽度
  setPointerSize(heightRatio, width) {
    this.pointerWidth = width;
    this.pointerHeight = this.indicatorHeight * heightRatio;
    this.pointer.style.height = `${this.pointerHeight}px`;
    this.pointer.style.width = `${this.pointerWidth}px`;
    this.pointer.style.borderRadius = `${this.pointerWidth * 0.5}px`;
  }

  setValueRange(valueStart, valueEnd) {
    this.valueStart = valueStart;
    this.valueEnd = valueEnd;
  }

  // 初始化knob的真实有效角度。Chrome默认朝正上方为0°，向左为负，向右为正。）
  setRotationRange(degStart, degEnd) {
    this.indicatorStartDeg = degStart;
    this.indicatorEndDeg = degEnd;
  }

  setIndicatorDeg(targetDeg) {
    // 取目标角度
    this.currentIndicatorDeg = targetDeg % 360.0;
    // 根据目标角度更新indicator的样式
    this.indicator.style.transform = `translate(-50%, -50%) rotate(${targetDeg}deg)`;
  }

  mouseMoveOnIndicatorEventResponse(e) {
    // 固定鼠标并隐藏
    this.indicator.requestPointerLock();
    // 计算增量：indicator的增量与鼠标Y轴移动速度关联
    let nextDeg = this.currentIndicatorDeg + (-e.movementY) * 0.3;
    // 判断是否已达indicator的边界
    nextDeg = nextDeg <= this.indicatorStartDeg ? this.indicatorStartDeg : nextDeg;
    nextDeg = nextDeg >= this.indicatorEndDeg ? this.indicatorEndDeg : nextDeg;
    // 设置indicator的真实角度
    this.setIndicatorDeg(nextDeg);
    // 显示当前值
    this.label.innerHTML = this.getCurrentValue().toFixed(3);
  }

  setDefaultValue(value) {
    this.defaultValue = value;
  }

  getCurrentValue() {
    return this.degToValue(this.currentIndicatorDeg);
  }

  // indicator的角度转输出值
  valueToDeg(value) {
    const deltaX = this.valueEnd - this.valueStart;
    const deltaY = this.indicatorEndDeg - this.indicatorStartDeg;
    const slop = deltaY / deltaX;
    const bias = (this.valueEnd * this.indicatorStartDeg - this.valueStart * this.indicatorEndDeg) / deltaX;
    return (slop * value + bias);
  }

  // 输出值转indicator的角度
  degToValue(deg) {
    const deltaX = this.indicatorEndDeg - this.indicatorStartDeg;
    const deltaY = this.valueEnd - this.valueStart;
    const slop = deltaY / deltaX;
    const bias = (this.indicatorEndDeg * this.valueStart - this.indicatorStartDeg * this.valueEnd) / deltaX;
    return (slop * deg + bias);
  }
}