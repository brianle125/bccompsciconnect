import { Component } from '@angular/core';
import { PostListComponent } from '../post-list/post-list.component';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-topic',
  standalone: true,
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css',
  imports: [PostListComponent, PostComponent],
})
/**
 * The main page for a topic (ie a post to a board)
 */
export class TopicComponent {}
