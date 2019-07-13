import React, {useState, useEffect} from 'react';

import UseDeviceMotion from 'components/useDeviceMotion';

const ShakeGame = (props) => {
  useEffect(()=>{
    // bindDeviceMotion({
    //   onShake: () => setShakeCounter((prevShakeCounter => {
    //       return prevShakeCounter + 1;
    //     }))
    // })
  })
  // const init = () => {
  //   useDeviceMotion({
  //     onShake: () => setShakeCounter((prevShakeCounter => {
  //         return prevShakeCounter + 1;
  //       }))
  //   })
  // }

  return <div>
    Shaked {props.playerInfo.shakeCount} times.
  </div>;
}

export default ShakeGame;