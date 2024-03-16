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
 * A list of boards for home-page
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

