import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from './common-strings';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  constructor(private http: HttpClient) { }

  getAllTopics(boardId: any) {
    return this.http.get(`${api}/board/${boardId}`, {withCredentials:true})
  }

  addTopic(topic: any) {
    console.log(topic)
    return this.http.post<any>(`${api}/board/${topic.boardId}/addtopic`, topic,  {withCredentials: true});
  }
}
