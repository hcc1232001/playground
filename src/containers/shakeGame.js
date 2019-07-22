import React from 'react';
import FBXViewer from 'pages/fbxViewer';
// import {useState, useEffect} from 'react';
// import io from 'socket.io-client';

// import {serverPath, serverPort} from 'globals/config';

const ShakeGame = (props) => {
  // const [socket, setSocket] = useState(null);
  // useEffect(() => {
  //   // const serverPath = 'http://localhost';
  //   // get the ip and port from ipc
  //   // const socket = io(window.location.origin);
  //   const serverUrl = `${serverPath}:${serverPort}`;
  //   const socket = io(serverUrl);
  //   setSocket(socket);
  //   return () => {

  //   }
  // }, []);
  
  // useEffect(()=>{
  //   // bindDeviceMotion({
  //   //   onShake: () => setShakeCounter((prevShakeCounter => {
  //   //       return prevShakeCounter + 1;
  //   //     }))
  //   // })
  //   // change to playing scene/ waiting scene base on user status
  //   socket.on('gameStarted', (msg) => {
  //   })
  // })
  // const init = () => {
  //   useDeviceMotion({
  //     onShake: () => setShakeCounter((prevShakeCounter => {
  //         return prevShakeCounter + 1;
  //       }))
  //   })
  // }

  return <div>
    Shaked {props.playerInfo.shakeCount} times.
    <FBXViewer shakeCount={props.playerInfo.shakeCount} />
  </div>;
}

export default ShakeGame;