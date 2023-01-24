import axios from "axios"

function apiRequest(url,params, body, method="GET") {
    console.log(url)
    /*
    if(url == "http://localhost:8070/"){
        url = "172.20.192.234:8070"
        console.log(url)
    }
    */
    //url = "http://172.20.192.234:8070"

    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: url + params,
            //data: JSON.stringify(body),
            data: body,
            responseType: "json",
            proxy: false
        }).then((res) => {
            return resolve(res.data);
        }).catch(((err) => {
            return reject(err);
        }));

    });
}

export default apiRequest