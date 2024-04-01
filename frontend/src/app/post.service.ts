import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from './post-create/post-create.model';
import { api } from './common-strings';

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

  addMessage(message: Message) {
    this.http.post<Message>(this.apiUrl, message).subscribe((response) => {
      console.log(response);
      // Handle response here
    });
  }
}
