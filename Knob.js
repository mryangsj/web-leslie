  class Knob {
    constructor(width = 100, knobName = `New Knob`, valueStart = 0, valueEnd = 1, defaultValue = 0.5, numberDecimals = 3, suffix = `dB`, spritePath = `resources/KnobBig.png`, spriteLength = 257, degStart = -150, degEnd = 150) {
      //-----------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------
      this.widthFrame = width;
      this.heightFrame = this.widthFrame * 1.3;
      this.knobName = knobName;
      this.indicatorStartDeg = degStart;
      this.indicatorEndDeg = degEnd;
      this.valueStart = valueStart;
      this.valueEnd = valueEnd;
      this.defaultValue = defaultValue;
      this.numberDecimals = numberDecimals;
      this.suffix = suffix;
      this.spritePath = spritePath;
      this.spriteLength = spriteLength;
      this.isCursorOnIndicator = false;
      this.isCursorOnFrame = false;
      this.isMouseDownOnIndicator = false;
      this.isDragging = false;
      this.isEditing = false;
      this.nextDeg = 0;
      //-----------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------
      // 创建frame节点
      this.frame = document.createElement('div');
      document.body.insertBefore(this.frame, document.body.children[0]);
  
      // 设置frame基本属性
      this.frame.className = 'knob_frame';
      this.frame.id = this.frame.className + '_' + knobName;
  
      // 设置frame尺寸与定位
      this.frame.style.width = `${this.widthFrame}px`;
      this.frame.style.height = `${this.heightFrame}px`;
      this.frame.style.position = 'absolute';
  
      // 设置frame样式
      // this.frame.style.backgroundColor = `gray`;
  
      //-----------------------------------------------------------------------------------------
      // 创建knob节点
      this.knob = document.createElement('div');
      this.frame.appendChild(this.knob);
  
      // 设置knob基本属性
      this.knob.className = 'knob';
      this.knob.id = this.knob.className + '_' + knobName;
  
      // 设置knob尺寸与定位
      this.knob.style.width = `${this.widthFrame}px`;
      this.knob.style.height = `${this.widthFrame}px`;
      this.knob.style.boxSizing = 'border-box';
      this.knob.style.position = 'absolute';
      this.knob.style.top = '0';
      this.knob.style.left = '0';
  
      // 设置knob基本样式
      // this.knob.style.border = '1px solid black';
      // this.knob.style.backgroundColor = 'pink';
  
      //-----------------------------------------------------------------------------------------
      // 创建indicator
      this.indicator = document.createElement('div');
      this.knob.append(this.indicator);
  
      // 设置indicator基本属性
      this.indicator.className = 'knob_indicator';
      this.indicator.id = this.indicator.className + '_${knobName}';
  
      // 设置indicator尺寸与定位
      this.ratioIndicator = 1;
      this.widthIndicator = this.widthFrame * this.ratioIndicator;
      this.heightIndicator = this.widthFrame * this.ratioIndicator;
      this.indicator.style.width = `${this.widthIndicator}px`;
      this.indicator.style.height = `${this.heightIndicator}px`;
      this.indicator.style.boxSizing = 'border-box';
      this.indicator.style.position = 'absolute';
      this.indicator.style.left = '50%';
      this.indicator.style.top = '50%';
      this.indicator.style.transform = 'translate(-50%, -50%)';
  
      // 设置indicator基本样式
      this.indicator.style.overflow = 'default';
      this.indicator.style.background = `url(${this.spritePath})`;
      this.indicator.style.backgroundSize = '100% auto';
      
      

      //-----------------------------------------------------------------------------------------
      // 创建label节点
      this.label = document.createElement('div');
      this.frame.appendChild(this.label);
  
      // 设置label基本属性
      this.label.className = 'knob_label';
      this.label.id = this.label.className + '_' + `${knobName}`;
  
      // 设置label尺寸与定位
      this.label.style.width = `${this.widthFrame}px`;
      this.label.style.height = `${this.heightFrame - this.widthFrame}px`;
      this.label.style.position = 'absolute';
      this.label.style.bottom = '0';
      this.label.style.left = '50%';
      this.label.style.transform = 'translate(-50%, 0)';
  
      // 设置label样式
      // this.label.style.backgroundColor = `blue`;
  
      //-----------------------------------------------------------------------------------------
      // 创建label_text节点
      this.labelText = document.createElement('span');
      this.label.appendChild(this.labelText);
  
      // 设置label_text基本属性
      this.labelText.className = 'knob_label_text';
      this.labelText.id = this.labelText.className + '_' + `${knobName}`;
  
      // 设置label_text尺寸与定位
      this.labelText.style.width = 'auto';
      this.labelText.style.height = 'auto';
      this.labelText.style.position = 'absolute';
      this.labelText.style.bottom = '0';
      this.labelText.style.left = '50%';
      this.labelText.style.transform = 'translate(-50%, 0)';
  
      // 设置label样式
      this.setLabelShowName();
      this.labelText.style.fontSize = `${this.widthFrame * 0.2}px`;
      // this.labelText.style.backgroundColor = `pink`;
      document.body.style.cursor = 'default';
      this.labelText.style.userSelect = 'none';
      this.labelText.style.webkitUserSelect = 'none'; // for Safari
  
      //-----------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------
      // 通过默认值初始化
      this.setIndicatorFromValue(this.defaultValue);
  
      //-----------------------------------------------------------------------------------------
      // 给indicator注册鼠标移入事件
      this.indicator.addEventListener('mouseenter', e => {
        // 更新信号量
        this.isCursorOnIndicator = true;
        // 鼠标不在拖动状态时，鼠标样式为grab；在拖动状态时，鼠标样式为grabbing
        document.body.style.cursor = this.isDragging ? 'grabbing' : 'grab';
      });
  
      //-----------------------------------------------------------------------------------------
      // 给indicator注册鼠标移出事件
      this.indicator.addEventListener('mouseleave', e => {
        // 更新信号量
        this.isCursorOnIndicator = false;
        // 鼠标不在拖动状态时，鼠标样式恢复默认；在拖动状态时，鼠标样式为grabbing
        document.body.style.cursor = this.isDragging ? 'grabbing' : 'default';
      });
  
      //-----------------------------------------------------------------------------------------
      // 注册鼠标按下事件
      this.indicator.addEventListener('mousedown', e => {
        // 更新信号量
        this.isMouseDownOnIndicator = true;
        // 鼠标在indicator中时，鼠标样式为grabbing
        document.body.style.cursor = 'grabbing';
      });
  
      //-----------------------------------------------------------------------------------------
      // 注册鼠标移动事件
      document.addEventListener('mousemove', e => {
        // 鼠标拖动事件
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
          this.nextDeg = nextDeg;
          // 设置indicator的角度
          this.setIndicatorFromDeg(nextDeg);
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
      // 给indicator注册键盘+点击事件：按住alt键单击恢复默认值
      this.indicator.addEventListener('click', e => {
        if (e.altKey) this.setIndicatorFromValue(this.defaultValue);
      });
  
      //-----------------------------------------------------------------------------------------
      // 给frame注册双击事件：手动输入值
      this.frame.addEventListener('dblclick', e => {
        // 更新信号量
        this.isEditing = true;
        // 激活label可编辑状态
        this.labelText.setAttribute('contenteditable', true);
        // 去掉单位
        this.setLabelShowValue(false);
        // 获取光标并全选label
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(this.labelText);
        selection.removeAllRanges();
        selection.addRange(range);
      });
  
      //-----------------------------------------------------------------------------------------
      // 给label注册回车事件
      this.labelText.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          // 防止换行
          e.preventDefault();
          // 触发blur事件
          this.labelText.blur();
        }
      });
  
      //-----------------------------------------------------------------------------------------
      // 给label注册失焦事件
      this.labelText.addEventListener('blur', e => {
        // 更新信号量
        this.isEditing = false;
        // 根据输入数据调整indicator
        this.setIndicatorFromText(this.labelText.innerHTML);
        // 取消label可编辑状态
        this.labelText.setAttribute(`contenteditable`, false);
        // 更新label
        this.isCursorOnFrame ? this.setLabelShowValue() : this.setLabelShowName();
      })
  
      //-----------------------------------------------------------------------------------------
      // 屏蔽右键菜单
      this.frame.addEventListener('contextmenu', e => {
        e.preventDefault(); // 阻止默认的右键菜单弹出
      }, false);
  
      //-----------------------------------------------------------------------------------------
      // 给frame添加鼠标移入事件
      this.frame.addEventListener('mouseenter', () => {
        // 更新信号量
        this.isCursorOnFrame = true;
        // 当label不在编辑状态时，label显示当前值
        if (!this.isEditing) this.setLabelShowValue();
      })
  
      //-----------------------------------------------------------------------------------------
      // 给frame添加鼠标移出事件
      this.frame.addEventListener('mouseleave', () => {
        // 更新信号量
        this.isCursorOnFrame = false;
        // 当label不在编辑状态时，label显示控件名称
        if (!this.isEditing) {
          this.setLabelShowName();
          this.labelText.setAttribute(`contenteditable`, false);
        }
      })
  
      //-----------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------
      return this.frame;
    }
  
    //-----------------------------------------------------------------------------------------
    // 通过目标角度来旋转indicator
    setIndicatorFromDeg(targetDeg) {
      // 取目标角度
      this.currentIndicatorDeg = targetDeg % 360.0;
      // 更新当前值
      this.currentValue = this.degToValue(this.currentIndicatorDeg);
      // 根据目标角度更新indicator的样式（精灵图）
      this.indicator.style.backgroundPosition = `0 ${-this.getIndexSprite() * this.widthIndicator}px`;
    }
  
    //-----------------------------------------------------------------------------------------
    // 通过目标值来旋转indicator
    setIndicatorFromValue(targetValue) {
      // 更新当前值
      this.currentValue = targetValue;
      // 计算目标角度
      const targetDeg = this.valueToDeg(targetValue);
      // 更新当前角度
      this.currentIndicatorDeg = targetDeg % 360.0;
      // 根据目标角度更新indicator的样式（精灵图）
      this.indicator.style.backgroundPosition = `0 ${-this.getIndexSprite() * this.widthIndicator}px`;
    }
  
    //-----------------------------------------------------------------------------------------
    // 通过文本来设置indicator的角度
    setIndicatorFromText(inputText) {
      // 接收数字
      const targetNumber = parseFloat(inputText); // 尝试将输入转换为浮点数
      // 处理数字
      if (!isNaN(targetNumber) && targetNumber >= this.valueStart && targetNumber <= this.valueEnd) {
        this.setIndicatorFromValue(targetNumber);
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
      this.labelText.innerHTML = this.knobName;
    }
  
    //-----------------------------------------------------------------------------------------
    setLabelShowValue(withSuffix = true) {
      const targetText = withSuffix ? this.currentValue.toFixed(this.numberDecimals) + this.suffix : this.currentValue.toFixed(this.numberDecimals);
      this.labelText.innerHTML = targetText;
    }

    getNextDeg() {
      return this.nextDeg;
    }
  }
export default Knob;