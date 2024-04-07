import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from './common-strings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // api = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}

<<<<<<< HEAD
  checkUserExists(username: any) {
    return this.http.get(`${api}/usercheck?name=${username}`, {
      withCredentials: true,
    });
  }

  isLoggedIn() {
    return this.http.get(`${api}/login`, { withCredentials: true });
  }

  getUser(username: any) {
    return this.http.get(`${api}/user/${username}`, { withCredentials: true });
  }

  editUserProfile(username: any, user: any) {
    return this.http.put(`${api}/user/${username}/editprofile`, user, {
      withCredentials: true,
    });
  }

  addUser(user: any) {
    return this.http.post<any>(`${api}/register`, user, {
      withCredentials: true,
    });
  }

  loginUser(user: any) {
    return this.http.post<any>(`${api}/login`, user, {
      observe: 'response',
      withCredentials: true,
    });
  }

  logoutUser() {
    console.log('Calling logout');
    return this.http.get(`${api}/logout`, { withCredentials: true });
    return this.http.post(`${api}/logout`, null, { withCredentials: true });
  }

  getUsers() {
    return this.http.get(`${api}/users`, {
      observe: 'response',
      withCredentials: true,
    });
  }

  editUser1(user: any) {
    return this.http.put(`${api}/edituser/`, user, { withCredentials: true });
  }

  deleteUser(id: any) {
    return this.http.post(`${api}/delete`, id, { withCredentials: true });
  }

  uploadUserProfile(image: any) {
    console.log(image.image_type);
    return this.http.post(`${api}/uploadprofile`, image, {
      withCredentials: true,
    });
  }

  getUserProfile(userid: any) {
    return this.http.get(`${api}/getprofile/${userid}`, {
      withCredentials: true,
    });
  }

  //google auth
  googleAuthUser(user: any) {
    return this.http.post(`${api}/google/`, user, {
      observe: 'response',
      withCredentials: true,
    });
=======
  checkUserExists(username: any): Observable<any> {
    return this.http.get(`${api}/usercheck?name=${username}`, {withCredentials:true})
  }

  isLoggedIn(): Observable<any> {
    return this.http.get(`${api}/login`, {withCredentials: true})
  }

  getUser(username: any): Observable<any> {
    return this.http.get(`${api}/user/${username}`, {withCredentials: true})
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${api}/register`, user, {withCredentials: true});
  }

  loginUser(user: any): Observable<any> {
    return this.http.post<any>(`${api}/login`, user, {observe: 'response', withCredentials: true});
  }

  logoutUser(): Observable<any> {
    return this.http.post(`${api}/logout`, null, {withCredentials: true});
  }

  getUsers(): Observable<any> {
    return this.http.get(`${api}/users`, {observe: 'response', withCredentials: true})
  }

  editUser1( user: any): Observable<any> {
    return this.http.put(`${api}/edituser/`, user, {withCredentials: true})
  }

  deleteUser(id: any): Observable<any> {
    return this.http.post(`${api}/delete`, id, {withCredentials: true});
  }

  //profiles
  editUserProfile(username: any, user: any): Observable<any> {
    return this.http.put(`${api}/user/${username}/editprofile`, user, {withCredentials: true})
  }

  uploadUserProfile(image: any): Observable<any> {
    return this.http.post(`${api}/uploadprofile`, image, {withCredentials: true})
  }

  getUserProfile(userid: any): Observable<any> {
    return this.http.get(`${api}/getprofile/${userid}`, {withCredentials: true})
  }

  //google auth
  googleAuthUser(user: any): Observable<any> {
    return this.http.post(`${api}/google/`, user, {observe: 'response', withCredentials: true})
>>>>>>> 2e15c2ac7e265af303d95eaa82d5c8e7fc79b28a
  }
}
