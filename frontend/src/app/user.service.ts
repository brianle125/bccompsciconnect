import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from './common-strings';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // api = 'http://localhost:8080/api';
  constructor(private http: HttpClient) { }

  getUser(username: any) {
    return this.http.get(`${api}/usercheck?name=${username}`, {withCredentials:true})
  }

  addUser(user: any) {
    return this.http.post<any>(`${api}/register`, user, {withCredentials: true});
  }

  loginUser(user: any) {
    return this.http.post<any>(`${api}/login`, user, {observe: 'response', withCredentials: true});
  }
}
