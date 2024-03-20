import { Component } from '@angular/core';
import { TopicListComponent } from '../topic-list/topic-list.component';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  imports: [TopicListComponent],
})
/**
 * The main page for a board
 */
export class BoardComponent {}
