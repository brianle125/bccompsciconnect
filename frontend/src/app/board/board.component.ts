import { Component } from '@angular/core';
import { TopicListComponent } from '../topic-list/topic-list.component';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  imports: [TopicListComponent, PostComponent],
})
/**
 * The main page for a board
 */
export class BoardComponent {}
