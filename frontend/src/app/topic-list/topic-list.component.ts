import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from '../board.service';
import { ActivatedRoute } from '@angular/router';
import { unixTimeStampStringToDate } from '../helpers';

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
  public boardTitle: string = ''
  public description: string = ''
  @Input() topics: TopicListEntry[] = []
  constructor(private boardService: BoardService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const boardId = Number(routeParams.get('board-id'));

    this.boardService.getBoard(boardId).subscribe((data) => {
      console.log(data)
      let board = data.board
      this.boardTitle = board.title
      this.description = board.description
      let tempTopics: TopicListEntry[] = []
      for(let i = 0; i < data.topics.length; i++) {
        let target = data.topics[i]
        tempTopics.push(new TopicListEntry(
          target.question, 
          target.username, 
          0, 
          0, 
          unixTimeStampStringToDate(target.created_at_unix), 
          unixTimeStampStringToDate(target.latest_post_unix), 
          `/board/${boardId}/topic/${target.id}`
        ))
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
    public created: Date,
    public lastUpdated: Date,
    public link: string
  ) {}
}