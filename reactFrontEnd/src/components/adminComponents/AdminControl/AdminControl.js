import React, { useEffect, useState } from 'react';
import "./AdminControl.css"
import apiRequest from '../../apiRequest/ApiRequest';
import MapWrapper from '../../MapWrapper';

function AdminPage(props){
    const [isLogin,setLogin] = useState(0);
    const [center,setCenter] = useState([0,0])
    const [features,setFeatures] = useState([0,0])

    return (
        <div id="AdminPage">
            <MapWrapper center={center} features={features}/>
            <AdminControl setCenter={setCenter}/>
        </div>
    )
}

function AdminControl(props){
    const [controlContent, setControlContent] = useState(<ActiveRequest setCenter={props.setCenter}/>)
    return (
        <div id="adminControlCont">
            <div id="topBar">
                <div className="topBarItem" 
                    onClick={()=>{setControlContent(<ActiveRequest setCenter={props.setCenter}/>)}}>Active Request</div>
                <div className="topBarItem"
                    onClick={()=>{setControlContent(<RequestHistory setCenter={props.setCenter}/>)}}>History</div>
                <div className="topBarItem"
                    onClick={()=>{setControlContent(<UserList setCenter={props.setCenter}/>)}}>User List</div>
            </div>
            <div id="controlContentCont">
                {controlContent}
            </div>
        </div>
    )
}

function generateInfoBox(request){
    return <div className='newRequestItemInfoCont'>
        <div className='newRequest_name'><b>Name:</b> {request["name"]}</div>
        <div className='newRequest_phone'><b>Phone:</b> {request["phoneNum"]}</div>
        <div className='newRequest_time'><b>Time:</b> {request["time"]}</div>
        <br></br>
        <div className='newRequest_textBox'>
            <div className='newRequest_meet'><b>Features:</b> {request["feature"]}</div>
            <div className='newRequest_meet'><b>Meet Up:</b> {request["meet_up"]}</div>
            <div className='newRequest_info'><b>Additional Info:</b> {request["additional_info"]}</div>
        </div>
        {request["emergency"] == "1" ? <div className='emergency_icon'>!</div>:<div />}
    </div>
}
function generaterWalkerBox(request){
    return (
    <div className='newRequestItemInfoCont'>
        <div><b>Name:</b> {request["first_name"] + " " + request["last_name"]}</div>
        <div><b>Phone Num:</b> {request["phoneNum"]}</div>
    </div>
    )
}


function ActiveRequest(props){
    const [newRequests, setNewRequests] = useState([]);
    const [availableWalkers, setAvailableWalkers] = useState([]);
    const [inProgRequests, setInProgRequests] = useState([]);
    var queriedRequest = null;
    var queriedEle = null;
    const [selectedRequest,setSelectedRequest] = useState(-1);
    const [queriedWalkers,setQueriedWalkers] = useState(new Set());

    useEffect(()=>{
        apiRequest("http://localhost:8070/admin/","",
            {option:"a"},"POST")
        .then((data)=>{
            console.log(data)
            if(data["code"] == 1){
                var tmp = data["result"].filter( obj => obj.status=="0").map((request)=>(
                    <div className='newRequestItemCont' key={request["requestId"]}>
                        <input type="radio" name='selectRequest' id={request["requestId"]} 
                            value={request["requestId"]} className="selectRequest"
                            onChange={()=>{ setSelectedRequest(request["requestId"])}}></input>
                        <label htmlFor={request["requestId"]}>
                            {generateInfoBox(request)}
                        </label>
                    </div>
                ))
                setNewRequests(tmp)
            }
         })
         apiRequest("http://localhost:8070/admin/","",
            {option:"w"},"POST")
        .then((data)=>{
            console.log(data)
            if(data["code"] == 1){
                var tmp = data["result"].map((request)=>(
                    <div className='availableWalkerItemCont' key={request["userId"]}>
                        <div className='newRequestItemInfoCont'>
                            <div><b>Name:</b> {request["first_name"] + " " + request["last_name"]}</div>
                            <div><b>Phone Num:</b> {request["phoneNum"]}</div>
                        </div>
                        <div className='checkBoxCont'>
                            <input className="walkerSelector" type="checkbox" onChange={(e)=>{
                                if(e.target.checked){
                                    queriedWalkers.add(request["userId"]);
                                } else{
                                    queriedWalkers.delete(request["userId"]);
                                }
                                console.log(queriedWalkers)
                            }}></input>
                        </div>
                    </div>
                ))
                setAvailableWalkers(tmp)
            }
         })
        apiRequest("http://localhost:8070/admin/","",
            {option:"i"},"POST")
        .then((data)=>{
            console.log(data)
            if(data["code"]== 1){
                var tmp = data["result"].map((request)=>(
                    <div className="inProcRequestItemCont" key={request["requestId"]}>
                        <div className='inProcRequestCont'>
                            {generateInfoBox(request)}
                        </div>
                        <div className='inProcRequestWalkerList'>
                            {request["walkerList"].map((walker)=>(
                                <div className="walkerListItem" key={walker["userId"]}>
                                    <div className='walkerListHeader'>Name</div>
                                    <div className='walkerListVal'>{walker["first_name"] + " " + walker["last_name"]}</div>
                                    <div className='walkerListHeader'>Phone Number</div>
                                    <div className='walkerListVal'>{walker["phoneNum"]}</div>
                                    <button className='freeWalkerButton' onClick={()=>{
                                        apiRequest("http://localhost:8070/admin/","",
                                            {option:"f",userId:walker["userId"]},"POST")
                                        .then((data)=>{
                                            console.log(data)
                                        })
                                    }}>Free</button>
                                </div>
                            ))}
                        </div>
                        <div className='cancelInProcRequest' onClick={()=>{
                            apiRequest("http://localhost:8070/admin/","",
                                {option:"e",requestId:request["requestId"]},"POST")
                            .then((data)=>{
                                console.log(data)
                            })}
                        }>Cancel</div>
                    </div>
                ))
                setInProgRequests(tmp)
            }
         })
    },[])

    return (
        <div id="activeRequestCont">
            <div id="newRequestList" className='activeRequestItem'>
                <div className='activeRequestItemHeader'>
                    List of Active Requests
                </div>
                <div className='activeRequestItemCont'>
                    {newRequests}
                </div>
            </div>
            <div id="avaliableWalkers" className='activeRequestItem'>
                <div className='activeRequestItemHeader'>
                    Avaliable Walkers
                </div>
                <div className='availableWalkersCont'>{availableWalkers}</div>
            </div>
            <br></br>
            <div id="updateRequestCont">
                <button id="updateRequestButton" onClick={()=>{
                    console.log("Query Reqeust: ",selectedRequest,Array.from(queriedWalkers))
                    apiRequest("http://localhost:8070/admin/","",
                        {option:"q",requestId:selectedRequest,queriedWalkers:Array.from(queriedWalkers)},"POST")
                    .then((data)=>{
                        console.log(data)
                        if(data["code"] == 1){
                        }
                    })
                }}>Query</button>
            </div>
            <div id="inProcess" className='activeRequestItem'>
                <div className='activeRequestItemHeader'>
                    Requests In Process
                </div>
                <div className='inProcessRequest'>{inProgRequests}</div>
            </div>
        </div>
    )
}

