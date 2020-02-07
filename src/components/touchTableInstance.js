import React, {useEffect, useState, useRef} from 'react';
import {TweenMax, Back} from 'gsap';
import Hammer from 'react-hammerjs';

import './touchTableInstance.css';


/**
 * TouchTableInstance
 * @param {float} props.currentRotate
 * @param {[float, float]} props.currentXY
 * 
 * TODO: reposition the instance when outside boundary
 */
const TouchTableInstance = (props) => {
  const [msg, setMsg] = useState("event message");
  const [scale, setScale] = useState(1);
  const [scalingFactor, setScalingFactor] = useState(0);
  const [angle, setAngle] = useState(props.currentRotate || 0);
  const [rotatingAngle, setRotatingAngle] = useState(props.currentRotate || 0);
  const [currentXY, setCurrentXY] = useState(props.currentXY || [0,0]);
  const [previousXY, setPreviousXY] = useState(props.currentXY || [0,0]);
  const handlePinch = (event) => {
    const newScale = Math.min(Math.max(scale * event.scale, 1), 2);
    setScalingFactor(newScale);
    setCurrentXY([
      previousXY[0] + event.deltaX,
      previousXY[1] + event.deltaY
    ])
  }
  const handlePinchEnd = (event) => {
    const newScale = Math.min(Math.max(scale * event.scale, 1), 2);
    setScale(newScale);
  }
  const handleRotateStart = (event) => {
    setAngle(event.rotation - rotatingAngle);
  }
  const handleRotateMove = (event) => {
    setRotatingAngle( event.rotation - angle );
  }
  const enablePan = useRef(false);
  const handlePanEnd = (event) => {
    if (enablePan.current) {
      enablePan.current = false;
      // console.log('disablePan');
      setPreviousXY([
        previousXY[0] + event.deltaX,
        previousXY[1] + event.deltaY
      ])
    }
  }
  const handlePan = (event) => {
    // pan on scrollable area will have weird behaviour
    if (event.type === "pan" && enablePan.current) {
      // console.log(event.type);
      setCurrentXY([
        previousXY[0] + event.deltaX,
        previousXY[1] + event.deltaY
      ])
    }
  }
  const handlePanStart = (event) => {
    if (event.target.classList.contains('noPanning') || (event.target.offsetParent && event.target.offsetParent.classList.contains('noPanning'))) {
      enablePan.current = false;
      // console.log('noPan');
    } else {
      enablePan.current = true;
      // console.log('enablePan');
    }
  }
  useEffect(() => {
    const aniScale = {scale: 0};
    TweenMax.to(aniScale, 0.4, {
      scale: 1,
      ease: Back.easeOut,
      onUpdate: () => {
        setScalingFactor(aniScale.scale)
      },
      onComplete: () => {
        setScale(1)
      }
    })
  }, [])
  const rotateInstance = () => {
    setAngle(angle + 12.5);
    setRotatingAngle( rotatingAngle + 12.5 );
  }
  const closeInstance = () => {
    const aniScale = {scale: scalingFactor};
    TweenMax.to(aniScale, 0.2, {
      scale: 0,
      ease: Back.easeIn,
      onUpdate: () => {
        setScalingFactor(aniScale.scale)
      },
      onComplete: () => {
        props.closeFunc()
      }
    })
  }
  return (
  <div className="touchTableInstance" 
    style={{
      transform: `translate(${currentXY[0]}px,${currentXY[1]}px) rotate(${rotatingAngle}DEG) scale(${scalingFactor})`
    }}
  >
    <Hammer
      onPinch={handlePinch}
      onPinchEnd={handlePinchEnd}
      onRotateStart={handleRotateStart}
      onRotateMove={handleRotateMove}
      onPanStart={handlePanStart}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      options={{
        recognizers: {
          pinch: { enable: true },
          rotate: { enable: true },
          pan: { threshold: 1 }
        }
      }}
    >
      <div style={{
        height: '100%'
      }}>
    
        <div className="controlMenu">
        <div className="rotateButton" 
            onClick={rotateInstance}
          >O</div>
          <div className="closeButton" 
            onClick={closeInstance}
          >X</div>
        </div>
        <div className="contentPanel noPanning">
          <div className="categoryLayer1">
            <ul className="categoryLayer1List">
              <li className="categoryLayer1Item">K. Wah</li>
              <li className="categoryLayer1Item">Dr. Lui Che Woo</li>
              <li className="categoryLayer1Item">Lui Che Woo Prize</li>
              <li className="categoryLayer1Item">Gallery</li>
            </ul>
          </div>
          <div className="categoryLayer2">
            <ul className="categoryLayer2List">
              <li className="categoryLayer2Item">About K. Wah</li>
              <li className="categoryLayer2Item">Properties</li>
              <li className="categoryLayer2Item">Chairman & Founder</li>
              <li className="categoryLayer2Item">CSR</li>
              <li className="categoryLayer2Item">Achievement</li>
              <li className="categoryLayer2Item">60 th Anniversary</li>
              <li className="categoryLayer2Item">Global Presence</li>
              <li className="categoryLayer2Item">Construction Materials</li>
              <li className="categoryLayer2Item">Hospitality</li>
              <li className="categoryLayer2Item">Entertainment & Leisure</li>
            </ul>
          </div>
        </div>
      </div>
    </Hammer>
  </div>
  );
}

export default TouchTableInstance;
