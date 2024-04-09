import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { FormattedTextComponent } from '../formatted-text/formatted-text.component';
import { api } from '../common-strings';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormattedTextComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
  api: string = api;
  @Input() public posts: PostData[] = [
    new PostData('message', 'bob', 'link/to/profile','assets/page.png', '2023-12-13 1:00pm', null, null),
    new PostData('message', 'joe', 'link/to/profile', 'assets/page.png', '2023-12-13 1:00pm', '2023-12-13 1:00pm', 'link/to/edit/')
  ]

  constructor(private postService: PostService) {}



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
