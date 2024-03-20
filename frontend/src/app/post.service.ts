import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from './post-create/post-create.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://yourbackendapi.com/messages'; // Change to your actual API endpoint
  constructor(private http: HttpClient) {}

  addMessage(message: Message) {
    this.http.post<Message>(this.apiUrl, message).subscribe((response) => {
      console.log(response);
      // Handle response here
    });
  }
}
