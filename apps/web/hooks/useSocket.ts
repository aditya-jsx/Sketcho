import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket(){
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();

    useEffect(()=>{
        // todo: - here we have to add the token as well, can harcode the token temporarily for checking the backend functionality
        const ws = new WebSocket(`${WS_URL}?token`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, []);


    return {
        socket,
        loading
    }
}