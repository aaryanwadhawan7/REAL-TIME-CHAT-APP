import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer ({ port : 8080 });

interface User {
    socket : WebSocket,
    room : string
}

let userCount = 0;
let allSockets : User[] = [];

wss.on ("connection", (socket) => {
     userCount = userCount + 1; 
     console.log ("user connected -> " + userCount);

    socket.on ("message", (message) => {

        // message => {type : "join"....}
        // @ts-ignore
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "join") {

            allSockets.push({
                socket,
                room : parsedMessage.payload.roomId
            })

        }

        if (parsedMessage.type === "chat") {

            let currentUserRoom = null;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket === socket) {
                    currentUserRoom = allSockets[i].room;
                }
            }

            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room === currentUserRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }

            socket.on("close", () => {
                
                let userRoom = null;
                for (let i = 0; i < allSockets.length; i++) {
                    if (allSockets[i].socket === socket) {
                        userRoom = allSockets[i].room;
                    }
                }

                for (let i = 0; i < allSockets.length; i++) {
                    // remove the client from that room
                    // remove the socket from the allSocket
                    if (allSockets[i].socket === socket) {
                        allSockets.splice(i,1);
                    }
                }
                console.log("user disconnected from Room : " + userRoom);
            })
        }
    })
})
