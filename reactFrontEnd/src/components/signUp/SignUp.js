import React, { useEffect, useState } from 'react';
import apiRequest from '../apiRequest/ApiRequest';
import '../../styleSheets/form.css'
import './signUp.css'


/*
problems: align content not exactly centered. seems like padding is the issue
*/
function SignUpTab(props){
    const [f_name,setFName] = useState("");
    const [l_name,setLName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [phoneNum,setPhoneNum] = useState("");
    return (
        <div id="signUpTabCenter">
        <div id="signUpTabCont">
            <div id="signUpFormCont">
                <div id="signUpHeader">
                    Sign Up
                </div>
                <div id="signUpForm">
                    <div id="signUpNameCont">
                        <div className="formItemCont">
                            <input className="formItemBox" required="required"
                                value={f_name} onChange={(e)=>{setFName(e.target.value)}}></input>
                            <label className="formItemTitle">First Name</label>
                        </div>
                        <div className="flexSpacing">.</div>
                        <div className="formItemCont">
                            <input className="formItemBox" required="required"
                                value={l_name} onChange={(e)=>{setLName(e.target.value)}}></input>
                            <label className="formItemTitle">Last Name</label>
                        </div>
                    </div>
                    <div className="formItemCont">
                        <input className="formItemBox" required="required"
                            value={email} onChange={(e)=>{setEmail(e.target.value)}}></input>
                        <label className="formItemTitle">Email</label>
                    </div>
                    <div className="formItemCont">
                        <input className="formItemBox" required="required" type="password"
                            value={password} onChange={(e)=>{setPassword(e.target.value)}}></input>
                        <label className="formItemTitle">Password</label>
                    </div>
                    <div className="formItemCont">
                        <input className="formItemBox" required="required"
                            value={phoneNum} onChange={(e)=>{setPhoneNum(e.target.value)}}></input>
                        <label className="formItemTitle">Phone Number</label>
                    </div>
                    <div className='twoButtonFormLeftRight'>
                        <button className='formSubmitButton' onClick={()=>{props.setGUIState(0)}}>
                            Cancel
                        </button>
                        <button className='formSubmitButton' onClick={()=>{
                            apiRequest("http://localhost:8070/","",
                            {option:"s",f_name:f_name,l_name:l_name,email:email,phoneNum:phoneNum,password:password},
                            "POST")
                            .then((data)=>{
                                if(data["code"] == 1){
                                    console.log("Account Created")
                                } else{
                                    console.log(data["msg"])
                                }
                            })

                        }}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}
export default SignUpTab