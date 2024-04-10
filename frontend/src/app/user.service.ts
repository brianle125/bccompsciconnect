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

  checkUserExists(username: any): Observable<any> {
    return this.http.get(`${api}/usercheck?name=${username}`, {
      withCredentials: true,
    });
  }

  isLoggedIn(): Observable<any> {
    return this.http.get(`${api}/login`, { withCredentials: true });
  }

  getUser(username: any): Observable<any> {
    return this.http.get(`${api}/user/${username}`, { withCredentials: true });
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${api}/register`, user, {
      withCredentials: true,
    });
  }

  loginUser(user: any): Observable<any> {
    return this.http.post<any>(`${api}/login`, user, {
      observe: 'response',
      withCredentials: true,
    });
  }

  logoutUser(): Observable<any> {
    return this.http.post(`${api}/logout`, null, { withCredentials: true });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${api}/users`, {
      observe: 'response',
      withCredentials: true,
    });
  }

  editUser1(user: any): Observable<any> {
    return this.http.put(`${api}/edituser/`, user, { withCredentials: true });
  }

  deleteUser(id: any): Observable<any> {
    return this.http.post(`${api}/delete`, id, { withCredentials: true });
  }

  //profiles
  editUserProfile(username: any, user: any): Observable<any> {
    return this.http.put(`${api}/user/${username}/editprofile`, user, {
      withCredentials: true,
    });
  }

  uploadUserProfile(image: any): Observable<any> {
    return this.http.post(`${api}/uploadprofile`, image, {
      withCredentials: true,
    });
  }

  getUserProfile(username: any): Observable<any> {
    return this.http.get(`${api}/getprofile/${username}`, {
      withCredentials: true,
    });
  }

  // this will fetch the image directly from the database
  // In user.service.ts
  getUserProfileImage(username: string): Observable<any> {
    return this.http.get(`/api/userimages/${username}`, {withCredentials: true});
  }

  //google auth
  googleAuthUser(user: any): Observable<any> {
    return this.http.post(`${api}/google/`, user, {
      observe: 'response',
      withCredentials: true,
    });
  }
}
