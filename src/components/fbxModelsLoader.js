// import React from 'react';
import * as THREE from 'three';
const FBXLoader = require('three-fbxloader-offical');

const fbxModelsLoader = (modelsUrlArray) => {
  const loader = new FBXLoader();
  let mixer = null;
  let modelLoadingArray = [];
  modelsUrlArray.forEach((modelUrl, idx) => {
    modelLoadingArray.push(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          loader.load(modelUrl, (object) => {
            mixer = new THREE.AnimationMixer( object );
            const action = mixer.clipAction( object.animations[ 0 ] );
            action.loop = THREE.LoopOnce;
            action.clampWhenFinished = true;
            // action.play();
            object.traverse(child => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            resolve({
              object: object,
              mixer: mixer,
              action: action,
            });

          }, (item) => {
            // console.log( item, loaded, total );
            console.log(item.loaded / item.total * 100 + '%');
          }, (err) => {
            console.log(err);
            reject(err);
          });
        }, idx * 1000)
        // resolve("foo");
      })
    )
  })
  // const values = Promise.all(modelLoadingArray).then(values => { 
  //   return values;
  // })
  // return values;
  return Promise.all(modelLoadingArray);
  // return [];
}

export default fbxModelsLoader;