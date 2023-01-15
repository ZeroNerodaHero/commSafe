import React, { useEffect, useState } from 'react';
import apiRequest from '../../apiRequest/ApiRequest';
import {setCookie, getCookie} from '../../cookieReader/CookieReader';

function UserInfoTab(props){
    var [img,setImg] = useState("https://media.discordapp.net/attachments/482613781818769408/998100726469369897/1654267434442.gif");
    var [name,setName] = useState("test test");
    var [phoneNum,setPhoneNum] = useState("408-888-9998");
    var [error,setError] = useState(true)
    
    useEffect(()=>{
    var sessionCookie = getCookie(["userId","sessionId"])
        if(sessionCookie != null){
            apiRequest("http://localhost:8070/","",
                {option:"u",userId:sessionCookie["userId"],sessionId:sessionCookie["sessionId"]},
                "POST")
            .then((data)=>{
                if(data["code"] == 0){
                    props.setTabState(0);
                } else if(data["code"] == 1){
                    setName(data.first_name + " " + data.last_name)
                    setPhoneNum(data.phoneNum)
                    setError(0);
                }
            })
        } else props.setTabState(0)
    },[])
    return (
        <div id="accountInfo">
            <div id="imgDisplayCont">
                <img src={img} id="imgDisplay" ></img>
            </div>
            <div id="infoDisplay">
                <div>{name}</div>
                <div>{phoneNum}</div>
            </div>
        </div>
    )
}

function FinishRequest(props){
    /*
    const [walkerName,setWalkerName] = useState("Loading...")
    const [time,setTime] = useState("00:00");
    */

    const noActiveRequest = <div id="noActiveFinishRequest">You have no active request</div>;
    const [requestEle,setRequestEle] = useState(noActiveRequest)
    var sessionCookie = getCookie(["userId","sessionId"])

    useEffect(()=>{
        if(sessionCookie != null){
            apiRequest("http://localhost:8070/","",
                {option:"r",userId:sessionCookie["userId"],sessionId:sessionCookie["sessionId"]},
                "POST")
            .then((data)=>{
                console.log(data)
                if(data["code"] == 0){
                    props.setTabState(0);
                } else if(data["code"] == 102){
                    console.log("NO REQUESTS");
                } else if(data["code"] ==1){
                    setRequestEle(
                        <div id="finishRequestCont">
                            <div id="finishRequestText">
                                If you've reached your destination, please press finish
                            </div>
                            <div id="fButtonCont">
                                <div id="finishButton" onClick={
                                    ()=>{
                                        props.setPromptRequest({type:"set",msg:"Finishing Request. Waiting for server."})
                                        if(sessionCookie != null && navigator.geolocation){
                                            navigator.geolocation.getCurrentPosition((position)=>{
                                                var endCenter = [position.coords.longitude,position.coords.latitude]
                                                apiRequest("http://localhost:8070/","",
                                                    {option:"f",userId:sessionCookie["userId"],sessionId:sessionCookie["sessionId"],
                                                        location_x:endCenter[0],location_y:endCenter[1]},
                                                    "POST")
                                                .then((data)=>{
                                                    console.log(data)
                                                    if(data["code"] == 1){
                                                        setRequestEle(noActiveRequest)
                                                        props.setPromptRequest({type:"set",
                                                            msg:"Request Finished"})
                                                    }
                                                })
                                            })
                                        }
                                    }
                                }>
                                    Finish
                                </div>
                            </div>
                            <div id="finishInfo">
                                <div>Request Time:<br></br>{data["time"]}</div>
                                <div>Walker:<br></br>{data["walkerName"]}</div>
                            </div>
                        </div>
                    );
                }
            })
        } else props.setTabState(0)
    },[])
    return (
        <div id="finishRequest">
            {requestEle}
        </div>
    )
}

function HistoryTab(props){
    var sessionCookie = getCookie(["userId","sessionId"])
    const [historyEle,setHistoryEle] = useState(<div>Loading</div>)

    useEffect(()=>{
        if(sessionCookie != null){
            apiRequest("http://localhost:8070/","",
                {option:"h",userId:sessionCookie["userId"],sessionId:sessionCookie["sessionId"]},
                "POST")
            .then((data)=>{
                console.log(data["code"])
                if(data["code"] == 1){
                    var historyList = data["History"]
                    var tmpEle = historyList.map((wRequest)=>(
                        <div className="historyEncap" key={wRequest["id"]}>
                            <div className="historyTimeDisplay">
                                <div className="timeStart">
                                    <div className="sectionHead">Start: </div>
                                    <div>{wRequest["time_start"]}</div>
                                </div>
                                <div className="timeEnd">
                                    <div className="sectionHead">End: </div>
                                    <div>{wRequest["time_end"]}</div>
                                </div>
                            </div>
                            <div>
                                <div className="sectionHead">Your Walker:</div>
                                <div className="walkerName">{wRequest["walker_name"]}</div>
                            </div>
                            <div>
                                <div className="sectionHead">Location(Approximate): </div>
                                <div className="locationList" onClick={()=>{
                                    console.log(wRequest["location_start"])
                                    props.setCenter(wRequest["location_start"])
                                }}>
                                    <b>Start:</b> Mark
                                </div>
                                <div className="locationList" onClick={()=>{
                                    console.log(wRequest["location_end"])
                                    props.setCenter(wRequest["location_end"])
                                }}>
                                    <b>End:</b> Mark
                                </div>
                            </div>
                            
                            {wRequest["notes"] != null && wRequest["notes"] !== "" ?
                                <div>
                                    <div className="notesHead">Note:</div>
                                    <div className="noteText">{wRequest["notes"]}</div>
                                </div>
                                :""}
                        </div>
                    ))
                    setHistoryEle(tmpEle)
                } else if(data["code"] == 0){
                    props.setTabState(0);
                } else if(data["code"] = 101){
                    setHistoryEle("You haven't made any requests.")
                }
            })
        } else props.setTabState(0)
    },[])
    //return 
    return (
        <div id="historyTabEncap">
            { historyEle }
            ...       
        </div>
    )
}

function LoginTab(props){
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");

    return (
        <div id="accountLogin">
            <div id="loginHeader">
                Login
            </div>
            <div className='inputFormCont'>
                <input className='nameFormBox' name='loginUserName' 
                    value={email} onChange={(e)=>{
                        setEmail(e.target.value)
                    }}
                    required='required'></input>
                <label className='nameFormHead'>Email</label>
            </div>
            <div className='inputFormCont'>
                <input className='nameFormBox' name='loginUserName' 
                    value={password} onChange={(e)=>{
                        setPassword(e.target.value)
                    }}
                    required='required' type='password'></input>
                <label className='nameFormHead'>Password</label>
            </div>
            <div id="signUpCont">
                Or <span id="signUpText" onClick={()=>{
                    props.setGUIState(3)
                }}>sign up</span>
            </div>
            <br></br>

            <button onClick={()=>{
                apiRequest("http://localhost:8070/","",{option:"l",email:email,password:password},"POST").then((data)=>{
                    if(data["code"] == 1){
                        setCookie("userId",data.userId);
                        setCookie("sessionId",data.sessionId);
                        props.setTabState(1);
                    } else{
                        setEmail("ERROR")
                    }
                })
            }}>Login</button>
        </div>
    );
}

export {UserInfoTab, FinishRequest,HistoryTab, LoginTab}
export default UserInfoTab