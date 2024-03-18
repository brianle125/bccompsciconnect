import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

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
  @Input() topics: TopicListEntry[] = [
    new TopicListEntry('topic 1', 'bob', 1, 1, '2023-12-13 1:00pm', '2023-12-13 1:00pm', '/board/0/topic/0'), 
    new TopicListEntry('topic 1', 'joe', 1, 1, '2023-12-13 1:00pm', '2023-12-13 1:00pm', '/board/0/topic/0')
  ]
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