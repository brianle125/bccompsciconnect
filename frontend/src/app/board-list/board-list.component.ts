import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { BoardResponse, BoardService } from '../board.service';

@Component({
  selector: 'app-board-list',
  standalone: true,
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.css',
  imports: [CommonModule],
})
/**
 * A list of boards for home-page
 */
export class BoardList implements OnInit{
  @Input() pages: PageBarData[] = [
    new PageBarData('Test', 'assets/page.png', 'Desc', 'board/0'),
    new PageBarData('Test', 'assets/page.png', 'Desc', 'board/1'),
    new PageBarData('Test', 'assets/page.png', 'Desc', 'board/2'),
  ];

  constructor(private router: Router, private boardService: BoardService) {}

  ngOnInit(): void {
    this.boardService.getBoards().subscribe({
      next:(data) => {
        let boards: PageBarData[] = []
        data.forEach((val) => {
          boards.push(new PageBarData(val.title, 'assets/page.png', val.description, `board/${val.id}`, Number.parseInt(val.ordering)))
        })
        boards.sort((a: PageBarData, b: PageBarData) => {
          if(a.order < b.order) {
            return -1
          } else if(a.order > b.order) {
            return 1
          } else {
            return 0
          }
        })
        this.pages = boards
      }
    })
  }
}

export class PageBarData {
  constructor(
    public title: string = 'Title',
    public icon: string = 'assets/page.png',
    public description: string = 'Description',
    public goToOnClick: string = '',
    public order: number = 0
  ) {}
}
