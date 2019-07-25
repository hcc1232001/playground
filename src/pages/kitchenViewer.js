import React from 'react';
import {useState, useEffect} from 'react';
import * as THREE from 'three';
import OrbitControls from 'utils/vendor/orbitControls';

import { EffectComposer } from 'utils/vendor/postprocessing/EffectComposer';
import { RenderPass } from 'utils/vendor/postprocessing/RenderPass';
import { SAOPass } from 'utils/vendor/postprocessing/SAOPass';

// import WEBVR from 'utils/vendor/WebVR';

// import {FBXLoader} from 'utils/vendor/FBXLoader';

// import fbxUrl from 'media/models/Windows for Building department breaking.fbx';
// import fbxUrl from 'media/models/190717_frying pan animationA(2).fbx';
// import fbxUrl from 'media/models/190717_frying pan animationA_shake.fbx';

import fbxUrl from 'media/models/190715_CLP_game(8).fbx';

import panShakeUrl from 'media/models/190717_frying pan animationA_shake.fbx';
import panFlipUrl from 'media/models/190717_frying pan animationA_flip.fbx';

import meatUrl from 'media/textures/meat.png';
import mildMeatUrl from 'media/textures/mid_meat.png';
import welldoneMeatUrl from 'media/textures/welldone_meat.png';

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
      child.shadow.mapSize.width = 512;
      child.shadow.mapSize.height = 512;
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
  const [mixers, setMixers] = useState([]);
  const [actions, setActions] = useState([]);
  const [playingSteps, setPlayingSteps] = useState(0);
  const [animatePan, setAnimatePan] = useState(0);
  const [roomLoaded, setRoomLoaded] = useState(null);
  const [textureLoaded, setTextureLoaded] = useState([]);
  let containerEl = null;
  let animationFrame = null;
  const setContainerEl = (ref) => containerEl = ref;
  const initScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 50, containerEl.offsetWidth / containerEl.offsetHeight, 1, 1000 );
    camera.position.set(49, 274, -214);
    // camera.rotation.set(-2.4434609527920594, 0.01, -3.1415926535897927);
    // camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    
    // const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    // light.position.set(50, 100, 100);
    // scene.add(light);

    // light.position.set(50, 100, 100);
    const light = new THREE.AmbientLight(0xFFFFFF, 0.1);
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
      setRoomLoaded(object);
      // console.log(object);
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
    
    const textureLoader = new THREE.TextureLoader();
    const meatTextures = [
      textureLoader.load(meatUrl),
      textureLoader.load(mildMeatUrl),
      textureLoader.load(welldoneMeatUrl)
    ];
    setTextureLoaded(meatTextures);

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

    // renderer.vr.enabled = true;
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

  const loadPan = () => {
    const loader = new FBXLoader();
    // console.log(roomLoaded);
    const panA = roomLoaded.children.find(child => child.name === "frying_pan_A");
    
    loader.load(panShakeUrl, (object) => {
      const mixer = new THREE.AnimationMixer( panA );
      object.animations[ 0 ]["tracks"][0]["name"] = "Meat_A.position";
      object.animations[ 0 ]["tracks"][1]["name"] = "Meat_A.quaternion";
      const action = mixer.clipAction( object.animations[ 0 ] );
      action.loop = THREE.LoopOnce;
      action.clampWhenFinished = true;
      action.play();
      mixer.addEventListener('finished', () => {
        setPlayingSteps((prevPlayingSteps) => {
          return prevPlayingSteps + 1;
        })
      })
      object.traverse( function ( child ) {
        if ( child.isMesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      // addShadowToChild(object, scene);
      // scene.add(object);
      setActions((prevActions) => {
        return [
          ...prevActions,
          action
        ]
      })
      setMixers((prevMixers) => {
        return [
          ...prevMixers,
          mixer
        ]
      })
      
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
    
    
    loader.load(panFlipUrl, (object) => {
      const mixer = new THREE.AnimationMixer( panA );
      // console.log(object.animations);
      object.animations[ 0 ]["tracks"][0]["name"] = "Meat_A.position";
      object.animations[ 0 ]["tracks"][1]["name"] = "Meat_A.quaternion";
      const action = mixer.clipAction( object.animations[ 0 ] );
      action.loop = THREE.LoopOnce;
      action.clampWhenFinished = true;
      // action.play();
      mixer.addEventListener('finished', () => {
        setPlayingSteps((prevPlayingSteps) => {
          return prevPlayingSteps + 1;
        })
      })
      object.traverse( function ( child ) {
        if ( child.isMesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      // addShadowToChild(object, scene);
      // scene.add(object);
      setActions((prevActions) => {
        return [
          ...prevActions,
          action
        ]
      })
      setMixers((prevMixers) => {
        return [
          ...prevMixers,
          mixer
        ]
      })
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
    
  }
  const update = () => {

    // animationFrame = threeObjects.renderer.setAnimationLoop(() => {
    //   if (mixers) {
    //     const delta = 1 / 30;
    //     mixers.forEach(mixer => mixer.update(delta));
    //   }
    //   // threeObjects.orbitControl.update();
    //   // mac seems too lag for the sao pass rendering
    //   // threeObjects.composer.render();
    //   threeObjects.renderer.render( threeObjects.scene, threeObjects.camera );
    // })
    // animationFrame = setTimeout(() => update(), 1000 / 30);
    animationFrame = requestAnimationFrame(update);
    if (mixers) {
      const delta = threeObjects.clock.getDelta();
      mixers.forEach(mixer => mixer.update(delta));
      // setAnimatePan((prevAnimatePan) => {
      //   return prevAnimatePan - 1;
      // });
    }
    threeObjects.orbitControl.update();
    // mac seems too lag for the sao pass rendering
    // threeObjects.composer.render();
    threeObjects.renderer.render( threeObjects.scene, threeObjects.camera );
  };
  useEffect(() => {
    initScene();
  }, []);
  useEffect(() => {
    if (animationFrame)
      cancelAnimationFrame(animationFrame);
      // clearTimeout(animationFrame);
    // console.log(threeObjects);
    if (threeObjects.scene) {
      // animationFrame = setTimeout(() => update(), 1000 / 30);//update();
      update();
    }
    // console.log(threeObjects.mixer);
    return () => {
      if (animationFrame)
        cancelAnimationFrame(animationFrame);
        // clearTimeout(animationFrame);
    }
  }, [threeObjects, mixers]);

  useEffect(() => {
    if (roomLoaded) {
      loadPan();
    }
  }, [roomLoaded])

  useEffect(() => {
    if (actions.length === 2 && playingSteps > 0) {
      if (playingSteps % 2 === 0) {
        actions[0].stop();
        actions[1].reset().play();
        const meat = roomLoaded.children
          .find(child => child.name === "frying_pan_A").children
          .find(child => child.name === "Meat_A");
        const meatStep = playingSteps % 6;
        if (meatStep === 2) {
          meat.material.map = textureLoaded[1];
        } else if (meatStep === 4) {
          meat.material.map = textureLoaded[2];
        } else if (meatStep === 0) {
          meat.material.map = textureLoaded[0];
        }
      } else {
        actions[1].stop();
        actions[0].reset().play();
      }
    }
  }, [playingSteps, actions])

  return <>
    {/* <UseDeviceMotion onShake={doPanAnimation} /> */}
    <div ref={setContainerEl}
      // onClick={doPanAnimation}
      className="threeCanvas"
      style={{
        height: '100vh',
      }}
    />
  </>;
}

export default App;
