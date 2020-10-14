import React from 'react';
import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import * as THREE from 'three';
import OrbitControls from 'utils/vendor/orbitControls';
// import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {OBJLoader as ObjectLoader} from 'three/examples/jsm/loaders/OBJLoader';

import './fbxViewer.css';
// import fbxUrl from 'media/models/Windows for Building department breaking.fbx';
// import fbxUrl from 'media/models/windows.fbx';
// import fbxUrl from 'media/models/190717_frying pan animationA(2).fbx';

// import fbxUrl from 'media/models/190715_CLP_game(7).fbx';

// const FBXLoader = require('three-fbxloader-offical');

const addShadowToChild = (object, scene) => {
  // let camera = null;
  // console.log(object.name);
  object.traverse( function ( child ) {
    // if (object !== child) {
    //   child.children.forEach((c) =>
    //     addShadowToChild(c, scene)
    //   )
    // }
    if (child.isMesh) { // && child.scale.x === 0 && child.scale.y === 0 && child.scale.z === 0) {
      // child.scale.x = 0.001;
      // child.scale.y = 0.001;
      // child.scale.z = 0.001;
      child.material.side = THREE.FrontSide;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  // return camera;
}

const addShadowToRobotArm = (object) => {
  object.traverse( function ( child ) {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = true;
    }
  })
}

const changeChildrenMaterialColor = (object, lvl = 0) => {
  // let camera = null;
  if (!["Robot_Hand_1", "Hand"].includes(object.name)) {
    object.children.forEach( function ( child ) {
      changeChildrenMaterialColor(child, lvl + 1);
    });
    if (object.isMesh) {
      object.material.color = new THREE.Color(0.9098039216, 0.062745098, 0.678431373);
    }
  }
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
  const [cameraPosition, setCameraPosition] = useState([0, 0, -10]);
  const { jsonName } = useParams();
  console.log(jsonName);
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
    // scene.background = new THREE.Color("transparent");
    const camera = new THREE.PerspectiveCamera( 50, containerEl.offsetWidth / containerEl.offsetHeight, 0.1, 10000 );
    // camera.position.set(500, 500, 250);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    
    // const pl100 = new THREE.PointLight(new THREE.Color(1,1,1), 1, 0, 0);
    // pl100.position.set(45.925, 16.159, -95.215);
    // pl100.castShadow = true;
    // scene.add(pl100);

    // const pl50c = new THREE.PointLight(new THREE.Color(1,1,1), 0.5, 0, 0);
    // pl50c.position.set(0, 171.974, -107.009);
    // pl50c.castShadow = true;
    // scene.add(pl50c);

    // const pl50b = new THREE.PointLight(new THREE.Color(1,1,1), 0.5, 0, 0);
    // pl50b.position.set(-139.051, 98.463, -73.829);
    // pl50b.castShadow = true;
    // scene.add(pl50b);

    // const pl50a = new THREE.PointLight(new THREE.Color(1,1,1), 0.5, 0, 0);
    // pl50a.position.set(49.707, 56.062, -29.082);
    // pl50a.castShadow = true;
    // scene.add(pl50a);

    const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( containerEl.offsetWidth, containerEl.offsetHeight );
    renderer.setClearColor( 0xcccccc, 0 );
    containerEl.appendChild( renderer.domElement );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // renderer.shadowMap.type = THREE.VSMShadowMap;

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

    const loader = new ObjectLoader();
    let mixer = null;
    loader.load(`./media/json/${jsonName}.json`, (object) => {
      mixer = new THREE.AnimationMixer( object );
      let action = null;
      if (object.animations.length) {
        action = mixer.clipAction( object.animations[ 0 ] );
        action.play();
      }
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
      } else {
        camera.position.set(
          cameraPosition[0],
          cameraPosition[1],
          cameraPosition[2]
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
          video.src = `./media/json/video${currentChar}.mp4`;
          const texture = new THREE.VideoTexture( video );
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.format = THREE.RGBFormat;
            videoElement.material.map = texture;
        }
      }
      addShadowToChild(object, scene);
      scene.add(object);
      // camera.lookAt(object);
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
    animationFrame = requestAnimationFrame(() => update());
    // animationFrame = setTimeout(() => update(), 1000 / 30);
    // fix the animation step to 30fps
    // const delta = 1 / 30; //threeObjects.clock.getDelta();
    const delta = threeObjects.clock.getDelta();
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
    debugger
    threeObjects.camera.lookAt(threeObjects.scene.children[0].children[0]);
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