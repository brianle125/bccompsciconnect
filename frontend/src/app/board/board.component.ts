import { Component } from '@angular/core';
import { TopicListComponent } from '../topic-list/topic-list.component';
import { Router } from '@angular/router';
import { TopicCreateComponent } from '../topic-create/topic-create.component';

@Component({
  selector: 'app-board',
  standalone: true,
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
  imports: [TopicListComponent, TopicCreateComponent],
})
/**
 * The main page for a board
 */
export class BoardComponent {
  // constructor for the route that creates topics
  constructor(private router: Router) {}

  navigateToTopicCreate() {
    this.router.navigate(['/create-topic']);
  }
}
