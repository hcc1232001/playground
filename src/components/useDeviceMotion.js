import React from 'react';
import {useState, useEffect} from 'react';


// https://www.raymondcamden.com/2017/04/25/using-device-motion-on-the-web
const UseDeviceMotion = (props) => {
  const [threshold, setThreshold] = useState(45);
  const [lastAccVec3, setLastAccVec3] = useState([null, null, null]);
  const [moveCounter, setMoveCounter] = useState(0);
  const [shakeCounter, setShakeCounter] = useState(0);
  useEffect(() => {
    if (props.threshold) {
      setThreshold(props.threshold);
    }
    return () => {

    }
  }, [])

  useEffect(() => {
    window.addEventListener('deviceorientation', onMotion, false);
    // console.log('addEventListener deviceorientation');
    return () => {
      window.removeEventListener('deviceorientation', onMotion, false);
      // console.log('removeEventListener deviceorientation');
    }
  }, [threshold, lastAccVec3])

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
  }, [moveCounter])

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
    setLastAccVec3([alpha, beta, gamma]);
  }

  // return <div>
  //   {lastAccVec3.map(v => v + ', ')}
  // </div>;

  // return shakeCounter;
  return <div />;
}

export default UseDeviceMotion;