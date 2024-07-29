const http =require("http")
const PORT=3000;
const express=require("express");
const {Server} =require("socket.io");
const message=require("./socket/message")

const app=express();
const httpServer=http.createServer(app);
const io=new Server(httpServer,{
    cors:{
        origin:"*"
    }
});

app.use(express.json());

app.get("/",(req,res)=>{
    res.json({
        message:"Backend Connected"
    })
})

io.on("connection",(socket)=>{
    console.log(socket.id);
    socket.broadcast.emit("notification","new user connected +"+ socket.id)

    socket.on("disconnect",()=>{
        console.log("disconncted")
    })
    
    socket.on("privateRoomJoin",(data)=>{
        socket.join(data);
        console.log(data+"joined private room")
    })
    socket.on("privateMessage",({roomid,data})=>{
        socket.to(roomid).emit("privateMessage",data)
        console.log({data,roomid})
    })

    socket.on("publicmessage",(data)=>{
        socket.broadcast.emit("publicmessagebackend",data);
        // io.sockets.emit("publicmessagebackend",data);
        console.log({data});
    })

    message(io,socket)
})



httpServer.listen(PORT,()=>{
    console.log("backend connected")
})

