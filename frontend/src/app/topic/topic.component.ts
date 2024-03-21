import { Component, OnInit } from '@angular/core';
import { PostListComponent } from '../post-list/post-list.component';
import { TopicService } from '../topic.service';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [PostListComponent],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css'
})
/**
 * The main page for a topic (ie a post to a board)
 */
export class TopicComponent implements OnInit {
  topics: any[];
  constructor(private ts: TopicService) {
    this.topics = [];
  }

  ngOnInit(): void {
      this.ts.getAllTopics(1).subscribe((data) => {
        console.log(data as any[]);
      })
  }
}