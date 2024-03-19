import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(username: any) {
    return this.http.get(`http://localhost:8080/usercheck?name=${username}`, {withCredentials:true})
  }

  addUser(user: any) {
    return this.http.post<any>(`http://localhost:8080/register`, user, {observe: 'response', withCredentials: true});
  }

  loginUser(user: any) {
    return this.http.post<any>('http://localhost:8080/login', user, {observe: 'response', withCredentials: true});
  }
}
