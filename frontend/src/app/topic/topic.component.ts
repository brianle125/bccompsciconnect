import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from '../board.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css'
})
/**
 * The main page for a topic (ie a post to a board)
 */
export class TopicComponent implements OnInit {
  @Input() topic: any
  @Input() posts: PostData[]
  constructor(private route: ActivatedRoute, private boardService: BoardService) 
  {
    this.posts = []
  }
  ngOnInit(): void {
    //Get target topic from params
    const routeParams = this.route.snapshot.paramMap;
    const boardId = Number(routeParams.get('board-id'));
    const topicId = Number(routeParams.get('topic-id'));
    
    console.log(topicId)
    this.topic = this.boardService.getTopic(boardId, topicId).subscribe((data) => {
      this.topic = data as any;

      //populate topic posts
      for(let i=0; i < this.topic.posts.length; i++) {
        const post = this.topic.posts[i]
        this.posts[i] = new PostData('no img', post.body, post.created_at, post.last_modified);
      }
    })

  }
}

export class PostData {
  constructor(
    public profile: string = 'no image available',
    public body: string = 'text',
    public datePosted: string = 'Date',
    public lastModified: string = 'Date',
  ) {}
}