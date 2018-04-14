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

// to remove events listeners
threeconnect.cleanup();

// to add back event listeners
threeconnect.setupRaycaster();

```

Tested with three 0.89

Enjoy!
