import React from 'react';
import {useState, useEffect} from 'react';
import * as THREE from 'three';
import OrbitControls from 'utils/vendor/orbitControls';
// import {FBXLoader} from 'utils/vendor/FBXLoader';

import fbxUrl from 'media/models/Windows for Building department breaking.fbx';
// import fbxUrl from 'media/models/190717_frying pan animationA(2).fbx';

// import fbxUrl from 'media/models/190715_CLP_game(7).fbx';

const FBXLoader = require('three-fbxloader-offical');

const addShadowToChild = (object, scene) => {
  object.traverse( function ( child ) {
    if (object !== child) {
      addShadowToChild(child, scene);
    }
    if (child.isMesh && child.scale.x === 0 && child.scale.y === 0 && child.scale.z === 0) {
      child.scale.x = 0.001;
      child.scale.y = 0.001;
      child.scale.z = 0.001;
      console.log(child.name);
    }
    child.castShadow = true;
    child.receiveShadow = true;
  });
}
const App = (props) => {
  const [threeObjects, setThreeObjects] = useState({
    scene: null,
    camera: null,
    containerEl: null,
    renderer: null,
    orbitControl: null,
    raycaster: null,
    clock: null,
    mixer: null,
  });
  const [cameraPosition, setCameraPosition] = useState(0);
  let containerEl = null;
  let animationFrame = null;
  const cameraDefaultPosition = [
    [500, 500, 250],
    [500, 500, -250],
    [500, -500, -250],
    [500, -500, 250],
  ]
  const setContainerEl = (ref) => containerEl = ref;
  const initScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 50, containerEl.offsetWidth / containerEl.offsetHeight, 1, 1000 );
    camera.position.set(500, 500, 250);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(50, 100, 100);
    scene.add(light);

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( containerEl.offsetWidth, containerEl.offsetHeight );
    renderer.setClearColor( 0xcccccc, 1 );
    containerEl.appendChild( renderer.domElement );

    // add control
    const orbitControl = new OrbitControls( camera, renderer.domElement );
    // dampling
    // orbitControl.enableDamping = true;
    // orbitControl.dampingFactor = 0.05;
    // // to cancel out the super fast rotation after enabled damping
    // // orbitControl.enableRotate = false;
    // orbitControl.rotateSpeed = 0.02;
    // orbitControl.autoRotateSpeed = 0.05;
    
    /**
     * limit the vertical rotation
     * https://stackoverflow.com/questions/25308943/limit-orbitcontrols-horizontal-rotation/25311658#25311658
     **/ 
    // How far you can orbit vertically, upper and lower limits.
    // Range is 0 to Math.PI radians
    // orbitControl.minPolarAngle = Math.PI / 8;
    // orbitControl.maxPolarAngle = Math.PI * 3 / 8;
    // // How far you can orbit horizontally, upper and lower limits.
    // // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
    // orbitControl.minAzimuthAngle = Math.PI / 4;
    // orbitControl.maxAzimuthAngle = Math.PI / 4; 
    
    // // to disable zoom
    // orbitControl.enableZoom = false;
    // orbitControl.minDistance = 5;
    // orbitControl.maxDistance = 5;
    // to disable rotation
    // orbitControl.enableRotate = false;
    // to disable pan
    // orbitControl.enablePan = false;
    // orbitControl.panSpeed = 0.05;
    // raycaster
    const raycaster = new THREE.Raycaster(camera.position, new THREE.Vector3(0, 0, 0), 0, orbitControl.maxDistance * 2);

    const clock = new THREE.Clock();

    const loader = new FBXLoader();
    let mixer = null;
    loader.load(fbxUrl, (object) => {
      mixer = new THREE.AnimationMixer( object );
      const action = mixer.clipAction( object.animations[ 0 ] );
      // action.loop = THREE.LoopOnce;
      // action.clampWhenFinished = true;
      action.play();
      // object.traverse( function ( child ) {
      //   if ( child.isMesh ) {
      //     child.castShadow = true;
      //     child.receiveShadow = true;
      //   }
      // });
      addShadowToChild(object, scene);

      scene.add(object);
      camera.lookAt(object);
      setThreeObjects((prevThreeObjects) => {
        return {
          ...prevThreeObjects,
          mixer: mixer,
          action: action,
        }
      })
    }, (item) => {
      // console.log( item, loaded, total );
      console.log(item.loaded / item.total * 100 + '%');
    }, (err) => {
      console.log(err);
    });
    
    setThreeObjects({
      scene: scene,
      camera: camera,
      containerEl: containerEl,
      renderer: renderer,
      orbitControl: orbitControl,
      raycaster: raycaster,
      clock: clock,
    })
  }
  const update = () => {
    animationFrame = setTimeout(() => update(), 1000 / 30);
    // fix the animation step to 30fps
    const delta = 1 / 30; //threeObjects.clock.getDelta();
    if (threeObjects.mixer) {
      threeObjects.mixer.update(delta);
    }
    // try move camera to new position
    const newCamPos = cameraDefaultPosition[cameraPosition];
    const oldCamPos = threeObjects.camera.position;
    if (newCamPos[0] !== oldCamPos.x ||
      newCamPos[1] !== oldCamPos.y||
      newCamPos[2] !== oldCamPos.z) {
      oldCamPos.x = (newCamPos[0] - oldCamPos.x) * 0.1 + oldCamPos.x;
      oldCamPos.y = (newCamPos[1] - oldCamPos.y) * 0.1 + oldCamPos.y;
      oldCamPos.z = (newCamPos[2] - oldCamPos.z) * 0.1 + oldCamPos.z;
    }
    threeObjects.orbitControl.update();
    threeObjects.renderer.render( threeObjects.scene, threeObjects.camera );
  };
  const doCameraAnimation = () => {
    setCameraPosition((prevCameraPosition) => {
      return (prevCameraPosition + 1) % cameraDefaultPosition.length;
    });
  };
  useEffect(() => {
    initScene();
  }, []);
  useEffect(() => {
    if (animationFrame)
      // cancelAnimationFrame(animationFrame);
      clearTimeout(animationFrame);
    // console.log(threeObjects);
    if (threeObjects.scene) {
      animationFrame = setTimeout(() => update(), 1000 / 30);//update();
    }
    return () => {
      if (animationFrame)
        // cancelAnimationFrame(animationFrame);
        clearTimeout(animationFrame);
    }
  }, [threeObjects, cameraPosition]);
  return <div ref={setContainerEl}
    onClick={doCameraAnimation}
    className="threeCanvas"
    style={{
      height: '100vh',
    }}>
  </div>;
}

export default App;