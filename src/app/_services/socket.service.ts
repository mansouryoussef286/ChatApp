import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    socket: Socket | undefined;

    constructor() { }

    connectWith(myID: string, id: string, token: string) {
        this.socket = io("http://localhost:3000", {
            query: {
                recieverID: id.toString(),
                senderID: myID,
                token
            },
            extraHeaders: {
                Authorization: `Bearer ${token}`
            },
            autoConnect: true
        });
        return this.socket;
    }

    getSocket() {
        return this.socket;
    }

    emitMessage(message: string, senderID: string, roomID: string) {
        if (this.socket) {
            this.socket.emit('chatMessage', message, senderID, roomID);
        }
    }

    disconnectSocket() {
        this.socket?.disconnect();
    }
}
