import React from 'react';
import {generatePath} from 'react-router-dom';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';
import QRCode from 'qrcode';

import routes from 'globals/routes';

import {serverPath, serverPort} from 'globals/config';

import ShakeGame from 'containers/shakeGame';
import CreateGame from 'pages/createGame';

import './homePage.css';

// const serverPath = 'https://socketio-testing.herokuapp.com';
// const serverPort = 443;

const App = (props) => {
  const [socket, setSocket] = useState(null);
  const [playersInfo, setPlayersInfo] = useState([]);

  const panFbxPath = [
    'media/models/190717_frying pan animationA_shake.fbx',
    'media/models/190717_frying pan animationA_shake.fbx',
    'media/models/190717_frying pan animationA_shake.fbx',
  ]
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
        for (let i = 0; i < playersInfo.length; i++) {
          const playerIdx = i;
          const playerInfo = playersInfo[playerIdx];
          // const joinGamePath = window.location.origin + '/#' + routes.joinGame.replace(':userId', playerInfo['playerId']);
          const joinGamePath = window.location.origin + '/#' + generatePath(routes.joinGame, {userId: playerInfo['playerId']});
          QRCode.toDataURL(
            joinGamePath,
            {
              width: 300,
              color: {
                dark: '#000000FF',
                light: '#FFFFFFFF'
              },
              margin: 0,
            }
          )
          .then(url => {
            setPlayersInfo((prevPlayersInfo) => {
              const newPlayerInfo = [...prevPlayersInfo];
              newPlayerInfo[playerIdx] = {
                ...playerInfo,
                url: joinGamePath,
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
      if (playerInfo.joined) {
        return <div key={playerInfo['url']} className="player-block">
          {/* https://mathiasbynens.github.io/rel-noopener/ */}
          <a href={playerInfo['url']} target="_blank" rel="noopener noreferrer">
            <img src={playerInfo['img']} alt={`player QRcode`}/>
          </a>
        </div>;
      } else {
        return <div key={playerInfo['url']} className="player-block">
          Player joined!
          <ShakeGame playerInfo={playerInfo} />
        </div>;
      }
    })}
    {/* <CreateGame models={panFbxPath} /> */}
  </div>;
}

export default App;