import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from './common-strings';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}
  // images
  getImage(userid: any) {
    return this.http.post(`${api}/images/user`, userid, {
      withCredentials: true,
    });
  }
}
