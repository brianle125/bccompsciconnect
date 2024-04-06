import { Component, OnInit } from '@angular/core';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { FormattedTextComponent } from '../formatted-text/formatted-text.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { PostService } from '../post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [TextEditorComponent, FormattedTextComponent, TopBarComponent],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit{
  public previewText: string = ''
  public boardID: number | null = null
  public topicID: number | null = null

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private postService: PostService) {}
  ngOnInit(): void {
    let tempBoardID: string | null = this.activatedRoute.snapshot.params['board-id']
    let tempTopicID: string | null = this.activatedRoute.snapshot.params['topic-id']
    if(tempBoardID == null || tempTopicID == null) {
      this.router.navigate(['/'])
    } else {
      // if(!Number.isNaN(id))
      this.boardID = parseInt(tempBoardID)
      this.topicID = parseInt(tempTopicID)
    }
    console.log(this)
  }

  public onPreview(text: string): void {
    this.previewText = text
  }

  public onSubmit(text: string): void {
    if(this.topicID != null && this.boardID != null) {
      this.postService.addPost(this.boardID, this.topicID, text);
    }
  }
}
