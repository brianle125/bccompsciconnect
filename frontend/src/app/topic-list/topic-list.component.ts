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
export class TopicListComponent {
  @Input() topics: TopicListEntry[] = []
  constructor() {}
}

export class TopicListEntry {
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