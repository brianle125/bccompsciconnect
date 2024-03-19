import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from '../board.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topic-list.component.html',
  styleUrl: './topic-list.component.css'
})
/**
 * Component to list topics
 */
export class TopicListComponent implements OnInit {
  @Input() topics: TopicListEntry[] = [
    new TopicListEntry('topic 1', 'bob', 1, 1, '2023-12-13 1:00pm', '2023-12-13 1:00pm', '/board/0/topic/0'), 
    new TopicListEntry('topic 1', 'joe', 1, 1, '2023-12-13 1:00pm', '2023-12-13 1:00pm', '/board/0/topic/0')
  ]
  constructor(private boardService: BoardService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const boardId = Number(routeParams.get('board-id'));

    this.boardService.getBoard(boardId).subscribe((data) => {
      let board = data as any
      for(let i = 0; i < board.topics.length; i++) {
        let target = board.topics[i]
        this.boardService.getTopic(boardId, target.id).subscribe((data) => {
          let topic = data as any
          console.log(topic)
          this.topics[i] = new TopicListEntry(target.question, 'user', 1, topic.postCount, target.created_on, target.last_modified, `/board/${boardId}/topic/${target.id}`)
        })
      }
    })
  }
}

class TopicListEntry {
  constructor(
    public title: string,
    public originalPoster: string,
    public views: number,
    public numberOfReplies: number,
    public created: string,
    public lastUpdated: string,
    public link: string
  ) {}
}