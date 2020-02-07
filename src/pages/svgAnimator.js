import React, {useEffect, useState, useRef} from 'react';
import finder from '@medv/finder';

import './svgAnimator.css';
import './custom-inputbox.css';
const SvgAnimator = (props) => {
  const [svgEl, setSvgEl] = useState(null);
  const [elList, setElList] = useState([]);
  const [clickedEl, setClickedEl] = useState(null);
  const [clickedElInfo, setClickedElInfo] = useState({});
  const [svgStr, setSvgStr] = useState('');
  const [curveStr, setCurveStr] = useState('0,0,1,1');
  // const [clickedQueue, setclickedQueue] = useState(false);
  useEffect(() => {
    const htmlEl = document.querySelector('html');
    htmlEl.addEventListener('dragover', dragoverHandler);
    htmlEl.addEventListener('drop', dropHandler);
    return () => {
      const htmlEl = document.querySelector('html');
      htmlEl.removeEventListener('dragover', dragoverHandler);
      htmlEl.removeEventListener('drop', dropHandler)
    }
  }, [])
  const dragoverHandler = (e) => {
    e.preventDefault();
  }
  const dropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let file = null;
    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      // for (var i = 0; i < e.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[0].kind === 'file') {
          file = e.dataTransfer.items[0].getAsFile();
        }
      // }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < e.dataTransfer.files.length; i++) {
        file = e.dataTransfer.files[0];
      }
    }
    if (file.type === 'image/svg+xml') {
      // update svg
      const reader = new FileReader();

      reader.readAsBinaryString(file);

      reader.onloadend = function(){
        setSvgStr(reader.result);
      }
      setClickedEl(null);
      setElList([]);
    }
  };
  useEffect(() => {
    if (svgEl) {
      // https://hackernoon.com/htmlcollection-nodelist-and-array-of-objects-da42737181f9
      // node list to array
      // Array.from(NodeList)
      // Array.prototype.slice.call(NodeList)
      // [...NodeList]
      // const ElArray = Array.from(svgEl.querySelectorAll('*'));
      // ElArray.forEach(...)
      // or just keep iterable
      // console.log('building');
      const ElListWithSelector = [];
      const ElList = svgEl.querySelectorAll('*');
      svgEl.addEventListener('click', svgOnClick);
      for (let el of ElList) {
        if (el.getBBox) {
          el.addEventListener('click', elOnClick);
          const boundBox = el.getBBox();
          el.style.transformOrigin = `${boundBox.x + boundBox.width / 2}px ${boundBox.y + boundBox.height / 2}px`;
          const selector = finder(el, {
            root: svgEl
          })
          el.data = {selector: selector};
          ElListWithSelector.push({
            selector: selector,
            element: el
          });
        }
      }
      setElList(ElListWithSelector);
    }
    return () => {
      if (svgEl) {
        svgEl.removeEventListener('click', svgOnClick);
        elList.forEach(item => item.element.removeEventListener('click', elOnClick));
        setClickedEl(null);
        setElList([]);
      }
    }
  }, [svgEl]);

  const svgOnClick = (e) => {
    e.stopPropagation();
    setClickedEl(null);
  }
  const elOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setClickedEl(e.currentTarget);
  }

  useEffect(() => {
    if (svgEl && clickedEl) {
      const selectorStr = finder(clickedEl, {
        root: svgEl
      })
      clickedEl.classList.add('selected');
      let parentNode = clickedEl.parentNode;
      while (parentNode !== svgEl && parentNode !== document.body) {
        parentNode.classList.add('selected');
        parentNode = parentNode.parentNode;
      }
      svgEl.classList.add('selecting');
      /**
       * try to get the element info
       */
      const elementInfo = {
        selectorStr: selectorStr,
        transformOrigin: window.getComputedStyle(clickedEl)['transformOrigin'],
        x: clickedEl.getAttribute('x'),
        y: clickedEl.getAttribute('y'),
        width: clickedEl.getAttribute('width'),
        height: clickedEl.getAttribute('height'),
        animation: [
          // {
          //   calcMode: 'discrete|linear|spline', // timingMode
          //   values: ['360', '0'], // keyframes
          //   keySplines: '0 0 1 1', // timingFunction for spline only
          //   type: 'translate|rotate|scale',
          //   repeatCount: 'indefinite|n',
          //   fill: 'remove|freeze', // status on complete
          //   dur: '3s', // duration
          //   begin: '0s', // delay
          // }
        ]
      };
      // https://stackoverflow.com/questions/3680876/using-queryselectorall-to-retrieve-direct-children
      const animationEls = clickedEl.querySelectorAll(":scope > animateTransform");
      Array.from(animationEls).forEach(animationEl => {
        const animationAttrs = {
          calcMode: animationEl.getAttribute('calcMode'),
          values: animationEl.getAttribute('values'),
          keySplines: animationEl.getAttribute('keySplines'),
          type: animationEl.getAttribute('type'),
          repeatCount: animationEl.getAttribute('repeatCount'),
          fill: animationEl.getAttribute('fill'),
          dur: animationEl.getAttribute('dur'),
          begin: animationEl.getAttribute('begin'),
        };
        elementInfo['animation'].push(animationAttrs);
      })
      setClickedElInfo(elementInfo);
    } else if (svgEl) {
      const elementInfo = {
        selectorStr: '',
      }
      setClickedElInfo(elementInfo);
      svgEl.classList.remove('selecting');
    }
    return () => {
      if (svgEl && clickedEl) {
        clickedEl.classList.remove('selected');
        let parentNode = clickedEl.parentNode;
        while (parentNode !== svgEl) {
          parentNode.classList.remove('selected');
          parentNode = parentNode.parentNode;
        }
      }
    }
  }, [svgEl, clickedEl]);

  useEffect(() => {
    if (svgStr) {
      setSvgEl(document.querySelector('#svgAnimator .svgWrapper svg'));
      // console.log(svgEl);
    }
  }, [svgStr]);
  return <div id="svgAnimator">
    <div className="svgWrapper">
      {clickedEl && clickedElInfo['selectorStr']? 
        <div style={{
          border: '2px solid #F00',
          position: 'absolute',
          top: clickedEl.getBoundingClientRect().y - 2,
          left: clickedEl.getBoundingClientRect().x - 2,
          width: clickedEl.getBoundingClientRect().width,
          height: clickedEl.getBoundingClientRect().height,
          pointerEvents: 'none'
        }}>
          <div style={{
            position: 'absolute',
            left: (clickedEl.getBoundingClientRect().width / clickedElInfo['width']) * clickedElInfo['transformOrigin'].split(' ')[0].replace('px',''),
            top: (clickedEl.getBoundingClientRect().width / clickedElInfo['width']) * clickedElInfo['transformOrigin'].split(' ')[1].replace('px','')
          }} />
        </div>
        :
        null
      }
      <span dangerouslySetInnerHTML={{__html: svgStr}} />
    </div>
    <div className="editorWrapper">
      <div className="svgElements">
        <select onChange={(e) => {
            {/* console.log(e.currentTarget.value); */}
            const selected = elList.find(el => el.selector === e.currentTarget.value);
            if (selected) {
              setClickedEl(selected.element);
            }
          }}value={clickedEl? clickedEl.data.selector: ""}>
          <option value="">Click to select an element</option>
          {elList.map((el, idx)=> <option key={idx} value={el.selector}>{el.element.tagName}</option>)}
        </select>
      </div>
      {clickedElInfo['selectorStr'] && 
        <div className="svgAnimation">
          <div className="custom-inputbox filled">
            <label>unique selector</label>
            <input readOnly value={clickedElInfo['selectorStr']} />
          </div>
          <div className="custom-inputbox filled">
            <label>transformOrigin</label>
            <input readOnly value={clickedElInfo['transformOrigin']} />
          </div>
          <div className="svgAnimations">
            {clickedElInfo['animation'].map((animationData, idx) => {
              return <div className="animation">
                <div className="custom-inputbox filled">
                  <label>type</label>
                  <input value={animationData['type']} />
                </div>
                <div className="custom-inputbox filled">
                  <label>timingMode</label>
                  <input value={animationData['calcMode']} />
                </div>
                <div className="custom-inputbox filled">
                  <label>timingFunction</label>
                  <input value={animationData['keySplines']} />
                </div>
                <div className="custom-inputbox filled">
                  <label>start</label>
                  <input value={animationData['begin']} />
                </div>
                <div className="custom-inputbox filled">
                  <label>duration</label>
                  <input value={animationData['dur']} />
                </div>
                <div className="custom-inputbox filled">
                  <label>repeatCount</label>
                  <input value={animationData['repeatCount']} />
                </div>
                <div className="custom-inputbox filled">
                  <label>onComplete behaviour</label>
                  <input value={animationData['fill']} />
                </div>
                <div className="custom-inputbox filled">
                  <label>animation values</label>
                  <input value={animationData['values']} />
                </div>
                <svg
                  style={{
                    width: 100,
                    height: 200,
                    overflow: 'visible'
                  }}
                  viewBox="0 0 1 1"
                >
                  <rect x="0" y="0" width="1" height="1" fill="none" stroke="#DDD" vectorEffect="non-scaling-stroke" />
                  <path d={`m0,0 C${animationData['keySplines']} 1,1`} style={{
                    stroke: '#000',
                    fill: 'none',
                    strokeWidth: 2,
                    transformOrigin: 'center',
                    transform: 'scaleY(-1)'
                  }} vectorEffect="non-scaling-stroke" />
                </svg>
                <input readOnly value={animationData['keySplines']} />  
              </div>;
            })}
          </div>
        </div>
      }
    </div>
  </div>;
}

export default SvgAnimator;

/** some svg attributes and functions
 
<animateTransform attributeName="transform" type="rotate" repeatCount="10" begin="5s" dur="5s" values="360 24.45 23.45;0 24.45 23.45"></animateTransform>

<animateTransform 
attributeName="transform" 
id="el_st0_nth_child_4_" 
type="rotate" 
repeatCount="1" 
begin="1s;el_st0_nth_child_4_.end+7s" 
dur="1s" 
values="360 -1 -1;0 -1 -1"
fill="freeze|remove"
calcMode="spline"
keySplines="0.4 0 0.2 1" <!-- https://cubic-bezier.com/ -->
></animateTransform>

svg.pauseAnimations()
svg.unpauseAnimations()
svg.setCurrentTime(0)

animation.beginElementAt(time)
animation.beginElement()
animation.endElement()

element.getBBox()


 */