function RequestHistory(props){
    const [historyEle, setHistoryEle] = useState(<div>LOADING...</div>)
    useEffect(()=>{
        apiRequest("http://localhost:8070/admin/","",
                {option:"h"},"POST")
            .then((data)=>{
                console.log(data)
                if(data["code"] == 1){
                    setHistoryEle(
                        <table id="historyTable">
                            <thead><tr id='historyListHeader'>
                                <th className='history_requesterId'>RequesterId</th>
                                <th className='history_time'>Time</th>
                                <th className='history_endtime'>Finish Time</th>
                                <th className='history_locStart'>Location Start</th>
                                <th className='history_locEnd'>Location End</th>                                    
                                <th className='history_emergency'>Emergency</th>
                                <th className='history_feature'>Feature</th>
                                <th className='history_meetUp'>Meet Up</th>
                                <th className='history_additionalInfo'>Additional Info</th>
                                <th className='history_walkerId'>Walker Id</th>
                            </tr></thead>
                            <tbody>
                            {data["result"].map((history)=>(
                                <tr className='historyListCont' key={history["requestId"]}>
                                    <td className='history_requesterId'>{history["requesterId"]}</td>
                                    <td className='history_time'>{history["time"]}</td>
                                    <td className='history_endtime'>{history["endTime"]}</td>
                                    <td className='history_locStart' onClick={()=>{
                                        props.setCenter([history["location_x"],history["location_y"]])
                                    }}>Position</td>
                                    <td className='history_locEnd'>{history["end_location_x"] == -1 ? 
                                        <div>N/A</div>:
                                        <div onClick={()=>{
                                            props.setCenter([history["end_location_x"],history["end_location_y"]])
                                        }}>Position</div>
                                    }</td>
                                    <td className='history_emergency'>{history["emergency"]}</td>
                                    <td className='history_feature'>{history["feature"]}</td>
                                    <td className='history_meetUp'>{history["meet_up"]}</td>
                                    <td className='history_additionalInfo'>{history["additional_info"]}</td>
                                    <td className='history_walkerId'>{history["walkerId"]}</td>
                                </tr>
                            ))}</tbody>
                        </table>
                    )
                }
            })
    },[])
    return (
        <div>
            {historyEle}
        </div>
    )
}
function UserList(props){
    const [userEle, setUserEle] = useState(<div>LOADING...</div>)
    useEffect(()=>{
        apiRequest("http://localhost:8070/admin/","",
                {option:"u"},"POST")
            .then((data)=>{
                console.log(data)
                if(data["code"] == 1){
                    setUserEle(
                        <table>
                        <thead><tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Current Request Id</th>
                        </tr></thead>
                        <tbody>
                        {data["result"].map((user)=>(
                            <tr className="userListItemCont" key={user["userId"]}>
                                <td>{user["first_name"]}</td>
                                <td>{user["last_name"]}</td>
                                <td>{user["phoneNum"]}</td>
                                <td>{user["email"]}</td>
                                <td>{user["status"] == 0 ? "Not Active" : "Active"}</td>
                                {user["status"] == 0 ?
                                    <td>NA</td> :
                                    <td>{user["currentRequestId"]}</td>
                                }
                            </tr>
                        ))}
                        </tbody></table>
                    )
                }
            })
    },[])
    return (
        <div id="userListCont">
            {userEle}
        </div>
    )
}

export default AdminPage