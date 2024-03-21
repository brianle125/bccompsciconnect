import { Component } from '@angular/core';
import { TopicListComponent } from '../topic-list/topic-list.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TopicListComponent, TopBarComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
/**
 * The main page for a board
 */
export class BoardComponent {

}