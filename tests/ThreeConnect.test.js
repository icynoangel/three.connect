import * as THREE from 'three';
import ThreeConnect from './../src/ThreeConnect';

describe('ThreeConnect', function() {

  this.getInstance = () => {
    return new ThreeConnect(this.scene, this.canvas, this.camera);
  }

  beforeEach( () => {
    this.scene = {
      children: ['testChildrenitem']
    };
    this.canvas = {
      getBoundingClientRect: jest.fn( () => {
        return {
          left: 10,
          top: 100
        };
      }),
      style: {},
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };
    this.camera = {
      position: {
        'test': 'cameraPositionPropertiesObject'
      }
    };
    this.handler = jest.fn();
    this.event = {
      clientX: 100,
      clientY: 200
    };
  });

  it('Should initialize properties and enable events', () => {
    const enableSpy = jest.spyOn(ThreeConnect.prototype, 'enable');

    const tc = this.getInstance();

    expect(tc.width).toBe(0);
    expect(tc.height).toBe(0);
    expect(tc.handlers).toEqual({});

    expect(tc.scene).toEqual(this.scene);
    expect(tc.canvas).toEqual(this.canvas);
    expect(tc.camera).toEqual(this.camera);

    expect(enableSpy).toHaveBeenCalled();
  });

  it('Should set dimensions', () => {
    const tc = this.getInstance();
    tc.setSceneDimensions(600, 400);
    
    expect(tc.width).toEqual(600);
    expect(tc.height).toEqual(400);
  });

  it('Should validate item if mesh is an object with name property', () => {
    const tc = this.getInstance();
    const result = tc.validateItem({name: 'testMesh'});

    expect(result).toBe(true);
  });

  it('Should validate item if mesh is a non empty string', () => {
    const tc = this.getInstance();
    const result = tc.validateItem('testMesh');

    expect(result).toBe(true);
  });

  it('Should invalidate item if mesh is not an object nor a string', () => {
    const tc = this.getInstance();
    const result = tc.validateItem(null);

    expect(result).toBe(false);
  });

  it('Should invalidate item if mesh is an object but does not have name property', () => {
    const tc = this.getInstance();
    const result = tc.validateItem({});

    expect(result).toBe(false);
  });

  it('Should invalidate item if mesh is an empty string', () => {
    const tc = this.getInstance();
    const result = tc.validateItem('');

    expect(result).toBe(false);
  });

  it('Should validate callback if it is a function', () => {
    const tc = this.getInstance();
    const result = tc.validateCallback(this.handler);

    expect(result).toBe(true);
  });

  it('Should invalidate callback if it is not a function', () => {
    const tc = this.getInstance();
    const result = tc.validateCallback('');

    expect(result).toBe(false);
  });

  it('Should connect a mesh by receiving it as parameter', () => {
    const tc = this.getInstance();
    const result = tc.connect({name: 'testMesh'}, this.handler);
    
    expect(result).toBe(true);
    expect(tc.handlers['testMesh']).toEqual(this.handler);
  });

  it('Should connect a mesh by receiving its name as parameter', () => {
    const tc = this.getInstance();
    const result = tc.connect('testMesh', this.handler);
    
    expect(result).toBe(true);
    expect(tc.handlers['testMesh']).toEqual(this.handler);
  });

  it('Should not connect a mesh if validateItem fails', () => {
    const tc = this.getInstance();
    tc.validateItem = jest.fn( () => {
      return false;
    });
    const result = tc.connect('testMesh', this.handler);
    
    expect(result).toBe(false);
    expect(tc.handlers).toEqual({});
    expect(tc.validateItem).toHaveBeenCalledWith('testMesh');
  });

  it('Should not connect a mesh if validateCallback fails', () => {
    const tc = this.getInstance();
    tc.validateCallback = jest.fn( () => {
      return false;
    });
    const result = tc.connect('testMesh', this.handler);
    
    expect(result).toBe(false);
    expect(tc.handlers).toEqual({});
    expect(tc.validateCallback).toHaveBeenCalledWith(this.handler);
  });

  it('Should disconnect a mesh by receiving it as parameter', () => {
    const tc = this.getInstance();
    tc.handlers['testMesh'] = this.handler;

    const result = tc.disconnect({ name: 'testMesh'});
    
    expect(result).toBe(true);
    expect(tc.handlers).toEqual({});
  });    

  it('Should disconnect a mesh by receiving its name as parameter', () => {
    const tc = this.getInstance();
    tc.handlers['testMesh'] = this.handler;

    const result = tc.disconnect('testMesh');
    
    expect(result).toBe(true);
    expect(tc.handlers).toEqual({});
  });    

  it('Should not disconnect a mesh if validateItem fails', () => {
    const tc = this.getInstance();
    tc.handlers['testMesh'] = this.handler;
    tc.validateItem = jest.fn( () => {
      return false;
    });
    const result = tc.disconnect('testMesh');
    
    expect(result).toBe(false);
    expect(tc.handlers).toEqual({testMesh: this.handler});
    expect(tc.validateItem).toHaveBeenCalledWith('testMesh');
  });

  it('Should disconnect all', () => {
    const tc = this.getInstance();
    tc.handlers = {
      'testMesh': this.handler,
      'testMesh2': function() {}
    };

    tc.disconnectAll();

    expect(tc.handlers).toEqual({});
  });

  it('Should add event listeners on enable', () => {
    const tc = this.getInstance();

    expect(this.canvas.addEventListener).toHaveBeenCalledWith('click', tc.onMouseClick, false);
    expect(this.canvas.addEventListener).toHaveBeenCalledWith('mousemove', tc.onMouseMove, false);
  });

  it('Should remove event listeners on disabled', () => {
    const tc = this.getInstance();
    tc.disable();

    expect(this.canvas.removeEventListener).toHaveBeenCalledWith('click', tc.onMouseClick);
    expect(this.canvas.removeEventListener).toHaveBeenCalledWith('mousemove', tc.onMouseMove);
  });

  it('Should call getRaycasterObjectName onMouseMove', () => {
    const spy = jest.spyOn(ThreeConnect.prototype, 'getRaycasterObjectName');
    const tc = this.getInstance();
    tc.onMouseMove(this.event);

    expect(spy).toHaveBeenCalledWith(this.event);
  });

  it('Should call handler for item onMouseClick', () => {
    const tc = this.getInstance();
    tc.getRaycasterObjectName = jest.fn( () => {
      return 'testMesh';
    });
    tc.handlers['testMesh'] = this.handler;
    tc.onMouseClick(this.event);

    expect(tc.getRaycasterObjectName).toHaveBeenCalledWith(this.event);
    expect(this.handler).toHaveBeenCalled();
  });

  it('Should not call handler for item onMouseClick', () => {
    const tc = this.getInstance();
    tc.getRaycasterObjectName = jest.fn( () => {
      return null;
    });
    tc.handlers['testMesh'] = this.handler;
    tc.onMouseClick(this.event);

    expect(tc.getRaycasterObjectName).toHaveBeenCalledWith(this.event);
    expect(this.handler).not.toHaveBeenCalled();
  });

  it('Should return item name and change cursor style in getRaycasterObjectName', () => {
    const tc = this.getInstance();
    tc.handlers['testMesh'] = this.handler;
    const result = tc.getRaycasterObjectName(this.event);

    expect(result).toEqual('testMesh');
    expect(this.canvas.style.cursor).toEqual('pointer');
  });

  it('Should return null and change cursor style in getRaycasterObjectName', () => {
    const tc = this.getInstance();
    const result = tc.getRaycasterObjectName(this.event);

    expect(result).toEqual(null);
    expect(this.canvas.style.cursor).toEqual('inherit');
  });

  it('Should return position object', () => {
    const tc = this.getInstance();
    const pos = tc.getMousePos(this.event);

    expect(typeof pos === 'object').toBe(true);
    expect(typeof pos.x === 'number').toBe(true);
    expect(typeof pos.y === 'number').toBe(true);
    expect(typeof pos.z === 'number').toBe(true);
  });

});