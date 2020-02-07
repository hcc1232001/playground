import React from 'react';
import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import * as THREE from 'three';
import OrbitControls from 'utils/vendor/orbitControls';
// import {FBXLoader} from 'utils/vendor/FBXLoader';

import './fbxViewer.css';
// import fbxUrl from 'media/models/Windows for Building department breaking.fbx';
// import fbxUrl from 'media/models/windows.fbx';
// import fbxUrl from 'media/models/190717_frying pan animationA(2).fbx';

// import fbxUrl from 'media/models/190715_CLP_game(7).fbx';

const FBXLoader = require('three-fbxloader-offical');

const addShadowToChild = (object, scene) => {
  // let camera = null;
  // console.log(object.type);
  object.traverse( function ( child ) {
    if (object !== child) {
      addShadowToChild(child, scene);
    }
    if (child.isMesh && child.scale.x === 0 && child.scale.y === 0 && child.scale.z === 0) {
      child.scale.x = 0.001;
      child.scale.y = 0.001;
      child.scale.z = 0.001;
    }
    child.castShadow = true;
    child.receiveShadow = true;
  });
  // return camera;
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
  const [cameraPosition, setCameraPosition] = useState([0, 0, 0]);
  const { fbxName } = useParams();
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
    scene.background = new THREE.Color(0x404040);
    const camera = new THREE.PerspectiveCamera( 50, containerEl.offsetWidth / containerEl.offsetHeight, 0.1, 10000 );
    camera.position.set(500, 500, 250);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    
    // const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    // light.position.set(50, 100, 100);
    // scene.add(light);
    const al = new THREE.AmbientLight(0x404040);
    scene.add(al);
    const pl1 = new THREE.DirectionalLight(0xFFFFFF, 0.12, 0.5, 2);
    pl1.position.set(30.828, 9.431, 42.316);
    scene.add(pl1);
    const pl2 = new THREE.DirectionalLight(0xFFFFFF, 0.3, 0.5, 2);
    pl2.position.set(30.611, 4.849, -24.751);
    scene.add(pl2);
    const pl3 = new THREE.DirectionalLight(0xFFFFFF, 0.28, 0.5, 2);
    pl3.position.set(-30.237, 7.255, -48.423);
    scene.add(pl3);
    const pl4 = new THREE.DirectionalLight(0xFFFFFF, 0.22, 0.5, 2);
    pl4.position.set(-13.893, 10.843, 39.919);
    scene.add(pl4);

          
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.7);
    directionalLight.position.set(0, 100, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.5;    // default
    directionalLight.shadow.camera.far = 50000;
    directionalLight.shadow.camera.top = 2500;
    directionalLight.shadow.camera.bottom = -2500;
    directionalLight.shadow.camera.left = -2500;
    directionalLight.shadow.camera.right = 2500;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( containerEl.offsetWidth, containerEl.offsetHeight );
    renderer.setClearColor( 0xcccccc, 1 );
    containerEl.appendChild( renderer.domElement );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
    loader.load(`./media/fbx/${fbxName}.fbx`, (object) => {
      mixer = new THREE.AnimationMixer( object );
      let action = null;
      if (object.animations.length) {
        action = mixer.clipAction( object.animations[ 0 ] );
        action.play();
      }
      // action.loop = THREE.LoopOnce;
      // action.clampWhenFinished = true;
      // object.traverse( function ( child ) {
      //   if ( child.isMesh ) {
      //     child.castShadow = true;
      //     child.receiveShadow = true;
      //   }
      // });
      // debugger;
      const cameraOfFbx = object.getObjectByName('Camera');
      if (cameraOfFbx) {
        setCameraPosition([
          cameraOfFbx.position.x,
          cameraOfFbx.position.y,
          cameraOfFbx.position.z
        ]);
        camera.position.set(
          cameraOfFbx.position.x,
          cameraOfFbx.position.y,
          cameraOfFbx.position.z
        );
      }

      for (let i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
        const currentChar = String.fromCharCode(i);
        const videoElement = object.getObjectByName(`video${currentChar}`, true);
        if (videoElement) {
          const video = document.createElement('video');
          video.oncanplay = () => {
            video.play();
          }
          video.muted = true;
          video.loop = true;
          video.autoplay = true;
          video.src = `./media/fbx/video${currentChar}.mp4`;
          const texture = new THREE.VideoTexture( video );
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBFormat;
            videoElement.material.map = texture;
        }
      }
      addShadowToChild(object, scene);
      // object.scale.set(0.01, 0.01, 0.01);
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
    // const newCamPos = cameraPosition;
    // const oldCamPos = threeObjects.camera.position;
    // if (newCamPos[0] !== oldCamPos.x ||
    //   newCamPos[1] !== oldCamPos.y||
    //   newCamPos[2] !== oldCamPos.z) {
    //   oldCamPos.x = (newCamPos[0] - oldCamPos.x) * 0.15 + oldCamPos.x;
    //   oldCamPos.y = (newCamPos[1] - oldCamPos.y) * 0.15 + oldCamPos.y;
    //   oldCamPos.z = (newCamPos[2] - oldCamPos.z) * 0.15 + oldCamPos.z;
    // }
    threeObjects.orbitControl.update();
    threeObjects.renderer.render( threeObjects.scene, threeObjects.camera );
  };
  // const doCameraAnimation = () => {
  //   setCameraPosition((prevCameraPosition) => {
  //     return (prevCameraPosition + 1) % cameraDefaultPosition.length;
  //   });
  // };
  const onResize = () => {
    threeObjects.camera.aspect = threeObjects.containerEl.offsetWidth / threeObjects.containerEl.offsetHeight;
    threeObjects.camera.updateProjectionMatrix();
    threeObjects.renderer.setSize( threeObjects.containerEl.offsetWidth, threeObjects.containerEl.offsetHeight );
  }
  useEffect(() => {
    initScene();
  }, []);
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, [threeObjects])
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
  const backToInitialView = () => {
    threeObjects.orbitControl.reset();
    threeObjects.camera.position.set(
      cameraPosition[0],
      cameraPosition[1],
      cameraPosition[2]
    );
  }
  return <div ref={setContainerEl}
    // onClick={doCameraAnimation}
    className="threeCanvas"
    style={{
      height: '100vh',
    }}>
    <div className="hintsText">
      <ul>
        <li>Left button to rotate</li>
        <li>Wheel button to zoom</li>
        <li>Right button to pan</li>
      </ul>
      <div className="backToInitialView"
        onClick={backToInitialView}
      >
        Back to default view
      </div>
    </div>
  </div>;
}

export default App;