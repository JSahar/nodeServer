var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('port', process.env.PORT || 3000);
var clients = [];

io.on("connection", function (socket) {  //defualt of soclet.io
    var currentUser;
    socket.on("USER_CONNECT", function () {
        console.log("User connected"); //YES server
        for (var i = 0; i < clients.length; i++) { //server should know how many clients are connected
            // the server send msg back that the client is now connected:
            socket.emit("USER_CONNECT", { name: clients[i].name, position: clients[i].position });
            console.log( clients[i].name + "  is connected");
           
        }
    });

    socket.on("PLAY", function (data) {  
        console.log(data);
        console.log("PLAY");//YES
        currentUser = {
            name: data.name,
            position:data.position
        }
        clients.push(currentUser);
        socket.emit("PLAY", currentUser);
        //socket.emit("USER_CONNECTED", currentUser);
        socket.broadcast.emit("USER_CONNECT", currentUser);
    });
    
    socket.on("MOVE", function (data) {  
        
        console.log("MOVE");//YES
        currentUser.position = data.position;
        socket.emit("MOVE", currentUser);
        socket.broadcast.emit("MOVE", currentUser);
        console.log(currentUser.name + " moved to" + currentUser.position);
        
    });
    //disconnecting
    socket.on("disconnect", function () {  //default
        console.log("User disconnected"); //YES
        socket.broadcast.emit("USER_DISCONNECTED", currentUser);
        for (var i = 0; i < clients.length; i++) { //destroy if the client is disconnected
            if (clients[i].name == currentUser.name) {
                console.log("User" + clients[i].name + "disconnected");
                clients.splice(i, 1);
            }
        };
    });
});

server.listen(app.get('port'), function () {
    console.log('---server is running...');
});






