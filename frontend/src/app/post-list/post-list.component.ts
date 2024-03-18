import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
  @Input() posts: PostData[] = [
    new PostData('message', 'bob', 'link/to/profile','assets/page.png', '2023-12-13 1:00pm', null, null),
    new PostData('message', 'joe', 'link/to/profile', 'assets/page.png', '2023-12-13 1:00pm', '2023-12-13 1:00pm', 'link/to/edit/')
  ]
}

export class PostData {
  constructor(
    public message: string,
    public username: string,
    public profileLink: string,
    public profilePic: string,
    public created: string,
    public edited: string | null,
    public editLink: string | null
  ) {}
}
