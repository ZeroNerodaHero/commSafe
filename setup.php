<?php
    $que = "CREATE TABLE userList(
                userId int,
                sessionId int,
                sessionExpire timeStamp,
                first_name varchar(60),
                last_name varchar(60),
                username varchar(60),
                password varchar(60),
                email varchar(200),
                phoneNum varchar(16),
                accountPerm int,
                currentRequestId int,
                
                status int)"; 
    $que = "CREATE TABLE
            ";
                  
    //example history table
    $que = "CREATE TABLE history_{id}(
                requestId int
                time timestamp,
                location ,
                walkerId,
                features,
                meet_up,
                emergency,
                additional_info
            )";
    $que = "CREATE TABLE activeRequest(
                requestId int
                * status( 0 1 2 3 4 ) default 0
                * statusNotes deafult ""
                * walkerId default 0 (changes only when status = 1)
                time timestamp,
                name,
                phoneNum
                location ,
                requesterId
                features
                emergency
                meet_up
                additional_info
            )
                
?>
