import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from './common-strings'
import { Observable } from 'rxjs';


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

  getBoards(): Observable<BoardResponse[]> {
    return this.http.get<any[]>(`${api}/boards`, { withCredentials: true }) as Observable<BoardResponse[]>
  }

  getBoard(id: any) {
    return this.http.get<any>(`${api}/board/${id}`, { withCredentials: true })
  }

  addBoard(title: string, description: string, ordering: number) {
    console.log(`${api}/board`)
    this.http.post(`${api}/board`, {'boardTitle': title, 'boardDescription': description, 'ordering': ordering}).subscribe({
      next:(res) => { console.log(res) },
      error:(e) => { console.log(e) }
    })
  }

  addSampleBoards() {
    // for testing
    this.addBoard('Courses', 'Discuss course related problems.', 0)
    this.addBoard('Projects', 'Discuss your code projects.', 1)
    this.addBoard('Questions', 'Ask and answer any CS related questions.', 2)
    this.addBoard('OpenSource', 'Discuss open source projects.', 3)
  }

  //probably move this to another service file if needed
  getTopic(boardId: any, topicId: any) {
    return this.http.get<any>(`${api}/board/${boardId}/topic/${topicId}`,{withCredentials: true })
  }

  
}

export interface BoardResponse {
  title: string,
  description: string,
  id: string,
  ordering: string
}