import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicListComponent } from '../topic-list/topic-list.component';
import { TopicCreateComponent } from '../topic-create/topic-create.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { BoardService } from '../board.service';

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
export class BoardComponent implements OnInit {
  // constructor for the route that creates topics
  constructor(private boardService : BoardService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const boardId = Number(routeParams.get('board-id'));

    //Get board title and description for display
    this.boardService.getBoard(boardId)

  }
  
  navigateToTopicCreate() {
    this.router.navigate(['/create-topic']);
  }
}
