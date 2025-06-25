import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  constructor() {
    // Connect to backend
    this.socket = io('https://my-chat-backend-production-2bd5.up.railway.app');

    this.socket.on('connect', () => {
      console.log(`🟢 Socket connected: ${this.socket.id}`);
    });

    this.socket.on('disconnect', () => {
      console.log(`🔴 Socket disconnected`);
    });
  }

  // 👇 1. Notify backend that user is online
  notifyUserOnline(userId: string) {
    this.socket.emit('userOnline', userId);
  }

  // 👇 2. Subscribe to presence updates from backend
  onUserStatusChange(): Observable<{
    userId: string;
    status: 'online' | 'offline';
  }> {
    return new Observable((subscriber) => {
      this.socket.on('updateUserStatus', (data) => {
        console.log(`⚡ User status update received:`, data);
        subscriber.next(data);
      });
    });
  }

  // Existing functions below
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
