import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api } from './common-strings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  constructor(private http: HttpClient) { }

  getAllTopics(boardId: any) {
    return this.http.get(`${api}/board/${boardId}`, {withCredentials:true})
  }

  addTopic(boardID: number, topic: string, createdBy: number, body: string): Observable<any> {
    let reqBody: AddTopicParams = {
      'boardid': boardID,
      'question': topic,
      'created_by': createdBy,
      'body': body
    }
    return this.http.post(`${api}/board/addtopic`, reqBody)
  }
}

interface AddTopicParams {
  boardid:number,
  question:string,
  created_by:number,
  body:string
}