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

    this.setupRaycaster();
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
   * Connect an object (the object will respond to click and hover events)
   * @param  {object} object  threejs mesh instance
   * @param  {function} callback handler to execute on click
   */
  connect(object, callback) {
    if (typeof object !== 'object') {
      console.error('[three.connect] error - connect expects and object as the first parameter');
      return;
    }
    if (typeof object.name === "undefined") {
      console.error('[three.connect] error - connect expects object to have a name property');
      return;
    }
    if (typeof callback !== "function") {
      console.error('[three.connect] error - connect expects callback to be a function');
      return;
    }

    this.handlers[object.name] = callback;
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
  setupRaycaster() {
    this.canvas.addEventListener('click', this.onMouseClick, false);
    this.canvas.addEventListener('mousemove', this.onMouseMove, false);
  }

  /**
   * Cleanup event listeners
   */
  cleanup() {
    this.canvas.removeEventListener('click', this.onMouseClick);
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
  }
}

module.exports = ThreeConnect;