import React from 'react';
import {useState, useEffect} from 'react';
import * as THREE from 'three';
import OrbitControls from 'utils/vendor/orbitControls';

import { EffectComposer } from 'utils/vendor/postprocessing/EffectComposer';
import { RenderPass } from 'utils/vendor/postprocessing/RenderPass';
import { SAOPass } from 'utils/vendor/postprocessing/SAOPass';

import fbxUrl from 'media/models/190715_CLP_game(8).fbx';

import meatUrl from 'media/textures/meat.png';
import mildMeatUrl from 'media/textures/mid_meat.png';
import welldoneMeatUrl from 'media/textures/welldone_meat.png';

import fpsRenderer from 'components/fpsRenderer';

import './kitchenViewer.css';

const FBXLoader = require('three-fbxloader-offical');

const addShadowToChild = (object, scene) => {
  let camera = null;
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
      // child.receiveShadow = true;
      child.shadow.mapSize.width = 512;
      child.shadow.mapSize.height = 512;
      child.shadow.camera.near = 0.5;    // default
      child.shadow.camera.far = 5000;     // default
      child.shadow.camera.left = -1000;
      child.shadow.camera.right = 1000;
      child.shadow.camera.bottom = -1000;
      child.shadow.camera.top = 1000;
      child.intensity = 0.3;
      // const lightHelper = new THREE.DirectionalLightHelper( child, 10 );
      // scene.add(lightHelper);
    } else if (child.isCamera) {
      camera = child;
    } else {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return camera;
}

const pansLoader = (roomLoaded) => {
  const loader = new FBXLoader();
  const pans = [
    [
      require('media/models/190717_frying pan animationA_shake.fbx'),
      require('media/models/190717_frying pan animationA_flip.fbx')
    ],
    [
      require('media/models/190717_frying pan animationB_shake.fbx'),
      require('media/models/190717_frying pan animationB_flip.fbx')
    ],
    [
      require('media/models/190717_frying pan animationC_shake.fbx'),
      require('media/models/190717_frying pan animationC_flip.fbx')
    ]
  ];
  // 3 pans, fbx specific
  const pansNameMapping = [
    {
      panName: 'frying_pan_A',
      tracksRename: {
        'Meat_A__Copy_.position': 'Meat_A.position',
        'Meat_A__Copy_.quaternion': 'Meat_A.quaternion',
        'frying_pan_A_2.position': 'frying_pan_A_2.position'
      }
    },
    {
      panName: 'frying_pan_B',
      tracksRename: {
        'Meat_B__Copy_.position': 'Meat_B.position',
        'Meat_B__Copy_.quaternion': 'Meat_B.quaternion',
        'frying_pan_B_2.position': 'frying_pan_B_2.position'
      }
    },
    {
      panName: 'frying_pan_C',
      tracksRename: {
        'Meat_C__Copy_.position': 'Meat_C.position',
        'Meat_C__Copy_.quaternion': 'Meat_C.quaternion',
        'frying_pan_C_2.position': 'frying_pan_C_2.position'
      }
    }
  ];  
  // const [progress, setProgress] = useState(0);
  // const [panLoaded, setPanLoaded] = useState([]);
  // const [panSteps, setPanSteps] = useState([]);
  // useEffect(() => {
  pans.forEach((pan, idx) => {
    const currentPan = pansNameMapping[idx];
    const panObject = roomLoaded.children.find(child => child.name === currentPan['panName']);
    loader.load(pan[0], (object) => {
      const mixer = new THREE.AnimationMixer( panObject );
      object.animations[ 0 ]["tracks"].forEach(track => {
        track['name'] = currentPan['tracksRename'][track['name']];
      })
      const action = mixer.clipAction( object.animations[ 0 ] );
      action.loop = THREE.LoopOnce;
      action.clampWhenFinished = true;
      // action.play();
      mixer.addEventListener('finished', () => {
        // setPanSteps((prevPanSteps) => {
        //   const newPanSteps = [...prevPanSteps];
        //   newPanSteps[idx] += 1;
        //   return newPanSteps;
        // })
      })
      // setPanLoaded((prevPanLoaded) => {
      //   const newPanLoaded = [...prevPanLoaded];
      //   newPanLoaded[idx] = {
      //     ...newPanLoaded[idx],
      //     actionShake: action,
      //     mixerShake: mixer
      //   }
      //   return newPanLoaded;
      // });
    }, (item) => {
      // console.log( item, loaded, total );
      console.log(item.loaded / item.total * 100 + '%');
      // setProgress((prevProgress) => {
      //   return prevProgress + item.loaded / item.total
      // })
    }, (err) => {
      console.log(err);
    });
    
    loader.load(pan[1], (object) => {
      const mixer = new THREE.AnimationMixer( panObject );
      // console.log(object.animations);
      object.animations[ 0 ]["tracks"][0]["name"] = "Meat_A.position";
      object.animations[ 0 ]["tracks"][1]["name"] = "Meat_A.quaternion";
      const action = mixer.clipAction( object.animations[ 0 ] );
      action.loop = THREE.LoopOnce;
      action.clampWhenFinished = true;
      // action.play();
      mixer.addEventListener('finished', () => {
        // setPanSteps((prevPanSteps) => {
        //   const newPanSteps = [...prevPanSteps];
        //   newPanSteps[idx] += 1;
        //   return newPanSteps;
        // })
      })
      // setPanLoaded((prevPanLoaded) => {
      //   const newPanLoaded = [...prevPanLoaded];
      //   newPanLoaded[idx] = {
      //     ...newPanLoaded[idx],
      //     actionFlip: action,
      //     mixerFlip: mixer
      //   }
      //   return newPanLoaded;
      // });
    }, (item) => {
      // console.log( item, loaded, total );
      console.log(item.loaded / item.total * 100 + '%');
      // setProgress((prevProgress) => {
      //   return prevProgress + item.loaded / item.total
      // })
    }, (err) => {
      console.log(err);
    });
  })
  // }, []);
  // useEffect(() => {
    // console.log(progress / pans.length);
  // }, [progress]);
  return ['return1','return2'];
}


