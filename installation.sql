DROP DATABASE comm
CREATE DATABASE comm
USE comm

CREATE TABLE userList(
    userId int,
    sessionId int,
    sessionExpire timeStamp,
    first_name varchar(60),
    last_name varchar(60),
    
    username varchar(60),
    password varchar(60),
    email varchar(160),
    phoneNum varchar(32),
    
    accountPerm int,
    
    currentRequestId int
    status int
)
INSERT INTO userList(userId,first_name,last_name,username,password,email,phoneNum,accountPerm)
    VALUES(123456,"TEST","TEST","TEST","TEST","TEST@TEST.TEST","123-567-9012",0);
CREATE TABLE history_123456(
    requestId int,
    time timestamp,
    location_x double,
    location_y double,
    feature varchar(800),
    meet_up varchar(800)
    emergency bool,
    additional_info varchar(800) 
}
    
