<?php 
    header('Access-Control-Allow-Origin: *');    
    header('Access-Control-Allow-Headers:  *');
    header('Access-Control-Allow-Methods:  *'); 
    include_once("login.php");
    $hData = $_POST;
    if(empty($_POST)){
        $hData = json_decode(file_get_contents("php://input"),true);
    }

    //parameters
    //api-key requires
    $apiKey = "null";
    $option = empty($hData["option"]) ? 0:$hData["option"];

    if($option == 0){
        genNoParamInfo();
        die();
    }

    //dev parameters
    $hrText = (empty($hData["human_readable"]) ? false : $hData["human_readable"]);

    $returnResponse = generateError("Invalid Option");
    if(validAPIkey($apiKey)){
        if($option == 't'){
            $returnResponse = "Test call success";
        }
        else if($option == 'l'){
            if(!empty($hData["email"]) && !empty($hData["password"])){
                $returnResponse = login($hData["email"],$hData["password"]); 
            } else {
                $returnResponse = generateError("Missing Parameters",999);
            }
        }
        else if($option == 'u' || $option == 'h' || $option == 'r' || $option =='f' || $option == 'v'){
            if(empty($hData["userId"]) || empty($hData["sessionId"])){
                $returnResponse = generateError("Missing Parameters",999);
            } 
            if($option == 'u'){
                $returnResponse = userInfo($hData["userId"],$hData["sessionId"]); 
            }
            else if($option == 'h'){
                $returnResponse = getHistory($hData["userId"],$hData["sessionId"]); 
            }
            else if($option == 'r'){
                    $returnResponse = userRequest($hData["userId"],$hData["sessionId"]);
            }
            else if($option == 'f'){
                if(!empty($hData["location_x"]) && !empty($hData["location_y"])){
                $returnResponse = finishRequest($hData["userId"],$hData["sessionId"],
                                        $hData["location_x"],$hData["location_y"]); 
                }
            }
            else if($option == 'v'){
                $returnResponse = checkSession($hData["userId"],$hData["sessionId"]); 
            }
        }
        else if($option == 'a'){
            if(!empty($hData["name"]) && !empty($hData["phoneNum"]) && 
                !empty($hData["features"]) &&
                !empty($hData["location_x"]) && !empty($hData["location_y"])){
                    if(!empty($hData["userId"]) && !empty($hData["sessionId"])){
                        $returnResponse = submitNewRequest(
                            $hData["userId"],$hData["sessionId"],
                            $hData["name"],$hData["phoneNum"],
                            $hData["features"],
                            $hData["location_x"], $hData["location_y"],
                            empty($hData["isEmergency"])?0:1,
                            $hData["aInfo"], $hData["meet_up"]
                        );
                    } else {
                        $returnResponse = generateError("No Login not implemented yet"); 
                    }
            } else{
                $returnResponse = generateError("Please fill out the required parameters",104);
            }
        } 
        else if($option == 's'){
            if(!empty($hData["f_name"]) && !empty($hData["l_name"]) &&
                !empty($hData["email"]) && !empty($hData["password"]) && 
                !empty($hData["phoneNum"])){
                        $returnResponse = newUser($hData["f_name"],$hData["l_name"],
                                $hData["email"],$hData["password"],$hData["phoneNum"]);
            }
        }
    }
    echo $returnResponse;
    function validAPIkey($apiKey){ return 1; } 
    function newUser($f_name,$l_name,$email,$password,$phoneNum){
        global $conn;
        $que = "SELECT userId FROM userList
                WHERE email='$email' or phoneNum='$phoneNum'";
echo $que;
        $res = $conn->query($que);
        if(!empty($res) &&  $res->num_rows>0) return generateError("You already have an account",0);
        
        $userId = rand();
        $que = "INSERT INTO userList(userId,first_name,last_name,password,email,phoneNum,accountPerm)
                VALUES($userId,'$f_name','$l_name','$password','$email','$phoneNum',0)";
        echo $que;
        $que = "CREATE TABLE history_$userId(
                requestId int,
                walkerId int,
                time timestamp,
                location_x double,
                location_y double,
                end_location_x double,
                end_location_y double,
                feature varchar(800),
                meet_up varchar(800),
                emergency bool,
                additional_info varchar(800),
                endTime timestamp DEFAULT CURRENT_TIMESTAMP
                )";
        echo $que;
    }
    function submitNewRequest($userId,$sessionId,$name,$phoneNum,$features,
                             $location_x,$location_y,$isEmergency,$aInfo="",$meet_up=""){
        global $conn;
        $que = "SELECT status,currentRequestId FROM userList
                WHERE userId='$userId' and sessionId='$sessionId'";
        $res = $conn->query($que);
        if(empty($res) || $res->num_rows==0) return generateError("User not found",0);
        $requestId = null;
        $status = null;
        while($row = $res->fetch_assoc()){
            $status= $row["status"];
        }
        if($status != 0) return generateError("Request Already in Process",105);

        $que = "INSERT INTO activeRequest(name,phoneNum,feature,requesterId,location_x,location_y,
                            emergency,additional_info,meet_up)
                VALUES(
                    '$name','$phoneNum','$features',$userId,
                    $location_x,$location_y,$isEmergency,'$aInfo','$meet_up'
                )";
        $conn->query($que);
        $lastId = $conn->insert_id;
        $que = "UPDATE userList
                SET status = 1, currentRequestId= $lastId
                WHERE userId=$userId and sessionId=$sessionId";
        $conn->query($que);
        return '{"code":1,"responseId":'.$lastId.'}';
    }
    function finishRequest($userId,$sessionId,$loc_x,$loc_y){
        global $conn;
        $check= checkRequest($userId,$sessionId);
        if($check[0] != 0){
            return generateError("Login Again Please",0);
        }
        $requestId=$check[1];
        $que = "UPDATE userList
                SET status = 0
                WHERE userId=$userId and sessionId=$sessionId";
        $conn->query($que);
        //move a to b
        $que = "SELECT * FROM activeRequest
                WHERE requestId='$requestId'";
        $res = $conn->query($que);
        $requestInfo = $res->fetch_assoc();
         
        $que = "INSERT INTO history_".$userId."(
                    requestId,time,location_x,location_y,end_location_x,end_location_y,walkerId,
                    feature,meet_up,emergency,additional_info
                )
                VALUES(
                    ".$requestInfo["requestId"].",
                    '".$requestInfo["time"]."',
                    ".$requestInfo["location_x"].",
                    ".$requestInfo["location_y"].",
                    ".$loc_x.",
                    ".$loc_y.",
                    ".$requestInfo["walkerId"].",
                    '".$requestInfo["feature"]."',
                    '".$requestInfo["meet_up"]."',
                    ".($requestInfo["emergency"]?1:0).",
                    '".$requestInfo["additional_info"]."'
                )";
        $conn->query($que);
        $que = "DELETE FROM activeRequest WHERE requestId=".$requestInfo["requestId"];
        $conn->query($que);
        return '{"code":1}';
                
    }
    //0 - fine, -1 - found but no request, -2- user is not there
    function checkRequest($userId,$sessionId){
        global $conn;
        $que = "SELECT status,currentRequestId FROM userList
                WHERE userId='$userId' and sessionId='$sessionId'";
        $res = $conn->query($que);
        if(empty($res) || $res->num_rows == 0) return [-2];
        $requestId = null;
        $status = null;
        while($row = $res->fetch_assoc()){
            $status= $row["status"];
            $requestId = $row["currentRequestId"];
        }
        if($status == 0) return [-1];
        return [0,$requestId,$status];
    }
    function userRequest($userId,$sessionId){
        global $conn;
        $check= checkRequest($userId,$sessionId);
        if($check[0]== -2) return generateError("User not found");
        else if($check[0]== -1) return generateError("User has no requests",102);
        $requestId=$check[1];
        $status=$check[2];

        $que = "SELECT time,walkerId,requesterId FROM activeRequest
                WHERE requestId=$requestId";
        $res = $conn->query($que);
        $requestRow = $res->fetch_assoc();
        $time = $requestRow["time"];
        $wId = $requestRow["walkerId"];
        $rId = $requestRow["requesterId"];
        $name = "N/A";
        if($status == 2){
            $que = "SELECT first_name,last_name FROM userList 
                    WHERE userId=$wId";
            $res = $conn->query($que);
            $row= $res->fetch_assoc();
            $name = $row["first_name"]." ".$row["last_name"];
        }

        return '{
                "code":1,
                "requestId":'.$requestId.',
                "status":'.$status.',
                "time":"'.$time.'",
                "wId":'.$wId.',
                "rId":'.$rId.',
                "walkerName":"'.$name.'"
            }';
    }
    function getHistory($userId,$sessionId){
        global $conn;
        if(!checkSession($userId,$sessionId,0)){
            return generateError("Login or session has expired");
        }
        $que = "SELECT * FROM history_".$userId;
        $res = $conn->query($que);
        if(empty($res) || $res->num_rows == 0){
            return generateError("Empty History",101);
        }
        $ret = '{"code":1,"History":[';
        $checkZero = 0;
        while($row = $res->fetch_assoc()){
            if($checkZero) $ret .= ",";
            $start_time = date_format(date_create($row["time"]),"M j g:i A");
            $end_time = date_format(date_create($row["endTime"]),"M j g:i A");
            $ret .= '{
                "id":'.$row["requestId"].',
                "time_start":"'.$start_time.'",
                "time_end":"'.$end_time.'",
                "location_start":['.$row["location_x"].','.$row["location_y"].'],
                "location_end":'.'"NA",
                "walker_name":'.$row["walkerId"].',
                "notes":"'.$row["additonalInfo"].'"}';
            $checkZero = 1;
        }
        return $ret."]}";
    }
    function userInfo($userId,$sessionId){
        global $conn;
        if(!checkSession($userId,$sessionId,0)){
            return generateError("Login or session has expired");
        }
        $que = "SELECT * FROM userList
                WHERE userId='$userId' and sessionId='$sessionId'";
        $res = $conn->query($que);
        $userId = null;
        if(empty($res) || $res->num_rows == 0){
            return generateError("User not found");
        }
        $userInfo = $res->fetch_assoc();
        return 
        '{
            "code":1,
            "first_name":"'.$userInfo["first_name"].'",
            "last_name":"'.$userInfo["last_name"].'",
            "phoneNum":"'.$userInfo["phoneNum"].'",
            "email":"'.$userInfo["email"].'",
            "perm":"'.$userInfo["perm"].'",
            "status":"'.$userInfo["status"].'"}';
    }
    function login($email,$password){
        global $conn;
        $que = "SELECT userId FROM userList
                WHERE email='$email' and password='$password'";
        $res = $conn->query($que);
        $userId = null;
        if(empty($res) || $res->num_rows == 0){
            return generateError("User not found");
        }
        while($row = $res->fetch_assoc())
            $userId = $row["userId"];
    
        $newSessionId = rand();
        $que = "UPDATE userList
                SET sessionId=$newSessionId,
                    sessionExpire=DATE_ADD(NOW(),INTERVAL 1 HOUR)
                WHERE email='$email' and password='$password'";
        $conn->query($que);                
        return '{
                "code":1,
                "userId":'.$userId.',
                "sessionId":'.$newSessionId.'}';
    }
    function generateError($msg,$errorCode=0){
        return '{"code":'.$errorCode.',"msg":"'.$msg.'"}';
    }
    function checkSession($userId,$sessionId,$isRequest=false){
        global $conn;
        $que = "SELECT * FROM userList
                WHERE userId='$userId' and sessionId='$sessionId'";
        $res = $conn->query($que);
        $userId = null;
        if(empty($res) || $res->num_rows == 0){
            return ($isRequest?0:generateError("User not found"));
        }
        $userInfo = $res->fetch_assoc();
        if($userInfo["sessionExpire"] < date("Y-m-d H:m:s")){
            return ($isRequest?0:generateError("Session has expired, please login again"));
        }
        return $isRequest?1:'{"code":1}';
    }

    function genNoParamInfo(){
        echo "<pre>
        Welcome to this API

        Preparamters:
            Please provide an API_key with each call
        Possible Parameters with
        'opt': 
            - t >> login
            -----
            Test Call -> returns a string
            -----
            - l >> login
            -----
            Requires a 'username' and 'password'
            Query will return a JSON with 'usercookie' and 'sessionId'
            if valid username and password

            ERRORCODES: 0 - fail to login
            -----
            - u >> user
            -----
            Requires a 'userId' and 'sessionId' from above
            Query will return a JSON with all user info

            ERRORCODES: 0 - fail to find user(aka relogin)
            -----
            - h >> history 
            -----
            Requires a 'userId' and 'sessionId' from above
            Query will return a JSON with all user history

            ERRORCODES: 0 - fail to find user(aka relogin)
                        101 - no history
            -----
            - r >> check request
            -----
            Requires a 'userId' and 'sessionId' from above
            Or use 'requestId'
            Query will return whether or not this user has a request

            ERRORCODES: 0 - fail to find user(aka relogin)
                        102 - no active request
            -----
            - f >> finish request
            -----
            Requires a 'userId' and 'sessionId' from above
            Returns a 'requestId'
            Query will return a success code
            
            ERRORCODES: 0 - fail to find user(aka relogin)
                        103 - no active request
            -----
            - a >> add request
            -----
            Requires parameters as strings:
            'name','phoneNum','features','geoInfo','isEmergency'
            Will check the following parameters:
            'mArea','aInfo'
            Should also include 'userId' if possible to track history
            Returns a 'requestId'

            ERRORCODES: 0 - fail to find user(aka relogin)
                        104 - empty parameters
                        105 - user has an active request
            -----
        </pre>";
    }
?>
