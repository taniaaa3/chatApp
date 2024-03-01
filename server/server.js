const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors());
const http = require("http");
const server = http.createServer(app);
const socket = require("socket.io");
const io = new socket.Server(server,{
    cors: {
        origin: "*"
    }
});

io.on("connection",(Socket)=>{
    console.log(Socket.id);
    Socket.on("newMessage",(data)=>{
        console.log(data);
        Socket.broadcast.emit("all",data)
    })
})

server.listen(3000,()=>{
    console.log("server started on port 3000");
})