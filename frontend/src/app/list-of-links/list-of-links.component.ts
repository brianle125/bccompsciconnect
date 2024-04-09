import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-of-links',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-of-links.component.html',
  styleUrl: './list-of-links.component.css'
})
/**
 * Display a list of links ie "home > board > topic"
 */
export class ListOfLinksComponent {
  @Input() links: LinkData[] = [new LinkData('a', '/'), new LinkData('b', '/')]
}

export class LinkData {
  constructor(
    public name: string,
    public link: string
  ) {}
}