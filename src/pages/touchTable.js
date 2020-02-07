import React, {useEffect, useState, useRef, useCallback} from 'react';

import Hammer from 'react-hammerjs';

import TouchTableInstance from 'components/touchTableInstance';

import clickSound from 'media/sound/click.mp3';

import './touchTable.css';

const TouchTable = () => {
  const [instances, setInstances] = useState([]);
  useEffect(() => {
    const audioInstance = new Audio(clickSound);
    const playClickSound = () => {
      audioInstance.play();
    }
    document.addEventListener('click', playClickSound);
    return () => {
      document.removeEventListener('click', playClickSound);
    }
  }, [])
  const createInstance = (event) => {
    if (event.target.classList.contains('touchTableFrame')) {
      setInstances((prevInstance) => {
        const removeNewInstance = () => {
          // remove itself
          removeInstance(newInstance);
        }
        const containerWidth = event.target.offsetWidth;
        const containerHeight = event.target.offsetHeight;
        let instanceRotated = 0;
        // rotation
        const rotateAngleX = Math.atan(16 / 9);
        const rotateAngleY = Math.PI / 2 - rotateAngleX;
        const rotatedPositionX = event.center.x * Math.cos(rotateAngleX) - event.center.y * Math.sin(rotateAngleX);
        const rotatedPositionY = (containerWidth / 2 - event.center.x) * Math.sin(rotateAngleY) + (containerHeight / 2 - event.center.y) * Math.cos(rotateAngleY);
        if (rotatedPositionX < 0) {
          if (rotatedPositionY < 0) {
            instanceRotated = 0;
          } else {
            instanceRotated = 90;
          }
        } else {
          if (rotatedPositionY < 0) {
            instanceRotated = -90;
          } else {
            instanceRotated = 180;
          }
        }
        /*
        // simple distance 
        const distL = event.center.x;
        const distR = containerWidth - event.center.x;
        const distT = event.center.y;
        const distB = containerHeight - event.center.y;
        const minDist = Math.min(distL, distR, distT, distB);
        console.log(distL, distR, distT, distB);
        switch (minDist) {
          case distL:
            instanceRotated = 90;
            break;
          case distR:
            instanceRotated = -90;
            break;
          case distT:
            instanceRotated = 180;
            break;
          case distB:
          default:
            instanceRotated = 0;
            break;
        }
        */
        const pointerX = event.center.x;
        const pointerY = event.center.y;
        let instanceWidth = 640;
        let instanceHeight = 360;
        let instanceX = pointerX - instanceWidth / 2;
        let instanceY = pointerY - instanceHeight / 2;
        // check boundary
        if (Math.abs(instanceRotated) === 90) {
          [instanceWidth, instanceHeight] = [instanceHeight, instanceWidth];
          if (instanceX < (instanceWidth - instanceHeight) / 2) {
            instanceX = (instanceWidth - instanceHeight) / 2;
          }
          if (instanceX + (instanceHeight + instanceWidth) / 2 > containerWidth) {
            instanceX = containerWidth - (instanceHeight + instanceWidth) / 2;
          }

          if (instanceY < (instanceHeight - instanceWidth) / 2) {
            instanceY = (instanceHeight - instanceWidth) / 2;
          }
          if (instanceY + (instanceWidth + instanceHeight) / 2 > containerHeight) {
            instanceY = containerHeight - (instanceWidth + instanceHeight) / 2;
          }
        } else {
          if (instanceX + instanceWidth > containerWidth) {
            instanceX = containerWidth - instanceWidth;
          }
          if (instanceX < 0) {
            instanceX = 0;
          }
          if (instanceY + instanceHeight > containerHeight) {
            instanceY = containerHeight - instanceHeight;
          }
          if (instanceY < 0) {
            instanceY = 0;
          }
        }
        const newInstance = <TouchTableInstance 
          key={Date.now()} 
          closeFunc={removeNewInstance} 
          currentXY={[instanceX, instanceY]}
          currentRotate={instanceRotated}
        />;
        return [...prevInstance, newInstance];
      })
    }
  }
  const removeInstance = (instance) => {
    setInstances((prevInstance) => {
      const instanceIndex = prevInstance.indexOf(instance);
      // console.log(instanceIndex);
      return prevInstance.slice(0, instanceIndex).concat(prevInstance.slice(instanceIndex+1)); // , <TouchTableInstance currentXY={[event.center.x - 250, event.center.y - 100]} />];
    })
  }
  return (
  <Hammer onPress={createInstance}>
    <div className="touchTableFrame" onMouseMove={(event) => {
      {/* console.log(event); */}
      {/* const rotateAngleX = Math.atan(16 / 9);
      const rotateAngleY = Math.PI / 2 - rotateAngleX;
      const rotatedPositionX = event.clientX * Math.cos(rotateAngleX) - event.clientY * Math.sin(rotateAngleX);
      const rotatedPositionY = (event.target.offsetWidth / 2 - event.clientX) * Math.sin(rotateAngleY) + (event.target.offsetHeight / 2 - event.clientY) * Math.cos(rotateAngleY);
      console.log(rotatedPositionX, rotatedPositionY);
      if (rotatedPositionX < 0) {
          if (rotatedPositionY < 0) {
            console.log(0,0);
          } else {
            console.log(0,1);
          }
        } else {
          if (rotatedPositionY < 0) {
            console.log(1,0);
          } else {
            console.log(1,1);
          }
        } */}
      }}
    >
      <div className="debugFrame rotation"></div>
      <div className="debugFrame distance"></div>
      {instances}
    </div>
  </Hammer>
  );
}

export default TouchTable;
