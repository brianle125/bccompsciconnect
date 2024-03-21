import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  api = 'http://localhost:8080/api';
  constructor(private http: HttpClient) { }

  getAllTopics(boardId: any) {
    return this.http.get(`${this.api}/board/${boardId}`, {withCredentials:true})
  }

  addTopic(topic: any) {
    console.log(topic)
    return this.http.post<any>(`${this.api}/board/addtopic`, topic, {observe: 'response', withCredentials: true});
  }



}
