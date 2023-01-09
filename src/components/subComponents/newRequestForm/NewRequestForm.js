import React, { useState, useEffect, useRef } from 'react';
import './NewRequestForm.css'
import {getCookie} from "../../cookieReader/CookieReader"
import apiRequest from '../../apiRequest/ApiRequest';
import { Overlay } from 'ol';
/*SESSION ID NOT IMPLEMENTED */
function NewRequestForm(){
    const formOverlayCopy=(<div id="formOverlay">
            <div id="formOverlayText">
                <div id="formOverlayHeader">
                    Please Login first
                </div>
            </div>
        </div>)

    var isLogin = 0;
    const [name,setName] = useState("")
    const [phoneNum,setPhoneNum] = useState("")
    const [nFeatures,setNFeatures] = useState("")
    const [additionalInfo,setAdditionalInfo] = useState("")
    const [isEmergency,setEmergency] = useState(false)
    const [meetup,setMeetUp] = useState("")
    const [FormOverlay,setFormOverlay] = useState(formOverlayCopy)
    var sessionCookie = useRef(null);

    useEffect(
        //reasonw hwy this is here is bc the render should not call this over and over again. only once at 
        //the begining
        ()=>{
            sessionCookie.current = getCookie(["userId","sessionId"])
            if(sessionCookie.current != null){
                apiRequest("http://localhost:8070/","",
                    {option:"u",userId:sessionCookie.current["userId"],
                        sessionId:sessionCookie.current["sessionId"]},
                    "POST")
                .then((data)=>{
                    console.log(data)
            
                    setName(data.first_name + " " + data.last_name)
                    setPhoneNum(data.phoneNum)

                    setFormOverlay(<div></div>)
                })
            }
    },[])

    return (
        <div id="newFormCont">
            { FormOverlay}
            <div id="newFormHeadCont">
                <div id="newFormHead">
                    New Request
                </div>
            </div>
            <div>
                <div className='inputFormCont'>
                    <input id="nameForm" name="nameForm" className='nameFormBox' 
                        required="required" value={name} onChange={(e)=>{
                            setName(e.target.value)
                        }}></input>
                    <label className='nameFormHead'>Name:</label>
                </div>
                <div className='inputFormCont'>
                    <input id="pnumForm" name="pnumForm" className='nameFormBox'
                        required="required" value={phoneNum} onChange={(e)=>{
                            setPhoneNum(e.target.value)
                        }}></input>
                    <label className='nameFormHead'>Phone Number:</label>
                </div>
                {(!isLogin ? <div className="formPS">
                    <b><i>(Login to autofill)</i></b>
                </div>:"")}
                <hr></hr>
                
                <div className='inputFormCont'>
                    <input name="nFeature" id="nFeature" className='nameFormBox'
                        required="required"
                        value={nFeatures} onChange={(e)=>{
                            setNFeatures(e.target.value)
                        }}></input>
                    <label className='nameFormHead'>
                        Noticible Features
                    </label>
                    <div className='formPS'>
                        Please list noticible features(clothing,etc...)
                    </div>
                </div>
                <div className='inputFormCont'>
                    <input name="meetUp" id="meetUp" className='nameFormBox'
                        required="required" 
                        value={meetup} onChange={(e)=>{setMeetUp(e.target.value)}}></input>
                    <label className='nameFormHead'>
                        Meet Up Area
                    </label>
                    <div className='formPS'>
                        Fill if meet up is not at your current location
                    </div>
                </div>
                <br></br>
                <div>
                    <label className='nameFormHead'>Additional Info</label><br></br>
                    <div><textarea id="additionalInfo" value={additionalInfo}
                        onChange={(e)=>{
                            setAdditionalInfo(e.target.value)
                        }}>
                    </textarea></div>
                </div>
                <div id='emergencyCont'>
                    <div id='emergencyLabel'>Check if emergency</div>
                    <div id="emergencyButtonCont">
                        <input type="checkbox" name="emergencyInput" id="emergencyInput"
                            value={isEmergency} onChange={(e)=>{
                                setEmergency(e.target.checked)
                            }}></input>
                        <label htmlFor="emergencyInput" id="emergencyToggle"></label>
                    </div>
                </div>
                <div id="submitButtonCont">
                    <button id="formSubmit" onClick={()=>{
                        sessionCookie.current = getCookie(["userId","sessionId"])
                        if(sessionCookie != null && name !== "" && phoneNum !== "" && nFeatures !== ""){
                            var curCenter = null;
                            if(navigator.geolocation){
                                navigator.geolocation.getCurrentPosition((position)=>{
                                    curCenter = ([position.coords.longitude,position.coords.latitude])
                                    console.log({option:"a",
                                    userId:sessionCookie.current["userId"],
                                    sessionId:sessionCookie.current["sessionId"],
                                    name: name,
                                    phoneNum: phoneNum,
                                    features: nFeatures,
                                    location_x: curCenter[0],
                                    location_y: curCenter[1],
                                    isEmergency: isEmergency,

                                    aInfo: additionalInfo,
                                    meet_up: meetup
                                })

                                    apiRequest("http://localhost:8070/","",
                                        {option:"a",
                                            userId:sessionCookie.current["userId"],
                                            sessionId:sessionCookie.current["sessionId"],
                                            name: name,
                                            phoneNum: phoneNum,
                                            features: nFeatures,
                                            location_x: curCenter[0],
                                            location_y: curCenter[1],
                                            isEmergency: isEmergency,

                                            aInfo: additionalInfo,
                                            meet_up: meetup
                                        },
                                        "POST").then((data)=>{
                                            console.log(data)
                                        })
                                })
                                
                                
                            }
                            
                        } 
                    }}>Submit</button>
                
                </div>
            </div>
        </div>
    )
}
export default NewRequestForm