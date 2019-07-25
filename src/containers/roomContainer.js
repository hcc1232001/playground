import React from 'react';
import {useState, useEffect} from 'react';
import * as THREE from 'three';
import OrbitControls from 'utils/vendor/orbitControls';

import { EffectComposer } from 'utils/vendor/postprocessing/EffectComposer';
import { RenderPass } from 'utils/vendor/postprocessing/RenderPass';
import { SAOPass } from 'utils/vendor/postprocessing/SAOPass';

// import {FBXLoader} from 'utils/vendor/FBXLoader';

// import fbxUrl from 'media/models/Windows for Building department breaking.fbx';
// import fbxUrl from 'media/models/190717_frying pan animationA(2).fbx';
// import fbxUrl from 'media/models/190717_frying pan animationA_shake.fbx';

import fbxUrl from 'media/models/190715_CLP_game(8).fbx';
import UseDeviceMotion from 'components/useDeviceMotion';

const FBXLoader = require('three-fbxloader-offical');

const addShadowToChild = (object, scene) => {
  object.traverse( function ( child ) {
    if (object !== child) {
      addShadowToChild(child, scene);
    }
    // if ( child.isMesh ) {
      
      // child.need
    // }
    if (child.isPointLight) {
      // const lightHelper = new THREE.PointLightHelper( child, 10 );
      // scene.add(lightHelper);
      child.castShadow = false;
      child.intensity = 0.85;
    } else if (child.isDirectionalLight) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.shadow.mapSize.width = 2048;
      child.shadow.mapSize.height = 2048;
      child.shadow.camera.near = 0.5;    // default
      child.shadow.camera.far = 5000;     // default
      child.shadow.camera.left = -1000;
      child.shadow.camera.right = 1000;
      child.shadow.camera.bottom = -1000;
      child.shadow.camera.top = 1000;
      child.intensity = 0.3;
      const lightHelper = new THREE.DirectionalLightHelper( child, 10 );
      scene.add(lightHelper);
    } else {
      child.castShadow = true;
      child.receiveShadow = true;
    }
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
  const [animatePan, setAnimatePan] = useState(0);
  let containerEl = null;
  let animationFrame = null;

  const setContainerEl = (ref) => containerEl = ref;
  const initScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 50, containerEl.offsetWidth / containerEl.offsetHeight, 1, 1000 );
    camera.position.set(49, 274, -214);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    
    // const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    // light.position.set(50, 100, 100);
    // scene.add(light);

    const light = new THREE.AmbientLight(0xFFFFFF, 0.1);
    // light.position.set(50, 100, 100);
    scene.add(light);

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( containerEl.offsetWidth, containerEl.offsetHeight );
    renderer.setClearColor( 0xcccccc, 1 );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.needsUpdate = true;
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
    // let mixer = null;
    loader.load(fbxUrl, (object) => {
      // mixer = new THREE.AnimationMixer( object );
      // const action = mixer.clipAction( object.animations[ 0 ] );
      // action.loop = THREE.LoopOnce;
      // action.clampWhenFinished = true;
      // action.play();
      // object.traverse( function ( child ) {
      //   if ( child.isMesh ) {
      //     child.castShadow = true;
      //     child.receiveShadow = true;
      //   }
      // });
      addShadowToChild(object, scene);
      scene.add(object);

      
      // camera.lookAt(object);
      // setThreeObjects((prevThreeObjects) => {
      //   return {
      //     ...prevThreeObjects,
      //     mixer: mixer,
      //     action: action,
      //   }
      // })
    }, (item) => {
      // console.log( item, loaded, total );
      console.log(item.loaded / item.total * 100 + '%');
    }, (err) => {
      console.log(err);
    });
    
    // postprocessing sao
    // https://threejs.org/examples/jsm/postprocessing/EffectComposer.js
    const composer = new EffectComposer( renderer );
    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );
    const saoPass = new SAOPass( scene, camera, false, true );
    composer.addPass( saoPass );
    // debugger
    // default params for the saoPass
    saoPass.params.output = SAOPass.OUTPUT.Default;
    saoPass.params.saoBias = 0.5;
    saoPass.params.saoIntensity = 0.5;
    saoPass.params.saoScale = 200;
    saoPass.params.saoKernelRadius = 15;
    saoPass.params.saoMinResolution = 0;
    saoPass.params.saoBlur = true;
    saoPass.params.saoBlurRadius = 8;
    saoPass.params.saoBlurStdDev = 4;
    saoPass.params.saoBlurDepthCutoff = 0.01;

    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.needsUpdate = true;

    setThreeObjects({
      scene: scene,
      camera: camera,
      containerEl: containerEl,
      renderer: renderer,
      orbitControl: orbitControl,
      raycaster: raycaster,
      clock: clock,
      composer: composer,
    })
  }
  const update = () => {
    animationFrame = setTimeout(() => update(), 1000 / 30);
    // fix the animation step to 30fps
    // if (threeObjects.mixer && animatePan) {
    //   const delta = 1 / 30; //threeObjects.clock.getDelta();
    //   threeObjects.mixer.update(delta);
    //   setAnimatePan((prevAnimatePan) => {
    //     return prevAnimatePan - 1;
    //   });
    // }
    threeObjects.orbitControl.update();
    threeObjects.composer.render();
    // threeObjects.renderer.render( threeObjects.scene, threeObjects.camera );
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
    // console.log(threeObjects.mixer);
    return () => {
      if (animationFrame)
        // cancelAnimationFrame(animationFrame);
        clearTimeout(animationFrame);
    }
  }, [threeObjects, animatePan]);
  return <>
    <div ref={setContainerEl}
      className="threeCanvas"
      style={{
        height: '100vh',
      }}
    />
  </>;
}

export default App;