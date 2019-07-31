// const timeNow = 
//   performance.now       ||
//   performance.mozNow    ||
//   performance.msNow     ||
//   performance.oNow      ||
//   performance.webkitNow ||            
//   Date.now              ||
//   new Date().getTime();
const fpsRenderer = ({
  fps = 0,
  callback
}) => {
  let animationFrame = null;
  let lastTime = null;
  let currentTime = null;
  // let fpsControlEnable = false;
  let frameInterval = 0;
  const start = () => {
    currentTime = Date.now();
    lastTime = currentTime;
    if (fps > 0) {
      frameInterval = 1000 / fps;
    }
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    animationFrame = requestAnimationFrame(loop);
  }
  const loop = () => {
    animationFrame = requestAnimationFrame(loop);
    currentTime = Date.now();
    if (frameInterval > 0) {
      const timePassed = currentTime - lastTime;
      if (timePassed >= frameInterval) {
        lastTime = currentTime - (timePassed % frameInterval);
        callback();
      }
    } else {
      callback();
    }
  }
  const stop = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  }
  return {
    start: start, 
    stop: stop
  };
}

export default fpsRenderer;