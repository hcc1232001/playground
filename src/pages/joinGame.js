import React from 'react';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';

import {serverPath, serverPort} from 'globals/config';

import UseDeviceMotion from 'components/useDeviceMotion';

const App = (props) => {
  const STATUS = Object.freeze({
    CONNECTING: 0, 
    IDLE: 1, 
    SHAKING: 2, 
    ENDGAME: 3,
    INVALID: 4, 
  });
  const [socket, setSocket] = useState(null);
  const [playersInfo, setPlayersInfo] = useState([]);
  // const [shakeCount, setShakeCount] = useState(0);
  const [statusDisplay, setStatusDisplay] = useState(STATUS.CONNECTING);
  let lastShakeTime = null;
  useEffect(() => {
    // const serverPath = 'http://localhost';
    // get the ip and port from ipc
    // const socket = io(window.location.origin);
    const serverUrl = `${serverPath}:${serverPort}`;
    const socket = io(serverUrl);
    setSocket(socket);
    return () => {

    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('connected !');
        socket.emit('joinRoom', props.match.match.params.userId);
        // wait join result msg from server
      })
      socket.on('playerStatus', (joinStatus) => {
        setStatusDisplay(STATUS[joinStatus.status]);
        // if (joinStatus.roomJoined) {
        //   setStatusDisplay(STATUS.IDLE);
        // } else {
        //   setStatusDisplay(STATUS.INVALID);
        // }
      });
      socket.on('*', (msg) => {
        console.log(msg);
      })
    }
  }, [socket]);
  const onShake = () => {
    /* send signal to server */
    socket.emit('shake');
    setStatusDisplay(STATUS.SHAKING);
    if (lastShakeTime) {
      clearTimeout(lastShakeTime);
    }
    lastShakeTime = setTimeout(() => {
      setStatusDisplay(STATUS.IDLE);
    },1000);
  }
  return <div>
    {(() => {
      switch (statusDisplay) {
        /* case STATUS.IDLE:
          return <div className="status statusIdle">
            Waiting for others players
          </div>;
        case STATUS.CONNECTING:
          return <div className="status statusConnecting">
            Connecting
          </div>; */
        case STATUS.IDLE:
        /* case STATUS.SHAKING: */
          return <div className="status statusShaking">
            <UseDeviceMotion onShake={onShake} />
            Keep Shaking
          </div>;
        case STATUS.INVALID:
          return <div className="status statusInvalid">
            Game not found, please scan the QR code again
          </div>;
        case STATUS.ENDGAME:
          return <div className="status statusGameend">
            Finished, thanks for playing.
          </div>;
      }
    })()}
  </div>;
}

export default App;