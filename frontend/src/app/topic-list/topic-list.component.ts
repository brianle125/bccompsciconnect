import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../board.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topic-list.component.html',
  styleUrl: './topic-list.component.css'
})
export class TopicListComponent implements OnInit {
  board: any
  topics: TopicListEntry[]
  constructor(private route: ActivatedRoute, private boardService: BoardService) 
  {
    this.topics = []
  }


  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const boardId = Number(routeParams.get('board-id'));
  
    console.log(boardId)
    
    this.board = this.boardService.getBoard(boardId).subscribe((data) => {
      this.board = data as any;
      for(let i = 0; i < this.board.topics.length; i++)
      {
        let t = this.board.topics[i]
        let target = this.boardService.getTopic(boardId, t.id).subscribe((data) => {
          let topic = data as any
          this.topics[i] = new TopicListEntry(t.question, t.created_at, t.latest_post, topic.postCount, `/board/${boardId}/topic/${t.id}`)
        })
      }
      console.log(this.topics);
    })
  }
}

class TopicListEntry {
  constructor(
    public question: string = 'Question',
    public created: string = 'Date',
    public latestPost: string = 'Date',
    public replies: Number = 0,
    public goToOnClick: string = '/'
  ) {}
}