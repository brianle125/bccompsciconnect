import { Component } from '@angular/core';
import { PostData, PostListComponent } from '../post-list/post-list.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { FormattedTextComponent } from '../formatted-text/formatted-text.component';
import { CreatePostComponent } from '../create-post/create-post.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';

@Component({
  selector: 'app-topic',
  standalone: true,
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css',
  imports: [
    PostListComponent,
    TopBarComponent,
    FormattedTextComponent,
  ],
})
/**
 * The main page for a topic (ie a post to a board)
 */
export class TopicComponent {
  private board: number | null = null
  private topic: number | null = null
  public createPostLink: string | null = null
  public posts: PostData[] = []

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private postService: PostService) {}
  ngOnInit(): void {
    let tempBoardID: string | null = this.activatedRoute.snapshot.params['board-id']
    let tempTopicID: string | null = this.activatedRoute.snapshot.params['topic-id']
    
    if(tempBoardID != null && tempTopicID != null) {
      let boardID: number = parseInt(tempBoardID)
      let topicID: number = parseInt(tempTopicID)
      if(!Number.isNaN(boardID) && !Number.isNaN(topicID)) {
        this.board = boardID
        this.topic = topicID
        this.createPostLink = `board/${this.board}/topic/${this.topic}/create-post`
      }
    } else {
      this.router.navigate(['/'])
      return
    }

    if(this.board != null && this.topic != null) {
      this.postService.getPostByTopicID(this.board, this.topic).subscribe({
        next:(res)=>{
          let allPosts: PostData[] = []
          res.posts.forEach((post) => {
            let postData: PostData = new PostData(post.body, post.username, '', '', post.created_at, null, '')

            allPosts.push(new PostData(post.body, post.username, 'assets/user.png', '', post.created_at, null, ''))
          })
          this.posts = allPosts
          console.log(allPosts)
        },
        error:(e)=>{console.log(e)}
      })
    }
    
  }
}
