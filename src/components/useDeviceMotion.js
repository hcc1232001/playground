import React from 'react';
import {useState, useEffect, useCallback} from 'react';


// https://www.raymondcamden.com/2017/04/25/using-device-motion-on-the-web
const UseDeviceMotion = (props) => {
  const [threshold, setThreshold] = useState(45);
  // const [lastAccVec3, setLastAccVec3] = useState([null, null, null]);
  const [moveCounter, setMoveCounter] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  // const [shakeCounter, setShakeCounter] = useState(0);
  
  let lastAccVec3 = [null, null, null];
  const onMotion = (event) => {
    // event.alpha
    // event.beta
    // event.gamma
    const {alpha, beta, gamma} = event;
    //console.log('motion', acc);
    // if (lastAccVec3[0] === null) {
    //   setLastAccVec3([alpha, beta, gamma]);
    //   return;
    // }
    // dunno why there exist some wrong result
    //  - alpha, bata, gamma all zero randomly
    if (!(alpha && beta && gamma)) { return; }
    let deltaX = Math.abs(alpha - lastAccVec3[0]);
    let deltaY = Math.abs(beta - lastAccVec3[1]);
    let deltaZ = Math.abs(gamma - lastAccVec3[2]);
  
    if(deltaX + deltaY + deltaZ > threshold) {
      setMoveCounter((prevMoveCounter) => {
        return prevMoveCounter + 1;
      })
    } else {
      setMoveCounter((prevMoveCounter) => {
        return Math.max(0, prevMoveCounter - 1);
      })
    }
    // setLastAccVec3([alpha, beta, gamma]);
    lastAccVec3 = [alpha, beta, gamma];
  };
  useEffect(() => {
    if (props.threshold) {
      setThreshold(props.threshold);
    }
    return () => {

    }
  }, [props.threshold])

  useEffect(() => {
    if (permissionGranted) {
      window.addEventListener('deviceorientation', onMotion, false);
    }
    return () => {
      window.removeEventListener('deviceorientation', onMotion, false);
    }
  }, [permissionGranted])

  useEffect(() => {
    if(moveCounter > 2) {
      console.log('SHAKE!!!');
      // setShakeCounter((prevShakeCounter => {
      //   return prevShakeCounter + 1;
      // }));
      if (props.onShake && typeof(props.onShake) === 'function') {
        props.onShake();
      }
			setMoveCounter(0);
		}
  }, [moveCounter, props]);

  const requestDeviceOrientationPermission = () => {
    if (DeviceOrientationEvent.requestPermission) {
      // alert('DeviceOrientationEvent.requestPermission');
      DeviceOrientationEvent.requestPermission().then(response => {
          if (response == 'granted') {
            setPermissionGranted(true);
            // window.addEventListener('deviceorientation', onMotion, false);
            // window.addEventListener('deviceorientation', (e) => {
            //   // do something with e
            // })
          }
        })
        .catch(console.error);
    } else {
      setPermissionGranted(true);
      // alert('no DeviceOrientationEvent.requestPermission');
      // window.addEventListener('deviceorientation', onMotion, false);
    }
  }
  // return <div>
  //   {lastAccVec3.map(v => v + ', ')}
  // </div>;

  // return shakeCounter;
  return permissionGranted? 
    <></>:
    <div onClick={requestDeviceOrientationPermission}>Request Permission</div>;
}

export default UseDeviceMotion;