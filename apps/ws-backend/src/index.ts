import { WebSocketServer } from 'ws';
import { JWT_SECRET } from "@repo/backend-common/config"
import  jwt, { JwtPayload } from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

// interface User {
//   ws: WebSocket,
//   rooms: string[],
//   userId: string
// }

// const users: User[] = [];

// function checkUser(token: string): string | null{
//   try{
//     const decoded = jwt.verify(token, JWT_SECRET as string);

//     if(typeof decoded === "string"){
//       return null;
//     }

//     if(!decoded || !decoded.userId){
//       return null;
//     }

//     return decoded.userId;

//   }catch(e){
//     return null;
//   }
//   return null;
// }

wss.on('connection', function connection(ws, request) {

  const url = request.url;
  if(!url){
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const decoded = jwt.verify(token, JWT_SECRET as string);
  // const userId = checkUser(token);

  if(!decoded || !(decoded as JwtPayload).userId){
    ws.close();
    return null;
  }

  // if(userId == null){
  //   ws.close();
  //   return null;
  // }

  // users.push({
  //   userId,
  //   rooms: [],
  //   ws
  // })

  ws.on('message', function message(data) {
    ws.send('pong');
  });



});