import { Component, OnInit } from '@angular/core';
import { PostData, PostListComponent } from '../post-list/post-list.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { arrayBufferToBase64 } from '../helpers';

@Component({
  selector: 'app-user-posts',
  standalone: true,
  imports: [PostListComponent, CommonModule],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.css'
})
export class UserPostsComponent implements OnInit {
  id: Number = NaN
  posts: PostData[] = []
  constructor(private userService: UserService, private postService: PostService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const username = routeParams.get('username');
    this.userService.getUser(username).subscribe((data) => {
      let response = data as any;
      let profilePic = 'assets/user.png'
      if(response[0].profile_image !== null) {
        profilePic = 'data:image/jpg;base64,' + arrayBufferToBase64(response[0].profile_image.data)
      }
      
      //get posts by user id and display
      if(response[0].id !== null) {
        this.postService.getPostsByUserID(response[0].id).subscribe((postsJson) => {
          postsJson.forEach((post) => {
            let postData: PostData = new PostData(post.body, response[0].username, `/user/${response[0].username}`, profilePic, post.created_at, null, null)
            this.posts.push(postData)
          })
        })
      }
      
      
    })
  }
}
