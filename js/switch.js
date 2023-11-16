export default class Switch {
  constructor(width = 100, switchLabel = 'New Switch', devMode = true) {
    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    this.ratioSizeDom = 1;
    this.widthDom = width;
    this.heightDom = this.widthDom * this.ratioSizeDom;
    this.toggle = false;

    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 创建dom文档节点
    this.dom = document.createElement('div');
    document.body.insertBefore(this.dom, document.body.firstChild);

    // 设置dom基本属性
    this.dom.classList.add('switch');
    this.dom.id = this.dom.className + '-' + switchLabel;

    // 设置dom尺寸、布局、定位
    this.dom.style.width = this.widthDom + 'px';
    this.dom.style.height = this.heightDom + 'px';
    // this.dom.style.position = 'relative';

    // 设置dom样式
    devMode ? this.dom.style.backgroundColor = 'pink' : null;
    devMode ? this.dom.style.border = '1px solid black' : null;

    //-----------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------
    // 创建indicatorBox节点
    this.domIndicatorBox = document.createElement('div');
    this.dom.appendChild(this.domIndicatorBox);

    // 设置indicatorBox基本属性
    this.domIndicatorBox.className = 'indicator-box';
    this.domIndicatorBox.id = this.domIndicatorBox.className + '-' + switchLabel;
  }
}