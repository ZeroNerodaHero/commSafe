import './App.css';
// react
import React, { useState, useEffect, useRef} from 'react';
// components
import MapWrapper from './components/MapWrapper'
import GUIWrapper from './components/GUIWrapper';
//cookies

function App() {
  
  // set intial state
  const [ features, setFeatures ] = useState([])
  const [ center, setCenter] = useState([-121.955238,37.354107])
  const [ newRequestState, setNewRequestState] = useState(0);
  const [newRequestEle, setNewRequestEle] = useState(0);
  const [ tabState, setTabState] = useState(0);

  const [ resetGui, setResetGui] = useState(0);

  const newRequestButtonEle = (
    <div id="newRequestButton" onClick={()=>{
      setNewRequestState(1);
    }}>
      <div id="newRequestButtonText">
        +
      </div>
    </div>
  )
  const newRequestFormEle = (
    <div id="newRequestForm" onClick={()=>{
      setNewRequestState(0);
    }}>
      <div id="newRequestHead">
        Submit Request
      </div>
      <form>

      </form>
    </div>
  )
  useEffect(()=>{
    if(newRequestState == 0){
      setNewRequestEle(newRequestButtonEle)
    } else{
      setNewRequestEle(newRequestFormEle)
    }
  },[newRequestState])

  return (
    <div className="App">
      <MapWrapper features={features} center={center} setResetGui={setResetGui} resetGui={resetGui}/>
      <GUIWrapper setCenter={setCenter} resetGui={resetGui}></GUIWrapper>
    </div>
  )
}

export default App