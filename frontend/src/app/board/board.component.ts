import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicListComponent } from '../topic-list/topic-list.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [TopicListComponent, TopBarComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
/**
 * The main page for a board
 */
export class BoardComponent implements OnInit {
  public board: number | null = null
  public createTopicLink: string | null = null;

  // constructor for the route that creates topics
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void {
    let tempBoardID: string | null = this.activatedRoute.snapshot.params['board-id']
    if(tempBoardID != null) {
      let id: number = parseInt(tempBoardID)
      if(!Number.isNaN(id)) {
        this.board = id
        this.createTopicLink = `board/${id}/create-topic`

      }
    } else {
      this.router.navigate(['/'])
      
    }
  }



  // navigateToTopicCreate() {
  //   this.router.navigate(['/create-topic']);
  // }
}
