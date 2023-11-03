class Knob {
  constructor(width = 100, height = 100, knobName) {
    //-----------------------------------------------------------------------------------------
    //创建knob节点
    this.knob = document.createElement(`div`);
    document.body.insertBefore(this.knob, document.body.children[0]);

    //设置knob基本属性
    this.knob.className = `knob`;
    this.knob.id = this.knob.className + `_${knobName}`;

    //设置knob基本样式
    this.setKnobSize(width, height);
    this.knob.style.borderRadius = `50%`;
    this.knob.style.border = `1px solid black`;
    this.knob.style.backgroundColor = `pink`;
    this.knob.style.position = `absolute`;

    //-----------------------------------------------------------------------------------------
    //创建indicator
    this.indicator = document.createElement(`div`);
    this.knob.insertBefore(this.indicator, this.knob.children[0]);

    //设置indicator基本属性
    this.indicator.className = `knob_indicator`;
    this.indicator.id = this.indicator.className + `_${knobName}`;

    //设置indicator基本样式
    this.setIndicatorSize(0.9);
    this.indicator.style.borderRadius = `50%`;
    this.indicator.style.backgroundColor = `skyblue`;
    this.indicator.style.position = `absolute`;
    this.indicator.style.left = `50%`;
    this.indicator.style.top = `50%`;
    this.indicator.style.transform = `translate(-50%, -50%)`;
    this.indicator.style.overflow = `hidden`;
    this.indicator.style.cursor = "grab";

    //-----------------------------------------------------------------------------------------
    //创建pointer和pointerCenter
    this.pointer = document.createElement(`div`);
    this.indicator.insertBefore(this.pointer, this.indicator.children[0]);
    this.pointerCenter = document.createElement(`div`);
    this.pointerCenter.title = `pointerCenter`;
    this.pointer.insertAdjacentElement("afterend", this.pointerCenter);

    // 设置pointer与pointerCenter的基本属性
    this.pointer.className = `knob_indicator_pointer`;
    this.pointer.id = this.pointer.className + `_${knobName}`;
    this.pointerCenter.className = `knob_indicator_pointerCenter`;
    this.pointer.id = this.pointer.className + `_${knobName}`;

    //设置pointer基本样式
    this.setPointerSize(4);
    this.pointer.style.backgroundColor = `black`;
    this.pointerCenter.style.backgroundColor = `black`;

    this.pointer.style.position = `absolute`;
    this.pointer.style.left = `50%`;
    this.pointer.style.transformOrigin = `50% 100%`;
    this.pointer.style.transform = `translate(-50%, 0)`;

    this.pointerCenter.style.borderRadius = `50%`;
    this.pointerCenter.style.position = `absolute`;
    this.pointerCenter.style.left = `50%`;
    this.pointerCenter.style.top = `50%`;
    this.pointerCenter.style.transform = `translate(-50%, -50%)`;

    //-----------------------------------------------------------------------------------------
    this.setValueRange(0.00, 1.00);
    this.setRotationRange(-135.0, 135.0);

    this.defaultDeg = 0.0;
    this.setIndicatorDeg(this.defaultDeg);

    //-----------------------------------------------------------------------------------------
    // 在构造函数中绑定方法，并保存为实例的属性
    this.mouseMoveOnIndicatorEventResponse = this.mouseMoveOnIndicatorEventResponse.bind(this);

    // 给indicator注册点击事件
    this.indicator.addEventListener('mousedown', e => {
      this.indicator.addEventListener('mousemove', this.mouseMoveOnIndicatorEventResponse);
    })

    // 给indicator注册释放事件
    this.indicator.addEventListener('mouseup', e => {
      document.exitPointerLock();
      this.indicator.removeEventListener('mousemove', this.mouseMoveOnIndicatorEventResponse);
    })

    // 给indicator注册双击事件
    this.indicator.addEventListener('dblclick', e => {
      console.log("db!")
      this.setIndicatorDeg(this.defaultDeg);
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

  setPointerSize(width) {
    const pointerHeight = this.indicatorHeight / 2;
    this.pointer.style.height = `${pointerHeight}px`;
    this.pointer.style.width = `${width}px`;
    this.pointerCenter.style.width = this.pointer.style.width;
    this.pointerCenter.style.height = this.pointer.style.width;
  }

  setValueRange(valueStart, valueEnd) {
    this.valueStart = valueStart;
    this.valueEnd = valueEnd;
  }

  // 初始化knob的真实有效角度。Chrome默认朝正上方为0°，向左为负，向右为正。）
  setRotationRange(degHead, degEnd) {
    this.indicatorHeadDeg = degHead;
    this.indicatorEndDeg = degEnd;
  }

  setIndicatorDeg(targetDeg) {
    this.currentIndicatorDeg = targetDeg % 360;
    this.indicator.style.transform = `translate(-50%, -50%) rotate(${targetDeg}deg)`;
  }

  mouseMoveOnIndicatorEventResponse(e) {
    this.indicator.requestPointerLock();
    let nextDeg = this.currentIndicatorDeg + (-e.movementY);
    nextDeg = nextDeg <= this.indicatorHeadDeg ? this.indicatorHeadDeg : nextDeg;
    nextDeg = nextDeg >= this.indicatorEndDeg ? this.indicatorEndDeg : nextDeg;
    this.setIndicatorDeg(nextDeg);
  }

  valueToDeg(value) {

  }
}