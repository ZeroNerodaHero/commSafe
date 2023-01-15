import React, { useEffect, useState } from 'react';
import './InfoTab.css'
import {UserInfoTab,FinishRequest,HistoryTab,LoginTab} from './GenBody';
import apiRequest from '../../apiRequest/ApiRequest';
import {setCookie, getCookie} from '../../cookieReader/CookieReader';

function InfoTab(props){
    
    var tmpOptImg = "https://media.discordapp.net/attachments/471696070439862272/471696638109417472/unknown.png?width=634&height=634"
    const [tabState,setTabState] = useState(0);
    const [tabDisplay,setTabDisplay] = useState(null);
    const [infoOptions,setInfoOptions] = useState(<div></div>)

    useEffect(()=>{
        var sessionCookie = getCookie(["userId","sessionId"])
        if(sessionCookie != null){
            apiRequest("http://localhost:8070/","",
                {option:"u",userId:sessionCookie["userId"],sessionId:sessionCookie["sessionId"]},
                "POST")
            .then((data)=>{
                if(data["code"] == 1){
                    setTabState(1)
                    setTabDisplay(<UserInfoTab setTabState={setTabState}></UserInfoTab>)
                } else{
                    setTabDisplay(<LoginTab setTabState={setTabState} setGUIState={props.setGUIState}></LoginTab>)
                }
            })
        } else
            setTabDisplay(<LoginTab setTabState={setTabState} setGUIState={props.setGUIState}/>);
    },[])
    useEffect(()=>{
        if(tabState == 0){
            setTabDisplay(<LoginTab setTabState={setTabState} setGUIState={props.setGUIState}/>);
        }
        else if(tabState == 1){
            setTabDisplay(<UserInfoTab setTabState={setTabState}/>);
        }
        else if(tabState == 2){
            setTabDisplay(<HistoryTab setCenter={props.setCenter} setTabState={setTabState}/>);
        }
        else if(tabState == 3){
            setTabDisplay(<FinishRequest setTabState={setTabState} setPromptRequest={props.setPromptRequest}/>);
        }
        console.log("resetInfo")
    },[tabState,props.GUIState])
    
    return (
        <div id="infoTab">
            {(tabState == 0 ? <div></div> :
                <div id="infoTabTabCont">
                    <div className="tabOpt" onClick={()=>{setTabState(1)}}>
                        <img src={tmpOptImg} alt="account" className='optImg'></img>
                    </div>
                    <div className="tabOpt" onClick={()=>{setTabState(2)}}>
                        <img src={tmpOptImg} alt="history" className='optImg'></img>
                    </div>
                    <div className="tabOpt" onClick={()=>{setTabState(3)}}>
                        <img src={tmpOptImg} alt="request" className='optImg'></img>
                    </div>
                </div>
            )}
            <div id="infoCont">
                {tabDisplay}
            </div>
        </div>
    )
}
export default InfoTab