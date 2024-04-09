import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from './common-strings';
import { Observable, ObservedValuesFromArray } from 'rxjs';
import { GetTopicType } from './topic.service';
import { BoardResponse } from './board.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = api; // Change to your actual API endpoint
  constructor(private http: HttpClient) {}

  getPostByTopicID(boardID: number, topicID:number): Observable<GetAllPostsType> {
    return this.http.get(`${api}/board/${boardID}/topic/${topicID}`) as Observable<GetAllPostsType>
    // return this.http.get(`http://localhost:8080/posts/${topicid}`);
  }

  getPostsByUserID(userID: number) {
    return this.http.get<any[]>(`${api}/posts/${userID}`)
  }

  addPost(boardID: number, topicID:number, message: string): Observable<any> {
    return this.http.post(`${api}/board/${boardID}/topic/${topicID}/add-post`, {text: message}, {withCredentials: true})
  }

  getPost(boardID: number, topicID: number, postID: number): Observable<GetPostType> {
    return this.http.get(`${api}/board/${boardID}/topic/${topicID}/post/${postID}`) as Observable<GetPostType>
  }

  editPost(boardID: number, topicID: number, postID: number, text: string): Observable<any> {
    return this.http.put(`${api}/board/${boardID}/topic/${topicID}/post/${postID}`, {'text': text}) as Observable<any>
  }
}

export interface GetAllPostsType {
  postCount: string,
  posts: GetPostType[],
  topic: GetTopicType,
  board: BoardResponse
}

export interface GetPostType {
  id: number,
  created_by: number,
  topicid: number,
  body: string,
  status: string,
  created_at: string,
  created_at_unix: string,
  last_modified: string,
  last_modified_unix: string,
  username: string,
  description: string,
  role: string,
  profile_image: string | null
}