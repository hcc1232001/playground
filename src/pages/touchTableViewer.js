import React, {useState, useEffect} from 'react';
import routes from 'globals/routes';

const TouchTableViewer = () => {
  const [targetWinSize, setTargetWinSize] = useState([1920, 1080]);
  const [winSize, setWinSize] = useState([window.innerWidth, window.innerHeight]);
  const [winScale, setWinScale] = useState(1);
  useEffect(() => {
    window.addEventListener('resize', () => {
      setWinSize([window.innerWidth, window.innerHeight]);
    });
  }, []);
  useEffect(() => {
    setWinScale(
      Math.min((window.innerWidth) / targetWinSize[0], (window.innerHeight) / targetWinSize[1])
    );
  }, [winSize, targetWinSize])
  return <div style={{
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  }}>
    <iframe src={`#${routes.touchTable}`} style={{
      width: targetWinSize[0],
      height: targetWinSize[1],
      transform: `scale(${winScale})`,
      transformOrigin: 'top left',
      overflow: 'hidden',
      border: 0,
      transition: 'all 0.3s'
    }} />
    <div
      style={{
        position: 'absolute',
        zIndex: 1,
        bottom: 15,
        right: 15,
        cursor: 'pointer'
      }}
      onClick={()=>{
        setTargetWinSize((prevTargerWinSize) => {
          if (prevTargerWinSize[0] === 3840) {
            return [1920, 1080];
          } else {
            return [3840, 2160];
          }
        })
      }}
    >
      current monitor<br />resolution:<br />
      {`${targetWinSize[0]} x ${targetWinSize[1]} `}
    </div>
  </div>;
};

export default TouchTableViewer;