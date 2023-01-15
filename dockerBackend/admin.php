<?php 
    header('Access-Control-Allow-Origin: *');    
    header('Access-Control-Allow-Headers:  *');
    header('Access-Control-Allow-Methods:  *'); 
    include_once("../login.php");
    $hData = $_POST;
    if(empty($_POST)){
        $hData = json_decode(file_get_contents("php://input"),true);
    }

    //login
    //activeRequest -> returns new reqeusts, avaliable walkers, requests in progress
    //history -> returns history
    //userlist -> returns user list
    $ret = generateError("Invalid Option");
    $option = $hData["option"];
    if($option=="a"){
        $ret = getActiveRequests(); 
    }
    else if($option == "h"){
        $ret = getHistory();
    }
    else if($option == "u"){
        $ret = getUserList();
    }
    else if($option == "w"){
        $ret = getUserList("WHERE accountPerm=1 and status=0");
    }
    else if($option == "q"){
        $requestId = $hData["requestId"];
        $walkerList = $hData["queriedWalkers"];
        if(!empty($requestId) && !empty($walkerList)){
            $ret = queryRequest($requestId,$walkerList);
        }
    }
    else if($option == "i"){
        $ret = inProcess();
    }
    else if($option == "f"){
        if(!empty($hData["userId"])){
            $ret = freeWalker($hData["userId"]);
        }
    }
    else if($option == "e"){
        if(!empty($hData["requestId"]){
            $ret = endRequest($hData["requestId"]);
        }
    }
    echo $ret;

    function endRequest($requestId){
        global $conn;
        $que = "UPDATE userList
                SET status=0
                WHERE currentRequestId=$requestId";
        $res = $conn->query($que);
        $que = "SELECT * FROM activeRequest WHERE requestId=$requestId";
        $res = $conn->query($que);
        if(empty($res) || $res->num_rows==0) return generateError("No such request in process",202);
        $row = $res->fetch_assoc();
        $que = "INSERT INTO requestHistory(requestId,requesterId,walkerId,
                    time,location_x,location_y,feature,meet_up,emergency,additional_info)
                VALUES($requestId,".$row["requesterId"].",".$row["walkerId"].",'".$row["time"]."',".
                        $row["location_x"].",".$row["location_y"].",'".$row["feature"]."','".$row["meet_up"].
                        "',".$row["emergency"].",'".$row["additional_info"]."')";
        $res = $conn->query($que);
        $que = "DELETE FROM activeRequest WHERE requestId=$requestId";
        $res = $conn->query($que);
        return '{"code":1}';
    }
    
    function freeWalker($walkerId){
        global $conn;
        $que = "UPDATE userList
                SET status = 0
                WHERE userId=$walkerId";
        $res = $conn->query($que);
        return '{"code":1}';
    }
    function inProcess(){
        global $conn;
        $que = "SELECT * FROM activeRequest WHERE status = 1";
        $res = $conn->query($que);
        if(empty($res) || $res->num_rows==0) return generateError("No active request in process",202);
        $ret = array("code"=>1,"result"=>array());
        while($row = $res->fetch_assoc()){
            $row["walkerList"] = array();

            $rId = $row["requestId"];
            $que = "SELECT * FROM userList WHERE currentRequestId=$rId and accountPerm =1 &&status=3";
            $requestReq = $conn->query($que);
            if(empty($requestReq) && $requestReq->num_rows == 0){
                return generateError("Something went wrong",500);
            }
            while($walker= $requestReq->fetch_assoc()){
                $row["walkerList"][] = $walker;
            }
            $ret["result"][] = $row;
        } 
        return json_encode($ret);
    }

    function queryRequest($requestId,$walkerList){
        global $conn;
        $que = "UPDATE activeRequest
                SET status=1, walkerId='$walkerList[0]'
                WHERE requestId=$requestId";
        $conn->query($que);
        foreach($walkerList as $walker){
            $que = "UPDATE userList
                    SET currentRequestId=$requestId,
                        status=3
                    WHERE userId=$walker";
            $conn->query($que);
        }
        return '{"code":1}';

    }
    function getActiveRequests(){
        global $conn;
        $que = "SELECT * FROM activeRequest";
        $res = $conn->query($que);
        if(empty($res))
            return generateError("System Error: Try again");
        if($res->num_rows == 0) 
            return generateError("No Active Requests",201);

        $ret = array("code"=>1,"result"=>array());
        $cnt = 0;
        while($row = $res->fetch_assoc()){
            $ret["result"][]=$row;
        }
        return json_encode($ret);
    }
    
    function getHistory(){
        global $conn;
        $que = "SELECT * FROM requestHistory";
        $res = $conn->query($que);
        if(empty($res))
            return generateError("System Error: Try again");
        if($res->num_rows == 0) 
            return generateError("No Active Requests",101);

        $ret = array("code"=>1,"result"=>array());
        $cnt = 0;
        while($row = $res->fetch_assoc()){
            $ret["result"][] = $row; 
        }
        return json_encode($ret);
    }
    function getUserList($para=""){
        global $conn;
        $que = "SELECT * FROM userList ".$para;
        $res = $conn->query($que);
        if(empty($res))
            return generateError("System Error: Try again");
        if($res->num_rows == 0) 
            return generateError("Active Requests",101);

        $ret = array("code"=>1,"result"=>array());
        while($row = $res->fetch_assoc()){
            unset($row["password"]);
            unset($row["sessionExpire"]);
            unset($row["sessionId"]);
            $ret["result"][] = $row; 
        }
        return json_encode($ret);
    }
?>

