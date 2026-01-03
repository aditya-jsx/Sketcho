import { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const connect = async () => {
            const session = await authClient.getSession();
            const token = session?.data?.session.token;

            if (!token) {
                console.error("No auth token found");
                return;
            }

            const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
            
            ws.onopen = () => console.log("Connected to WS");
            setSocket(ws);
        };

        connect();
        return () => socket?.close();
    }, []);

    return socket;
};