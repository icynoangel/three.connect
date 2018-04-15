var THREE = require('three');

class ThreeConnect {

  /**
   * Initialize ThreeConnect
   * @param  {object} scene  threejs scene
   * @param  {object} canvas threejs renderer.domElement
   * @param  {object} camera threejs camera
   */
  constructor(scene, canvas, camera) {

    this.width = 0;
    this.height = 0;
    this.handlers = {};

    this.scene = scene;
    this.canvas = canvas;
    this.camera = camera;

    this.onMouseClick = this.onMouseClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    this.enable();
  }

  /**
   * Set scene dimensions - should be called whenever scene dimensions change
   * @param {number} width  scene width
   * @param {number} height scene height
   */
  setSceneDimensions(width, height) {
    this.width = width;
    this.height = height;
  }

  /**
   * Check if item is valid
   * @param  {any} item 
   * @return {bool}
   */
  validateItem(item) {
    if ( (typeof item !== 'object' && typeof item !== 'string') || item === null ) {
      console.error('[three.connect] error - connect expects and object or a string as the first parameter');
      return false;
    }
    if (typeof item === 'object' && typeof item.name === "undefined") {
      console.error('[three.connect] error - connect expects object to have a name property');
      return false;
    }
    if (typeof item === 'string' && item.length === 0) {
      console.error('[three.connect] error - connect expects name to not be empty');
      return false;
    }
    return true;
  }

  /**
   * Check if callback is valid
   * @param  {function} callback
   * @return {bool}
   */
  validateCallback(callback) {
    if (typeof callback !== "function") {
      console.error('[three.connect] error - connect expects callback to be a function');
      return false;
    }
    return true;
  }

  /**
   * Connect an object (the object will respond to click and hover events)
   * @param  {object || string} item  threejs mesh instance or mesh name
   * @param  {function} callback handler to execute on click
   * @return {bool} 
   */
  connect(item, callback) {
    if(!this.validateItem(item)){
      return false;
    }
    if(!this.validateCallback(callback)){
      return false;
    }

    const key = typeof item === 'object' ? item.name : item;
    
    this.handlers[key] = callback;
    return true;
  }

  /**
   * Disconnect a specific item - remove handler for it
   * @param  {object || string} item
   * @return {bool} 
   */
  disconnect(item) {
    if(!this.validateItem(item)){
      return false;
    }

    const key = typeof item === 'object' ? item.name : item;
    
    delete this.handlers[key]; 
    return true;
  }

  /**
   * Disconnect all - remove all handlers
   */
  disconnectAll() {
    this.handlers = {};
  }

  /**
   * Get mouse position
   * @param  {object} event mouse event
   * @return {object} mouse position in 3D space
   */
  getMousePos(event) {
    const rect = this.canvas.getBoundingClientRect();

    return {
      x: ( event.clientX - rect.left ) / this.width * 2 - 1,
      y: - ( event.clientY - rect.top ) / this.height  * 2 + 1,
      z: 0.5
    };
  }

  /**
   * Get first object name that has a handler attached and the raycaster intersects 
   * @param  {object} event mouse event
   * @return {string || null} name of the object or null
   */
  getRaycasterObjectName(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    const position = this.getMousePos(event);
    let mouse3D = new THREE.Vector3(position.x, position.y, position.z);

    mouse3D.unproject(this.camera);

    mouse3D.sub(this.camera.position);
    mouse3D.normalize();

    let raycaster = new THREE.Raycaster(this.camera.position, mouse3D);
                
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(this.scene.children, true);

    //console.log(_.map( intersects, (inter) => { return inter.object.name; } ) );

    // get first object
    if (intersects.length) {
      const objectName = intersects[0].object.name;
      
      if(this.handlers[objectName]) {
        this.canvas.style.cursor = 'pointer';
        return objectName;     
      }
    } 
    this.canvas.style.cursor = 'inherit';
    return null;
  }

  /**
   * Handle click event
   * @param  {object} event mouse event
   */
  onMouseClick(event) {
    const objectName = this.getRaycasterObjectName(event);

    if (objectName !== null) {
      this.handlers[objectName]();
    }
  }

  /**
   * Handle mousemove event
   * @param  {object} event mouse event
   */

  onMouseMove(event) {
    this.getRaycasterObjectName(event);
  }

  /**
   * Add event listeners
   */
  enable() {
    this.canvas.addEventListener('click', this.onMouseClick, false);
    this.canvas.addEventListener('mousemove', this.onMouseMove, false);
  }

  /**
   * Remove event listeners
   */
  disable() {
    this.canvas.removeEventListener('click', this.onMouseClick);
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
  }
}

module.exports = ThreeConnect;