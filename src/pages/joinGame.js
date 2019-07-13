import React from 'react';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';

import UseDeviceMotion from 'components/useDeviceMotion';

const serverPath = 'https://socketio-testing.herokuapp.com';
const serverPort = 443;

const App = (props) => {
  const [socket, setSocket] = useState(null);
  const [playersInfo, setPlayersInfo] = useState([]);
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
      socket.on('*', (msg) => {
        console.log(msg);
      })
    }
  }, [socket]);
  const onShake = () => {
    /* send signal to server */
    socket.emit('shake');
  }
  return <div>
    <UseDeviceMotion onShake={onShake} />
    Join Game!
    {/* JSON.stringify(props) */}
    <br />
    Shake it!
  </div>;
}

export default App;