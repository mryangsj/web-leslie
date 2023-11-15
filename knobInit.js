import Knob from './js/knob.js';

// 创建Knob对象（对象创建后，会在内部直接创建相应的dom对象）
const knobLeftObj = new Knob(80, 'Left', 0, 1, 0.5, 3, 'dB');
// 获取Knob对象的dom（该dom可直接等价于query...家族函数获取到的结果）
const knobLeft = knobLeftObj.dom;

// 同上，这里我们一共创建了两个Knob对象
const knobRightObj = new Knob(80, 'Right', 0, 1, 0.5, 3, 'dB');
const knobRight = knobRightObj.dom;

// 获取到的dom对象实际上已经封装到一个div中了，可以直接使用knobLeft或者knobRight来操作
// 通过class修改属性
knobLeft.classList.add('knobLeft');

// 通过style修改属性
knobRight.style.position = 'relative';
knobRight.style.top = '50%';
knobRight.style.left = '30%';
knobRight.style.transform = 'translate(-50%, -50%)';