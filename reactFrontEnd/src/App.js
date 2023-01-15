import './App.css';
// react
import React, { useState, useEffect, useRef} from 'react';
// components
import MapWrapper from './components/MapWrapper'
import GUIWrapper from './components/GUIWrapper';
import AdminPage from './components/adminComponents/AdminControl/AdminControl';
import PromptMessage from './components/promptMessage/PromptMessage';
//cookies

function App() {
  const [ features, setFeatures ] = useState([])
  const [ center, setCenter] = useState([-121.955238,37.354107])
  const [ resetGui, setResetGui] = useState(0);
  const [ promptRequest, setPromptRequest] = useState("")

  const [ isAdmin, setAdmin] = useState(0);
  return (
    <div className="App">
      <PromptMessage promptRequest={promptRequest}/>
      <div id="adminSwitch" onClick={()=>{setAdmin(isAdmin ^ 1)}}>.</div>
      { isAdmin ? <AdminPage setPromptRequest={setPromptRequest} />:
        <div>
          <MapWrapper features={features} center={center} setResetGui={setResetGui} resetGui={resetGui}/>
          <GUIWrapper setCenter={setCenter} resetGui={resetGui} setPromptRequest={setPromptRequest}></GUIWrapper>
        </div>
      }
    </div>
  )
}

export default App