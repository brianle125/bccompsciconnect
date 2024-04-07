import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from './common-strings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = api; // Change to your actual API endpoint
  constructor(private http: HttpClient) {}

  getPosts(username: any) {
    return this.http.get(`${api}/posts`);
  }

  getPostBytopicid(topicid: any) {
    return this.http.get(`http://localhost:8080/posts/${topicid}`);
  }

  addPost(boardID: number, topicID:number, message: string): Observable<any> {
    return this.http.post(`${api}/board/${boardID}/topic/${topicID}/add-post`, {text: message}, {withCredentials: true})
  }
}
