import React, { useState, useEffect, useRef } from 'react';
import NewRequestForm from './subComponents/newRequestForm/NewRequestForm';
import InfoTab from './subComponents/infoTab/InfoTab';
import SignUpTab from './signUp/SignUp';

function GUIWrapper(props){
    const [GUIState,setGUIState] = useState(0)
    const [newRequestEle, setNewRequestEle] = useState();

    const newRequestButtonEle = (
        <div id="newRequestButton" onClick={()=>{
          setGUIState(1);
        }}>
          <div id="newRequestButtonText">
            +
          </div>
        </div>
    )
    const newRequestFormEle = (
    <div id="newRequestForm">
        <NewRequestForm setPromptRequest={props.setPromptRequest} setGUIState={setGUIState}></NewRequestForm>
    </div>
    )

    useEffect(()=>{
        setNewRequestEle(newRequestButtonEle);
    },[])

    useEffect(()=>{
        var ele = document.getElementById("infoTabExpanded")
        ele.style.display = "none"
        setNewRequestEle(newRequestButtonEle)

        var signupEle = document.getElementById("signUpTabCenter")
        signupEle.style.display = "none"
        if(GUIState == 1) setNewRequestEle(newRequestFormEle);
        else if(GUIState == 2) ele.style.display = "block"
        else if(GUIState == 3) signupEle.style.display = "grid"
    },[GUIState])
    useEffect(()=>{
        setGUIState(0)
    },[props.resetGui])

    return (
        <div id="guiCont">
            <div id="centerButton" onClick={()=>{
                if(navigator.geolocation){
                    navigator.geolocation.getCurrentPosition((position)=>{
                        props.setCenter([position.coords.longitude,position.coords.latitude])
                    })
                } else{
                    props.setCenter([0,0])
                }
            }}>
                &#8711;
            </div>
            {newRequestEle}
            <SignUpTab setGUIState={setGUIState}></SignUpTab>

            <div id="floatTopLeft" onClick={()=>{setGUIState(GUIState+1)}}>aa{GUIState}</div>

            <div id="infoTabButtonCont">
                <div id="infoTabText" onClick={()=>{setGUIState((GUIState == 2? 0:2))}}>
                    <span className="hamburger"></span>
                </div>
                <div id="infoTabExpanded">
                    <InfoTab setCenter={props.setCenter} 
                        GUIState={GUIState} setGUIState={setGUIState} 
                        setPromptRequest={props.setPromptRequest}></InfoTab>
                </div>
            </div>
        </div>
    )
}

export default GUIWrapper