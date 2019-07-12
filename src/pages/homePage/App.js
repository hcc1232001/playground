import React from 'react';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';

const App = (props) => {
  const [socket, setSocket] = useState(null);
  const [playerCount, setPlayerCount] = useState(0);
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
      })
      socket.on('updatePlayerCount', (count) => {
        setPlayerCount(count);
      })
      socket.on('*', (msg) => {
        console.log(msg);
      })
    }
  }, [socket])
  return <div className="page homePage">
    This is Home Page. 
    <div onClick={() => {
      socket.emit('test', 'hello');
    }}>playerCount: {playerCount}</div>
    <pre>
    {JSON.stringify(props, null, '  ')}
    </pre>
  </div>
}

export default App;