import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: any = environment.apiUrl;
  modelPath: any = "user/";
  constructor(private http: HttpClient) {}

  createUser(data: any) {
    return this.http.post(`${this.baseUrl}${this.modelPath}create/`, data);
  }

  getAllUser() {
    return this.http.get(`${this.baseUrl}${this.modelPath}get-all`);
  }
  
  loginUser(data: any) {
    return this.http.post(`${this.baseUrl}${this.modelPath}login/`, data);
  };
}
