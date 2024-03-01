import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import {io} from "socket.io-client";
const socket = io("http://localhost:3000");
import "./App.css"
import ScrollToBottom from 'react-scroll-to-bottom';

const App = () => {
  const [allMessages, setAllMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [username, setUsername] = useState();
  const sendMessage = ()=>{
    if(username && newMessage){
    socket.emit("newMessage",{
      username,
      message: newMessage,
      date: new Date().toLocaleTimeString()
    });
    setAllMessages((messages)=>[...messages, {username, message: newMessage, date: new Date().toLocaleTimeString()}])
    setNewMessage("")
  }
    else if (newMessage && !username){
      toast.error("Username Mnadatory")
    }
    else{
      toast.error("one or more fields empty")
    }
  }
  useEffect(()=>{
    socket.on("all",(data)=>{
      console.log(data);
      setAllMessages((messages)=>[...messages, data])
  })
  },[socket])
  return (
    <div className='w-full h-screen justify-evenly flex-col items-center flex'>
    <h1 className='font-sans text-7xl font-bold text-center'>Group Chat</h1>
    <div className='border flex flex-col justify-between h-[600px] w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 rounded-lg shadow-2xl'>
        <div className='p-2 bg-gray-200 mb-1 font-bold'>
          <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)}} className='bg-transparent' placeholder='Name...' />
        </div>
        <ScrollToBottom className='overflow-y-scroll overflow-x-hidden scrollbar my-2 flex flex-col justify-start items-start h-full'>
          {/* <ScrollToBottom className=''> */}
          {username ? allMessages.map((val,i)=>{ 
            return(
              val.username !== username ? 
              <div className='flex flex-col mb-3 ml-2'>
              <div key={i} className="message-div px-4 py-2  min-w-32 max-w-48 rounded-t-2xl rounded-br-2xl bg-green-300">
              {val.message}
            </div>
            <div className="text-sm font-semibold">
            {`${val.username} - ${val.date}`}
            </div>
            </div>
            :
            <div className='flex flex-col mb-3 w-full'>
            <div key={i} className="message-div mr-2 text-right px-4 py-2 min-w-32 max-w-48 rounded-t-2xl rounded-bl-2xl bg-blue-200 self-end">
            {val.message}
          </div>
          <div className="text-sm font-semibold self-end mr-2">
            {`${val.username} - ${val.date}`}
            </div>
          </div>
            )
            
          }) : ""}
          {/* </ScrollToBottom> */}
        </ScrollToBottom>
        <div className='flex rounded-b-lg flex-row px-2 py-4 justify-evenly bg-gray-300'>
          <input type="text" value={newMessage} onChange={(e)=>{setNewMessage(e.target.value)}} className='border px-2 border-black rounded-lg'/>
          <button onClick={sendMessage} className='border border-black px-4 rounded-lg font-semibold cursor-pointer'>send</button>
        </div>
    </div>
    </div>
  )
}

export default React.memo(App);