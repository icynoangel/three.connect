'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var THREE = require('three');

var ThreeConnect = function () {

  /**
   * Initialize ThreeConnect
   * @param  {object} scene  threejs scene
   * @param  {object} canvas threejs renderer.domElement
   * @param  {object} camera threejs camera
   */
  function ThreeConnect(scene, canvas, camera) {
    _classCallCheck(this, ThreeConnect);

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


  _createClass(ThreeConnect, [{
    key: 'setSceneDimensions',
    value: function setSceneDimensions(width, height) {
      this.width = width;
      this.height = height;
    }

    /**
     * Connect an object (the object will respond to click and hover events)
     * @param  {object || string} item  threejs mesh instance or mesh name
     * @param  {function} callback handler to execute on click
     */

  }, {
    key: 'connect',
    value: function connect(item, callback) {
      if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) !== 'object' && typeof item !== 'string') {
        console.error('[three.connect] error - connect expects and object or a string as the first parameter');
        return;
      }
      if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && typeof item.name === "undefined") {
        console.error('[three.connect] error - connect expects object to have a name property');
        return;
      }
      if (typeof callback !== "function") {
        console.error('[three.connect] error - connect expects callback to be a function');
        return;
      }

      var key = (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' ? item.name : item;

      this.handlers[key] = callback;
    }

    /**
     * Disconnect a specific item - remove handler for it
     * @param  {object || string} item 
     */

  }, {
    key: 'disconnect',
    value: function disconnect(item) {
      if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) !== 'object' && typeof item !== 'string') {
        console.error('[three.connect] error - disconnect expects and object or a string as parameter');
        return;
      }

      var key = (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' ? item.name : item;

      delete this.handlers[key];
    }

    /**
     * Disconnect all - remove all handlers
     */

  }, {
    key: 'disconnectAll',
    value: function disconnectAll() {
      this.handlers = {};
    }

    /**
     * Get mouse position
     * @param  {object} event mouse event
     * @return {object} mouse position in 3D space
     */

  }, {
    key: 'getMousePos',
    value: function getMousePos(event) {
      var rect = this.canvas.getBoundingClientRect();

      return {
        x: (event.clientX - rect.left) / this.width * 2 - 1,
        y: -(event.clientY - rect.top) / this.height * 2 + 1,
        z: 0.5
      };
    }

    /**
     * Get first object name that has a handler attached and the raycaster intersects 
     * @param  {object} event mouse event
     * @return {string || null} name of the object or null
     */

  }, {
    key: 'getRaycasterObjectName',
    value: function getRaycasterObjectName(event) {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      var position = this.getMousePos(event);
      var mouse3D = new THREE.Vector3(position.x, position.y, position.z);

      mouse3D.unproject(this.camera);

      mouse3D.sub(this.camera.position);
      mouse3D.normalize();

      var raycaster = new THREE.Raycaster(this.camera.position, mouse3D);

      // calculate objects intersecting the picking ray
      var intersects = raycaster.intersectObjects(this.scene.children, true);

      //console.log(_.map( intersects, (inter) => { return inter.object.name; } ) );

      // get first object
      if (intersects.length) {
        var objectName = intersects[0].object.name;

        if (this.handlers[objectName]) {
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

  }, {
    key: 'onMouseClick',
    value: function onMouseClick(event) {
      var objectName = this.getRaycasterObjectName(event);

      if (objectName !== null) {
        this.handlers[objectName]();
      }
    }

    /**
     * Handle mousemove event
     * @param  {object} event mouse event
     */

  }, {
    key: 'onMouseMove',
    value: function onMouseMove(event) {
      this.getRaycasterObjectName(event);
    }

    /**
     * Add event listeners
     */

  }, {
    key: 'enable',
    value: function enable() {
      this.canvas.addEventListener('click', this.onMouseClick, false);
      this.canvas.addEventListener('mousemove', this.onMouseMove, false);
    }

    /**
     * Remove event listeners
     */

  }, {
    key: 'disable',
    value: function disable() {
      this.canvas.removeEventListener('click', this.onMouseClick);
      this.canvas.removeEventListener('mousemove', this.onMouseMove);
    }
  }]);

  return ThreeConnect;
}();

module.exports = ThreeConnect;
