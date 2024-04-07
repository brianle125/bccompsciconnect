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
  ]
  constructor(private boardService: BoardService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const boardId = Number(routeParams.get('board-id'));

    this.boardService.getBoard(boardId).subscribe((data) => {
      let board = data as any
      let tempTopics: TopicListEntry[] = []
      for(let i = 0; i < board.topics.length; i++) {
        let target = board.topics[i]
        this.boardService.getTopic(boardId, target.id).subscribe((data) => {
          let topic = data as any
          //console.log(topic)
          tempTopics.push(new TopicListEntry(target.question, 'user', 1, topic.postCount, target.created_at, target.last_modified, `/board/${boardId}/topic/${target.id}`))
        })
        this.topics = tempTopics
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