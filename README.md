### Light implementation for setting up click handlers on threejs objects

1. Sets up click handlers for objects in threejs
2. Handles mouseover events and changes cursor to pointer

### Usage example

```javascript

import ThreeConnect from 'three.connect';

// initialize ThreeConnect with scene, canvas and camera
const threeconnect = new ThreeConnect(scene, renderer.domElement, camera);

// set three.connect scene dimensions - this should be called everytime your scene changes its dimensions
threeconnect.setSceneDimensions(width, height); 

// create your mesh
const mesh = new THREE.SkinnedMesh(geometry, material);

// your mesh must have a name for three.connect to work
mesh.name = 'mesh name';

// create a function to handle click event
const handlerFunction = () => { 
  // handle click action
}

// connect your mesh for click events
threeconnect.connect(mesh, handlerFunction);

// OR

threeconnect.connect(mesh.name, handlerFunction);


// disable event listeners - handlers references are still kept
threeconnect.disable();

// enable event listeners
threeconnect.enable();

// disconnect a specific mesh
threeconnect.disconnect(mesh);

// OR

threeconnect.disconnect(mesh.name);

// disconect all registered meshes
threeconnect.disconnectAll();

```

Tested with three 0.89

Enjoy!
