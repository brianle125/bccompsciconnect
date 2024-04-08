import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from './common-strings';
import { Observable, ObservedValuesFromArray } from 'rxjs';
import { GetTopicType } from './topic.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = api; // Change to your actual API endpoint
  constructor(private http: HttpClient) {}

  getPosts(username: any) {
    return this.http.get(`${api}/posts`);
  }

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
}

export interface GetAllPostsType {
  postCount: string,
  posts: GetPostType[],
  topic: GetTopicType
}

export interface GetPostType {
  id: number,
  created_by: number,
  topicid: number,
  body: string,
  status: string,
  created_at: string,
  last_modified: string,
  username: string,
  description: string,
  role: string,
  profile_image: string | null
}