export default class component {
  /**
   * 
   * @param {HTMLDivElement} container - The container for the component.
   * @param {number} sizeRatio - The ratio of the component's size to the container's size.
   * @param {string} componentType - The type of component.
   * @param {string} componentName - The name of the component.
   * @param {boolean} devMode - Whether or not the component is in development mode.
   */
  constructor(container, sizeRatio = 1, componentType = 'component', componentName = 'newComponent', devMode = false) {
    this.domContainer = container;
    this.sizeRatio = sizeRatio;
    this.componentType = componentType;
    this.componentName = componentName;
    this.devMode = devMode;

    this.domContainer_init();
  }


  domContainer_init() {
    this.domContainer.style.width = '100%';
    this.domContainer.style.height = '100%';
    this.domContainer.style.position = 'relative';
    this.devMode ? this.domContainer.style.border = '1px solid red' : null;
  }


}