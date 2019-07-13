import React from 'react';
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';
// import UseDeviceMotion from 'components/useDeviceMotion';
import QRCode from 'qrcode';

import './homePage.css';

const serverPath = 'https://socketio-testing.herokuapp.com';
const serverPort = 443;

const App = (props) => {
  const [socket, setSocket] = useState(null);
  const [playersInfo, setPlayersInfo] = useState([]);
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
        socket.emit('createRoom');
      });
      socket.on('playersInfo', (playersInfo) => {
        // setPlayerCount(count);
        console.log(playersInfo);
        // const playersInfo = [];
        for (let i = 0; i < playersInfo.length; i++) {
          const playerIdx = i;
          const playerInfo = playersInfo[playerIdx];
          QRCode.toDataURL(
            // 'https://hcc1232001.github.io/playground/#/' + playerInfo['playerId'],
            'http://10.0.1.111:3001/#/' + playerInfo['playerId'],
            {
              width: 300,
              color: {
                dark: '#000000FF',
                light: '#FFFFFFFF'
              }
            }
          )
          .then(url => {
            setPlayersInfo((prevPlayersInfo) => {
              const newPlayerInfo = [...prevPlayersInfo];
              newPlayerInfo[playerIdx] = {
                url: 'http://10.0.1.111:3001/#/' + playerInfo['playerId'],
                img: url
              };
              return newPlayerInfo;
            })
            // this.qrcodeImage[idx][platform].setAttribute('src', url);
          })
        }
      })
      socket.on('*', (msg) => {
        console.log(msg);
      })
    }
  }, [socket]);

  return <div className="page homePage">
    {/* display the box of the player recieved from server */}
    {playersInfo.map(playerInfo => {
      if (!playerInfo.joined) {
        return <div key={playerInfo['url']} className="player-block">
          <a href={playerInfo['url']} target="_blank">
            <img src={playerInfo['img']} />
          </a>
        </div>
      }
    })}
  </div>;
}

export default App;