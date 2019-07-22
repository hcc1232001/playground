import React from 'react';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';

import {serverPath, serverPort} from 'globals/config';

import UseDeviceMotion from 'components/useDeviceMotion';

const App = (props) => {
  const [socket, setSocket] = useState(null);
  // const [playersInfo, setPlayersInfo] = useState([]);
  // const [shakeCount, setShakeCount] = useState(0);

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
      });
      socket.on('joinRoomStatus', (msg) => {
        // display fail msg if cannot join any room
        console.log('joinRoom status: ', msg);
      });
      // TODO: need to wait a start game signal !!
      socket.on('gameStarted', (msg) => {
        // display start shake msg
        // and shake available now
      });
      socket.on('*', (msg) => {
        console.log(msg);
      })
    }
  }, [socket]);
  const onShake = (event) => {
    event.preventDefault();
    /* send signal to server */
    socket.emit('shake');
    // do some animation?
    console.log('shake');
  }
  return <div>
    <UseDeviceMotion onShake={onShake} />
    Join Game!
    {/* JSON.stringify(props) */}
    <br />
    <div onClick={onShake}>Shake it!</div>
  </div>;
}

export default App;