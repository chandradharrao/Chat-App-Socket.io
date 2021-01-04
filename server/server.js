const path = require("path");
const express = require('express');
const http = require("http");
const socketio = require("socket.io");
const bodyParser = require("body-parser");
const PORT = 8080;

const app = express();
const server = http.createServer(app);
//create socketio instance attached to the http server
const io = socketio(server);

app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'client')));

app.get("/login",(req,res)=>{
    res.sendFile(__dirname + "/client/login.html");
})

//when client conects
io.on("connection",(socket)=>{
    var user_details = {username:null,roomName:null};

    //manage input from form
    socket.on("login",(data)=>{
        user_details.username = data.username;
        user_details.roomName = data.roomName;
        console.log(user_details);
        
        //redirect the user to chat page
        socket.emit("redirection",{dest:"/index.html",user_details:user_details});
        //Greet the user
        socket.emit("message",{message:`Hello ${user_details.username}!`});

        //inform the other clients except the client who joined
        socket.broadcast.emit("message",{message:`${user_details.username} joined the chat!`});

        //listen for chat data event
        socket.on("chat-typed",(data)=>{
            io.sockets.emit("broadcast",{username:user_details.username,message:data.chat_content,dateTime:data.chat_dateTime})
        });

        socket.on("disconnect",()=>{
            //inform the other users
            socket.broadcast.emit("message",{message:`${user_details.username} left the chat!`});
        });
    })
})

server.listen(PORT,()=>{
    console.log(`Server Running on PORT ${PORT}`);
});
