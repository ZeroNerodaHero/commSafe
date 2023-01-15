<?php 
    $servername = "db";
    $database = "comm";
    $username = "root";
    $password = "password";
    $port = "3306";

    $conn = new mysqli($servername, $username, $password,$database,$port);
    if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

    function generateError($msg,$errorCode=0){
        return '{"code":'.$errorCode.',"msg":"'.$msg.'"}';
    }
?>
