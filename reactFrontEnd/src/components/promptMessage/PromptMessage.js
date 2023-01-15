import React, { useState, useEffect, useRef } from 'react';
import "./promptMessage.css"

function PromptMessage(props){
    const promptNull = (<div id="promptNull"></div>)
    const [promptEle,setPromptEle] = useState(promptNull)

    useEffect(()=>{
        console.log(props.promptRequest)
        if(props.promptRequest["type"] == "set"){
            setPromptEle(
                <div id="promptGuiCont" onClick={(e)=>{
                        setPromptEle(promptNull)
                }}>
                    <div id="promptBox">
                        <div id="promptRequestText">{props.promptRequest["msg"]}</div>
                    </div>
                </div>  
            )
        }
    },[props.promptRequest])

    return (
        <div>
            {promptEle}
        </div>
    )
}

export default PromptMessage