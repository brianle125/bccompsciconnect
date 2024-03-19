import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) { }

  getBoards() {
    return this.http.get<any[]>('http://localhost:8080/', {withCredentials: true })
  }

  getBoard(id: any) {
    return this.http.get<any>(`http://localhost:8080/board/${id}`, {withCredentials: true })
  }

  //probably move this to another service file if needed
  getTopic(boardId: any, topicId: any) {
    return this.http.get<any>(`http://localhost:8080/board/${boardId}/topic/${topicId}`,{withCredentials: true })
  }

  
}