const KitchenViewer = ({
  enableSAOPass = false
}) => {
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
  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);
  const [fpsTimer, setFpsTimer] = useState(Date.now());
  // const [test1, test2] = pansLoader(object);
  let containerEl = null;
  let animationFrame = null;
  const setContainerEl = (ref) => containerEl = ref;
  const initScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 36, containerEl.offsetWidth / containerEl.offsetHeight, 1, 1000 );
    // camera.position.set(49, 274, -214);
    // maybe use an animation clip to control the camera later
    camera.position.set(0, 240, -150);
    // camera.rotation.set(90, 0, 0);
    camera.lookAt(0, 0, 120);
    camera.useTarget = false;
    camera.updateProjectionMatrix();
    
    // const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    // light.position.set(50, 100, 100);
    // scene.add(light);

    // light.position.set(50, 100, 100);
    const light = new THREE.AmbientLight(0xFFFFFF, 0.1);
    scene.add(light);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( containerEl.offsetWidth, containerEl.offsetHeight );
    renderer.setClearColor( 0xcccccc, 1 );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.needsUpdate = true;
    containerEl.appendChild( renderer.domElement );

    // add control
    const orbitControl = new OrbitControls( camera, renderer.domElement );
    orbitControl.center.z = 120;

    const clock = new THREE.Clock();

    const loader = new FBXLoader();
    // let mixer = null;
    loader.load(fbxUrl, (object) => {
      addShadowToChild(object, scene);
      scene.add(object);
      setRoomLoaded(object);
      // turn the cooker face material to white
      const pansArray = object.children.filter((obj) => obj.name.startsWith("frying_pan_"));
      pansArray.forEach(panObj => {
        const cookerFace = panObj.children.find((panMesh) => panMesh.name.toLowerCase().startsWith('induction_cooker_') && panMesh.name.endsWith('2'));
        cookerFace.material.color = new THREE.Color(0xffffff);
      })
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
    let composer = null;
    if (enableSAOPass) {
      composer = new EffectComposer( renderer );
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
    }

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // THREE.BasicShadowMap = 0;
    // THREE.PCFShadowMap = 1;
    // THREE.PCFSoftShadowMap = 2;
    renderer.shadowMap.needsUpdate = true;

    // renderer.vr.enabled = true;
    setThreeObjects({
      scene: scene,
      camera: camera,
      containerEl: containerEl,
      renderer: renderer,
      orbitControl: orbitControl,
      // raycaster: raycaster,
      clock: clock,
      composer: composer,
    })
  }

  const loadPans = () => {
    
    const [testing1, testing2] = pansLoader(roomLoaded);
    console.log(testing1, testing2);
    
  }
  const update = () => {
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
    if (enableSAOPass && threeObjects.composer) {
      threeObjects.composer.render();
    } else {
      threeObjects.renderer.render( threeObjects.scene, threeObjects.camera );
    }
  };
  const onResize = () => {
    threeObjects.camera.aspect = threeObjects.containerEl.offsetWidth / threeObjects.containerEl.offsetHeight;
    threeObjects.camera.updateProjectionMatrix();
    threeObjects.renderer.setSize( threeObjects.containerEl.offsetWidth, threeObjects.containerEl.offsetHeight );
  }
  useEffect(() => {
    initScene();
  }, []);
  useEffect(() => {
    if (animationFrame)
      cancelAnimationFrame(animationFrame);
    if (threeObjects.scene) {
      animationFrame = requestAnimationFrame(update);
      // update();
    }
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    }
  }, [threeObjects, mixers]);

  useEffect(() => {
    if (roomLoaded) {
      loadPans();
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

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, [threeObjects])
  return <>
    <div ref={setContainerEl}
      className="threeCanvas"
    />
    <div className="qrcodeLayer" />
  </>;
}

export default KitchenViewer;
