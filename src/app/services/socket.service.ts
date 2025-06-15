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

  joinRoom(roomId: string) {
    console.log(`📥 Joining room: ${roomId}`);
    this.socket.emit('joinRoom', roomId);
  }

  leaveRoom(roomId: string) {
    console.log(`📤 Leaving room: ${roomId}`);
    this.socket.emit('leaveRoom', roomId);
  }

  sendMessage(messageData: any) {
    console.log('📨 Sending message via socket:', messageData);
    this.socket.emit('message', messageData);
  }

  onMessage(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('message', (data) => {
        console.log('📬 Message event received from backend:', data);
        subscriber.next(data);
      });
    });
  }
}
