"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
    messages,
    id
}: {
    messages: {message: string}[];
    id: string
}){
    const [chats, setChats] = useState(messages);
    const {socket, loading} = useSocket();
    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(()=>{
        if(socket && !loading){


            // todo: this should be in a different useEffect
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }));

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if(parsedData.type === "chat"){
                    setChats(c => [...c, {message: parsedData.message}]  )
                }
            }
        }

        // return () => {
        //     socket?.close()
        // }


        // todo: a separate hook with socket and id as dependency to manage socket.send
    }, [socket, loading, id])


    return <div>
        {chats.map(m => <div>{m.message}</div>)}

        <input 
            type="text"
            onChange={(e)=>{setCurrentMessage(e.target.value)}}
        />

        <button
            onClick={()=>{
                socket?.send(JSON.stringify({
                    type: "chat",
                    roomId: id,
                    messages: currentMessage
                }))
            }}   
        >

        </button>
    </div>
}


// todo: check for the roomId as well, whether this msg is a part of this roomId or not