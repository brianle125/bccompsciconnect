import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BoardService } from '../board.service';
import { CommonModule } from '@angular/common';
import { TopicListComponent } from '../topic-list/topic-list.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, RouterLink, TopicListComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
/**
 * The main page for a board
 */
export class BoardComponent implements OnInit {
  @Input() board: any
  constructor(private route: ActivatedRoute, private boardService: BoardService) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const boardId = Number(routeParams.get('board-id'));
    console.log(boardId)

    
    this.board = this.boardService.getBoard(boardId).subscribe((data) => {
      this.board = data as any;
    })
  }
}
