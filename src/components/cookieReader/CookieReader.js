import { all } from "axios";

function setCookie(key,val,time=(60*30*1000),path="/"){
    var newD = new Date;
    newD.setTime(newD.getTime()+(time))
    document.cookie = key+"="+val+";expires="+newD.toUTCString+";path="+path;
}
//give a list of keys needed, all keys are valid
function getCookie(keyList){
    keyList.sort()
    var ret = {};
    var allCookie = document.cookie.split(/ ?; ?/).sort();
    var i =0, j =0;
    for(;i < keyList.length && j < allCookie.length; j++){
        var curItem = allCookie[j].split(/ ?= ?/)
        if(keyList[i] === curItem[0]){
            ret[keyList[i]] = curItem[1];
            i++;
        }
    }
    if(i != keyList.length) return null;
    return ret;
}

export default {setCookie, getCookie}
export {setCookie, getCookie}