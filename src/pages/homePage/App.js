import React from 'react';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';
import UseDeviceMotion from 'components/useDeviceMotion';

const App = (props) => {
  const [socket, setSocket] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [isShake, setIsShake] = useState(false);
  let shakeDisplayTimer = null;
  useEffect(() => {
    // const serverPort = 8688;
    // const serverPath = 'http://localhost';
    const serverPath = 'https://socketio-testing.herokuapp.com';
    // get the ip and port from ipc
    // const socket = io(window.location.origin);
    const serverUrl = `${serverPath}`;//`:${serverPort}`;
    const socket = io(serverUrl);
    setSocket(socket);
    return () => {

    }
  }, [])
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('connected !');
        socket.emit('createRoom');
      })
      socket.on('updatePlayerCount', (count) => {
        setPlayerCount(count);
      })
      socket.on('*', (msg) => {
        console.log(msg);
      })
    }
  }, [socket])
  const onShake = () => {
    if (shakeDisplayTimer) {
      clearTimeout(shakeDisplayTimer);
    }
    setIsShake(true);
    shakeDisplayTimer = setTimeout(() => {
      setIsShake(false);
    }, 1000);
  }
  return <div className="page homePage">
    <UseDeviceMotion onShake={onShake} />
    This is Home Page. 
    <div>{isShake? 'shake': 'nothing'}</div>
    <div onClick={() => {
      socket.emit('test', 'hello');
    }}>playerCount: {playerCount}</div>
    <pre>
    {/* JSON.stringify(props, null, '  ') */}
    </pre>
  </div>
}

export default App;