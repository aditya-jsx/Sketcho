import { WebSocket, WebSocketServer } from 'ws';
import { JWT_SECRET } from "@repo/backend-common/config"
import  jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@repo/db/client"

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

// const users: User[] = [];
// const rooms = [];

const users: User[] = [];

function checkUser(token: string): string | null{
  try{
    const decoded = jwt.verify(token, JWT_SECRET as string);

    if(typeof decoded === "string"){
      return null;
    }

    if(!decoded || !decoded.userId){
      return null;
    }

    return decoded.userId;

  }catch(e){
    return null;
  }
  return null;
}

wss.on('connection', function connection(ws, request) {

  const url = request.url;
  if(!url){
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if(!userId){
    ws.close();
  }

  if(userId == null){
    ws.close();
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('message', async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if(parsedData.type === "join_room"){
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId)
    }

    if(parsedData.type === "leave_room"){
      const user = users.find(x => x.ws === ws);
      if(!user){
        return;
      }
      // this will remove the room from that specific user, none of the events of this room will go to that user.
      user.rooms = user?.rooms.filter(x => x === parsedData.room);
    }

    if(parsedData.type === "chat"){
      const roomId = parsedData.roomId;
      // TODO:- Now here we have to do some checks that the message isn't too long and it doesn't have something obnoxious written in it.
      const message = parsedData.message;

      // in this for loop, for every user, if they are interested in this particular room then I'll this information to them.
      users.forEach((user)=>{
        if(user.rooms.includes(roomId)){
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }))
        }
      })
      
      await prisma.chat.create({
        data: {
          roomId,
          message,
          userId
        }
      })

      //! beginner approach:- to broadcast the message first and then add it in the DB, the better appraoch will be to push it in a Queue.
    }
  });

});

// todo:- 1) we are not persisting things to the DB 
// todo:- 2) there's no auth so anyone can join any room and they dont need any permission, so we have to make sure that they have to get some permission before joining a room.(someone susbcribed to msgs from room1 and they are sending msgs to room2), need to fix this. 


// todo:- 3) learn about queues and then improve the broadcasting of the message, go through the chess video, ==> you should push it to a queue and then through a pipeline push it to the DB eventually.