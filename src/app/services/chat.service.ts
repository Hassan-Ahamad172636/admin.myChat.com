import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  baseUrl: any = environment.apiUrl;
  modelPath: any = 'chat/';
  conversationPath: any = 'conversation/';
  constructor(private http: HttpClient) {}

  send(conversationId: any, message: any) {
    const data = {
      conversationId: conversationId,
      message: message,
    };

    return this.http.post(`${this.baseUrl}${this.modelPath}send`, data);
  }

  getMessages(conversationId: any) {
    return this.http.post(
      `${this.baseUrl}${this.modelPath}get`,
      conversationId
    );
  }

  conversation(data: any) {
    return this.http.post(
      `${this.baseUrl}${this.conversationPath}create/`,
      data
    );
  }
}
