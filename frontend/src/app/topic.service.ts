import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Topic } from './topic-create/topic.model';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  createTopic(newTopic: Topic) {
    throw new Error('Method not implemented.');
  }
  api = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}

  getAllTopics(boardId: any) {
    return this.http.get(`${this.api}/board/${boardId}`, {
      withCredentials: true,
    });
  }

  addTopic(topic: any) {
    console.log(topic);
    return this.http.post<any>(`${this.api}/board/addtopic`, topic, {
      observe: 'response',
      withCredentials: true,
    });
  }
}
