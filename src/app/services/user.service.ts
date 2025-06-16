import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: any = environment.apiUrl;
  modelPath: any = 'user/';
  constructor(private http: HttpClient) {}

  createUser(data: any) {
    return this.http.post(`${this.baseUrl}${this.modelPath}create/`, data);
  }

  getAllUser() {
    return this.http.get(`${this.baseUrl}${this.modelPath}get-all`);
  }

  getById(id: any) {
    return this.http.get(`${this.baseUrl}${this.modelPath}get-by-id/${id}`);
  }

  loginUser(data: any) {
    return this.http.post(`${this.baseUrl}${this.modelPath}login/`, data);
  }

  addFriend(id: any) {
    return this.http.patch(`${this.baseUrl}friends/addFriend`, { userId: id });
  }

  updateProfile(id: any, formData: any) {
    return this.http.put(`${this.baseUrl}${this.modelPath}update/${id}`, formData);
  }
}
