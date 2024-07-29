import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import TextArea from './components/TextArea';
// import useSocket from '../useSocket';
import { socket } from '../useSocket';

function App() {
  const[roomid,setroomid]=useState("");
  const[dark,setdark]=useState(false);
  // const socket=useSocket();
  function handle(){
    setdark(!dark);
  }

  function RoomId(){
    const id=uuidv4();
    setroomid(id);
  }
  function Join(){
    socket.emit("privateRoomJoin",roomid);
  }

  useEffect(()=>{
    socket.on("connect",(data)=>{
      console.log("connected", socket.id )
    })

    socket.on("notification",(data)=>{
      console.log(data)

     
    })
   

    return()=>{
      socket.disconnect()
    }
  },[])

  return (
    <>
    <div>
      <div>RoomID:  {roomid}</div>
    </div>
    <button className={` bg-red-400 dark:bg-slate-700`} onClick={RoomId}>create room code</button>
    <input onChange={(e)=>{setroomid(e.target.value)}}>
    </input>
    <button className='bg-orange-500 text-' onClick={Join}>Join</button>
    <TextArea roomid={roomid}/>
    <button onClick={handle}>colour change</button>
      
    </>
  )
}

export default App
