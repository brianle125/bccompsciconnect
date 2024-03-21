import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TopicListComponent } from '../topic-list/topic-list.component';
import { TopicCreateComponent } from '../topic-create/topic-create.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TopicListComponent, TopBarComponent, TopicCreateComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
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
