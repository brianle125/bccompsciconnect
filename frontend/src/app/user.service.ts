import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from './common-strings';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // api = 'http://localhost:8080/api';
  constructor(private http: HttpClient) { }

  checkUserExists(username: any) {
    return this.http.get(`${api}/usercheck?name=${username}`, {withCredentials:true})
  }

  isLoggedIn() {
    return this.http.get(`${api}/login`, {withCredentials: true})
  }

  getUser(username: any) {
    return this.http.get(`${api}/user/${username}`, {withCredentials: true})
  }

  editUser(username: any, user: any) {
    return this.http.put(`${api}/user/${username}`, user, {withCredentials: true})
  }

  addUser(user: any) {
    return this.http.post<any>(`${api}/register`, user, {withCredentials: true});
  }

  loginUser(user: any) {
    return this.http.post<any>(`${api}/login`, user, {observe: 'response', withCredentials: true});
  }

  logoutUser() {
    return this.http.get(`${api}/logout`, {withCredentials: true})
  }

  //google auth
  googleAuthUser() {
    return this.http.get(`${api}/google/`, {withCredentials: true})
  }
}
