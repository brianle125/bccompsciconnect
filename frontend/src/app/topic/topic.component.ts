import { Component } from '@angular/core';
import { PostData, PostListComponent } from '../post-list/post-list.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { FormattedTextComponent } from '../formatted-text/formatted-text.component';
import { CreatePostComponent } from '../create-post/create-post.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { forkJoin } from 'rxjs';
import { UserService } from '../user.service';
import { unixTimeStampStringToDate } from '../helpers';
import { LinkData, ListOfLinksComponent } from '../list-of-links/list-of-links.component';
import { CommonModule } from '@angular/common';
import { api } from '../common-strings';

@Component({
  selector: 'app-topic',
  standalone: true,
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css',
  imports: [
    CommonModule,
    PostListComponent,
    TopBarComponent,
    FormattedTextComponent,
    ListOfLinksComponent
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
  public navLinks: LinkData[] = []
  public loggedIn: boolean = false

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private postService: PostService, private userService: UserService) {}
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

    // get posts to display
    if(this.board != null && this.topic != null) {
      forkJoin({
        posts: this.postService.getPostByTopicID(this.board, this.topic),
        user: this.userService.isLoggedIn()
      }).subscribe((res) => {
        // set loggedIn
        this.loggedIn = res.user.loggedIn

        // create list of links
        console.log(res)
        this.navLinks = [
          new LinkData('BcCompSciConnect', '/home'), 
          new LinkData(res.posts.board.title, `board/${this.board}`),
          new LinkData(res.posts.topic.question, `board/${this.board}/topic/${this.topic}`)
        ]

        // read in posts
        let userID: number | null = null
        if(res.user.loggedIn) {
          userID = res.user.id
        }
        let allPosts: PostData[] = []
          res.posts.posts.forEach((post) => {
            let postData: PostData = new PostData(
              post.body,  
              post.username,  
              `/user/${post.username}`,  
              `${api}/userimages/${post.username}`, 
              new Date(post.created_at),
              null,  
              null
            )
            if(userID != null && post.user_id == userID) {
              postData.editLink = `board/${this.board}/topic/${this.topic}/post/${post.id}/edit-post`
            }
            if(Math.abs(parseFloat(post.last_modified_unix) - parseFloat(post.created_at_unix)) > 5) {
              postData.edited = new Date(post.last_modified)
            }
            allPosts.push(postData)
          })
          this.posts = allPosts
         
      })
    }
    
  }
}
