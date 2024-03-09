import { Component, Input, OnInit } from '@angular/core';
import { PageBarComponent } from '../page-bar/page-bar.component';
import { CommonModule } from '@angular/common'
@Component({
  selector: 'app-page-bar-list',
  standalone: true,
  imports: [PageBarComponent, CommonModule],
  templateUrl: './page-bar-list.component.html',
  styleUrl: './page-bar-list.component.css'
})
/**
 * For representing a list of pages. Meant to be used to list boards, topics, etc
 */
export class PageBarListComponent implements OnInit{
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

