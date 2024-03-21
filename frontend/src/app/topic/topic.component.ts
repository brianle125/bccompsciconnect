import { Component } from '@angular/core';
import { PostListComponent } from '../post-list/post-list.component';
import { FormattedTextComponent } from '../formatted-text/formatted-text.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [PostListComponent, FormattedTextComponent, TopBarComponent],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css',
})
/**
 * The main page for a topic (ie a post to a board)
 */
export class TopicComponent {}
