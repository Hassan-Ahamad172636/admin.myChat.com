import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  private onlineUsersSubject = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSubject.asObservable();

  constructor() {
    this.socket = io('https://my-chat-backend-production-2bd5.up.railway.app');

    this.socket.on('connect', () => {
      console.log(`🟢 Socket connected: ${this.socket.id}`);
    });

    this.socket.on('disconnect', () => {
      console.log(`🔴 Socket disconnected`);
    });

    // 👇 Listen for online user list from backend
    this.socket.on('online-users', (userIds: string[]) => {
      console.log('👥 Online users received:', userIds);
      this.onlineUsersSubject.next(userIds);
    });
  }

  // 👤 Emit user ID to backend when connected
  sendUserId(userId: string) {
    this.socket.emit('user-connected', userId);
  }

  // 🟢 Online users observable (already done via BehaviorSubject)
  getOnlineUsers(): Observable<string[]> {
    return this.onlineUsers$;
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
