import React from 'react';
import {useEffect, useState, useCallback} from 'react';

import fbxModelsLoader from 'components/fbxModelsLoader';

const CreateGame = (props) => {
  /**
   * createGame
   *   - load kitchen and 3 hobs models
   *   - connect to server and get the N-players uuid
   *   - generate and display the qrcode base on the players uuid
   *   - hidden buttons? (immediate start / restart / end game)
   *   - wait the player scan the qrcode
   *     - player joined (1 - N), start count down
   * 
   * startGame
   *   - user shake and the correspond hob play the animation
   *     - if no one finish the shake, the total game time is 20secs
   *     - if a user finish the shake, other players count down 5secs
   *   - for 20% progress, add a popup
   * 
   * endGame
   *   - show the result
   *   - auto restart after ? secs (or staff click?)
   * 
   * */
  const [loadedModels, setLoadedModels] = useState([]);
  const fbxModels = [
    require('media/models/190717_frying pan animationA_shake.fbx'),
    require('media/models/190717_frying pan animationA_shake.fbx'),
    require('media/models/190717_frying pan animationA_shake.fbx'),
  ];
  useEffect(() => {
    // page load
    loadModels();
    return () => {
      // page unload

    }
  }, []);
  const loadModels = () => {
    // load the models of the kitchen and the hobs
    fbxModelsLoader(fbxModels).then(models => {
      console.log(models);
      setLoadedModels(models);
    });
  }
  return <div className="page createGame">
    content of createGame
    models loaded: {loadedModels.length}
  </div>;
}
export default CreateGame;