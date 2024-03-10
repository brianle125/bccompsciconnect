import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-list.component.html',
  styleUrl: './board-list.component.css'
})
/**
 * For representing a list of pages. Meant to be used to list boards, topics, etc
 */
export class BoardList implements OnInit{
  @Input() pages: PageBarData[] = [new PageBarData(), new PageBarData(), new PageBarData()]

  constructor() {}

  ngOnInit(): void {

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

