import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000');

    this.socket.on('connect', () => {
    });

    this.socket.on('disconnect', (reason) => {
    });
  }

  sendMessage(data: any) {
    this.socket.emit('message', data);
  }

  onMessage(): Observable<any> {

    return new Observable((observer) => {
      this.socket.on('message', (msg) => {
        observer.next(msg);
      });

      return () => {
        this.socket.off('message');
      };
    });
  }

  joinRoom(roomId: string) {
    this.socket.emit('joinRoom', roomId);
  }

  leaveRoom(roomId: string) {
    this.socket.emit('leaveRoom', roomId);
  }
}
