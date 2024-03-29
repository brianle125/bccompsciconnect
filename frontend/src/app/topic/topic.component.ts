import { Component } from '@angular/core';
import { PostListComponent } from '../post-list/post-list.component';
import { PostCreateComponent } from '../post-create/post-create.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { FormattedTextComponent } from '../formatted-text/formatted-text.component';

@Component({
  selector: 'app-topic',
  standalone: true,
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css',
  imports: [
    PostListComponent,
    PostCreateComponent,
    TopBarComponent,
    FormattedTextComponent,
  ],
})
/**
 * The main page for a topic (ie a post to a board)
 */
export class TopicComponent {}
