import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from './common-strings'

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  constructor(private http: HttpClient) { 
    // put service in console for debugging
    console.log('injecting BoardService into window')
    let temp: any = window as any
    temp['BoardService'] = this;
  }

  getBoards() {
    return this.http.get<any[]>(`${api}/boards`, {withCredentials: true })
  }

  getBoard(id: any) {
    return this.http.get<any>(`${api}/board/${id}`, {withCredentials: true })
  }

  //probably move this to another service file if needed
  getTopic(boardId: any, topicId: any) {
    return this.http.get<any>(`${api}/board/${boardId}/topic/${topicId}`,{withCredentials: true })
  }

  
}
