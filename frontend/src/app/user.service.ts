import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api = 'https://bccompsciconnect-server-4w7ddycrna-uc.a.run.app/api';
  constructor(private http: HttpClient) { }

  getUser(username: any) {
    return this.http.get(`${this.api}/usercheck?name=${username}`, {withCredentials:true})
  }

  addUser(user: any) {
    return this.http.post<any>(`${this.api}/register`, user, {observe: 'response', withCredentials: true});
  }

  loginUser(user: any) {
    return this.http.post<any>(`${this.api}/login`, user, {observe: 'response', withCredentials: true});
  }
}
