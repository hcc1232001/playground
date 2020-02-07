import React from 'react';
import {generatePath} from 'react-router-dom';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';
import QRCode from 'qrcode';

import routes from 'globals/routes';

import {serverPath, serverPort} from 'globals/config';

import ShakeGame from 'containers/shakeGame';
import CreateGame from 'pages/createGame';

import KitchenViewer from 'pages/kitchenViewer';

import './homePage.css';

// const serverPath = 'https://socketio-testing.herokuapp.com';
// const serverPort = 443;

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
  const startGame = () => {
    socket.emit('startGame');
  }
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
          const joinGamePath = window.location.origin + window.location.pathname + '#' + generatePath(routes.joinGame, {userId: playerInfo['playerId']});
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
      socket.on('playerInfo', (playerInfo) => {
        console.log(playerInfo);
      })
    }
  }, [socket]);

  return <div className="page homePage">
    {/* display the box of the player recieved from server */}
    <div className="qrcodeLayer">
      {playersInfo.map(playerInfo => {
        return <div key={playerInfo['url']} className={`player-block ${playerInfo.joined? 'joined': 'waiting'}`}>
          {/* https://mathiasbynens.github.io/rel-noopener/ */}
          <div className="playerCard waiting">
            <a href={playerInfo['url']} target="_blank" rel="noopener noreferrer">
              <img src={playerInfo['img']} alt={`player QRcode`} className="playerQrcode" />
            </a>
          </div>
          <div className="playerCard joined">
            JOINED
            <div className="shakeCount"><big>{playerInfo.shakeCount}</big></div>
          </div>
        </div>;
      })}
    </div>
    {/* <KitchenViewer /> */}
    {/* <div className="startGameButton" onClick={startGame}>Start Game!</div> */}
  </div>;
}

export default App;