import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from './topic-create/topic.model';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private apiUrl = 'http://yourapiurl.com/topics'; // Update with your actual API endpoint

  constructor(private http: HttpClient) {}

  createTopic(topic: Topic): Observable<Topic> {
    return this.http.post<Topic>(this.apiUrl, topic);
  }
}
