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
  @Input() public posts: PostData[] = []

  constructor(private postService: PostService) {}

}

export class PostData {
  constructor(
    public message: string,
    public username: string,
    public profileLink: string,
    public profilePic: string,
    public created: Date,
    public edited: Date | null,
    public editLink: string | null
  ) {}
}
