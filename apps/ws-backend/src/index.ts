import { WebSocketServer } from 'ws';
import url from 'url';
import { prisma } from "@repo/db";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', async (ws, req) => {
    // extracting token from url
    const parameters = url.parse(req.url || '', true).query;
    const token = parameters.token as string;

    if (!token) {
        ws.send(JSON.stringify({ error: "Unauthorized: No token provided" }));
        ws.close();
        return;
    }

    try {
        // checking the db for the session
        const session = await prisma.session.findUnique({
            where: { token },
            include: { user: true }
        });

        const isExpired = session && new Date() > session.expiresAt;

        if (!session || isExpired) {
            ws.send(JSON.stringify({ error: "Unauthorized: Invalid or expired session" }));
            ws.close();
            return;
        }

        console.log(`User connected: ${session.user.email}`);
        
        (ws as any).userId = session.userId;

        ws.on('message', (data) => {
            console.log(`Received from ${(ws as any).userId}: ${data}`);
        });

    } catch (error) {
        console.error("Auth Error:", error);
        ws.close();
    }
});