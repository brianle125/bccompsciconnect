import { Component } from '@angular/core';
import { PostListComponent } from '../post-list/post-list.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { FormattedTextComponent } from '../formatted-text/formatted-text.component';
import { CreatePostComponent } from '../create-post/create-post.component';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}
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
    }
  }
}
