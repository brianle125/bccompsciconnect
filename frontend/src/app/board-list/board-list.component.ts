import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { BoardService } from '../board.service';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-board-list',
  standalone: true,
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.css',
  imports: [CommonModule, PostComponent],
})
/**
 * A list of boards for home-page
 */
export class BoardList implements OnInit {
  boards: any[];
  @Input() pages: PageBarData[] = [
    new PageBarData('Test', 'assets/page.png', 'Desc', 'board/0'),
    new PageBarData('Test', 'assets/page.png', 'Desc', 'board/1'),
    new PageBarData('Test', 'assets/page.png', 'Desc', 'board/2'),
  ];

  constructor(private router: Router, private boardService: BoardService) {
    this.boards = [];
  }

  ngOnInit(): void {
    this.boardService.getBoards().subscribe((data) => {
      this.boards = data as any[];
      for (let i = 0; i < this.boards.length; i++) {
        this.pages[i] = new PageBarData(
          this.boards[i].title,
          'assets/page.png',
          this.boards[i].description,
          `board/${this.boards[i].id}`
        );
      }
    });
  }
}

export class PageBarData {
  constructor(
    public title: string = 'Title',
    public icon: string = 'assets/page.png',
    public description: string = 'Description',
    public goToOnClick: string = ''
  ) {}
}
