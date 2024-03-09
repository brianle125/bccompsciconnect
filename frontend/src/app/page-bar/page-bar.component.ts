import { Component, Input } from '@angular/core';
import { PageBarData } from '../page-bar-list/page-bar-list.component';

@Component({
  selector: 'app-page-bar',
  standalone: true,
  imports: [],
  templateUrl: './page-bar.component.html',
  styleUrl: './page-bar.component.css'
})
export class PageBarComponent {
  @Input() data: PageBarData = new PageBarData('text', undefined, 'text', '')
}
