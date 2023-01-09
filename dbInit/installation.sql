USE comm;
CREATE TABLE userList(
    userId int,
    sessionId int,
    sessionExpire timeStamp,
    first_name varchar(60),
    last_name varchar(60),
    
    password varchar(60),
    email varchar(160),
    phoneNum varchar(32),
    
    accountPerm int,
    
    currentRequestId int,
    status int
);
INSERT INTO userList(userId,first_name,last_name,password,email,phoneNum,accountPerm)
    VALUES(123456,"TEST","TEST","TEST","TEST@TEST.TEST","123-567-9012",0);
CREATE TABLE history_123456(
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
);

CREATE TABLE activeRequest(
    requestId int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    status int DEFAULT 0,
    statusNotes varchar(800),
    walkerId int DEFAULT 0,
    time timeStamp DEFAULT CURRENT_TIMESTAMP,
    name varchar(120),
    phoneNum varchar(32),
    location_x double,
    location_y double,
    requesterId int,
    feature varchar(800),
    emergency bool,
    meet_up varchar(800),
    additional_info varchar(800) 
);
