import React from 'react';
import {useState, useEffect} from 'react';
const App = (props) => {
  const [fps, setFps] = useState(30);
  let containerEl;
  let canvasEl;
  let animationFrame;
  const setContainerEl = (ref) => containerEl = ref;
  const setCanvasEl = (ref) => canvasEl = ref;
  const draw = () => {

  }
  const update = () => {
    // the animation step
    animationFrame = setTimeout(() => update(), 1000 / fps);
  };

  useEffect(() => {
    // initScene();
  }, []);
  
  return <div ref={setContainerEl}>
    <canvas ref={setCanvasEl}/>
  </div>;
}

export default App;