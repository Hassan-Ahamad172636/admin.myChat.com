// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  constructor() {
    this.socket = io('http://localhost:3001');

    this.socket.on('connect', () => {
      console.log(`🟢 Socket connected: ${this.socket.id}`);
    });

    this.socket.on('disconnect', () => {
      console.log(`🔴 Socket disconnected`);
    });
  }

  // ✅ Emit user ID when user connects
  emitUserConnected(userId: string) {
    if (userId) {
      console.log('📡 Emitting userConnected:', userId);
      this.socket.emit('userConnected', userId);
    }
  }

  // ✅ Listen for list of online users
  listenOnlineUsers(): Observable<string[]> {
    return new Observable((subscriber) => {
      this.socket.on('onlineUsers', (data: string[]) => {
        console.log('🟢 Online users list received:', data);
        subscriber.next(data);
      });
    });
  }

  // ✅ Join chat room
  joinRoom(roomId: string) {
    console.log(`📥 Joining room: ${roomId}`);
    this.socket.emit('joinRoom', roomId);
  }

  // ✅ Leave chat room
  leaveRoom(roomId: string) {
    console.log(`📤 Leaving room: ${roomId}`);
    this.socket.emit('leaveRoom', roomId);
  }

  // ✅ Send chat message
  sendMessage(messageData: { roomId: string; message: string; sender: string }) {
    console.log('📨 Sending message via socket:', messageData);
    this.socket.emit('sendMessage', messageData); // ✅ correct event name
  }

  // ✅ Listen for new messages
  onMessage(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('receiveMessage', (data) => {
        console.log('📬 Message received from server:', data);
        subscriber.next(data);
      });
    });
  }
}
