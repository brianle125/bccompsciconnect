import { Component, OnInit } from '@angular/core';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { FormattedTextComponent } from '../formatted-text/formatted-text.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { PostService } from '../post.service';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [TextEditorComponent, FormattedTextComponent, TopBarComponent],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})

export class EditPostComponent implements OnInit{
  public previewText: string = ''
  public boardID: number | null = null
  public topicID: number | null = null
  public postID: number | null = null
  public originalMessage: string = ''

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private postService: PostService) {}
  ngOnInit(): void {
    let tempBoardID: string | null = this.activatedRoute.snapshot.params['board-id']
    let tempTopicID: string | null = this.activatedRoute.snapshot.params['topic-id']
    let tempPostID: string | null = this.activatedRoute.snapshot.params['post-id']
    

    
    if(tempBoardID == null || tempTopicID == null || tempPostID == null) {
      this.router.navigate(['/'])
      return
    }

    // if(!Number.isNaN(id))
    this.boardID = parseInt(tempBoardID)
    this.topicID = parseInt(tempTopicID)
    this.postID = parseInt(tempBoardID)

    this.postService.getPost(this.boardID, this.topicID, this.postID).subscribe({
      next:(val)=>{this.originalMessage = val.body},
      error:(e)=>{console.log(e)}
    })
    console.log(this)
  }

  public onPreview(text: string): void {
    this.previewText = text
  }

  public onSubmit(text: string): void {
    if(this.topicID != null && this.boardID != null && this.postID != null) {
      this.postService.editPost(this.boardID, this.topicID, this.postID, text).subscribe({
        next:()=>{},
        error:(e)=>{console.log(e)}
      })
    }
  }
}
