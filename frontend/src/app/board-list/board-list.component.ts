import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { BoardResponse, BoardService } from '../board.service';
import { UserService } from '../user.service';

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
  pinned_pages: PageBarData[] = [];
  loggedIn: boolean = false;
  isAdmin: boolean = false;
  username: string = 'user'

  constructor(private router: Router, private boardService: BoardService, private userService: UserService) {}

  ngOnInit(): void {
    this.boardService.getBoards().subscribe({
      next:(data) => {
        let boards: PageBarData[] = []
        data.forEach((val) => {
          boards.push(new PageBarData(val.title, 'assets/page.png', val.description, `board/${val.id}`, Number.parseInt(val.id), val.pinned))
          if(val.pinned) {
            this.pinned_pages.push(new PageBarData(val.title, 'assets/page.png', val.description, `board/${val.id}`, Number.parseInt(val.id), val.pinned))
          }
        })
        this.pages = boards
        console.log(this.pages)
      }
    })
    this.userService.isLoggedIn().subscribe((data) => {
      let response = data as any
      this.loggedIn = response.loggedIn;
      this.username = response.user;
      this.isAdmin = response.role === 'admin';
      console.log("The user on this page " + this.loggedIn + " is " + this.username)
    });
  }

  newest() {
    this.pages.sort((a, b) => b.order - a.order);
  }

  oldest() {
    this.pages.sort((a, b) => a.order - b.order);
  }

  pin(id: number) {
    console.log("Clicked on " + id);
    const page = this.pages.find(page => page.order === id);
    if (page) {
      this.boardService.setPinned(id, page.pinned).subscribe((data) => {
        let response = data as any
        console.log(response);
      });
      window.location.reload();
    }
  }


}

export class PageBarData {
  constructor(
    public title: string = 'Title',
    public icon: string = 'assets/page.png',
    public description: string = 'Description',
    public goToOnClick: string = '',
    public order: number = 0,
    public pinned: boolean = false
  ) {}
}
