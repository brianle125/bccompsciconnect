import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  addTopic(boardID: number, topic: string, body: string): Observable<any> {
    let reqBody: AddTopicParams = {
      'question': topic,
      'body': body
    }

    // const headers = new HttpHeaders({
    //   'Cookie': `session=${cookieValue}`
    // });

    console.log(document.cookie)
    return this.http.post(`${api}/board/${boardID}/add-topic`, reqBody, {withCredentials: true})
  }
}

interface AddTopicParams {
  question:string,
  body:string
}