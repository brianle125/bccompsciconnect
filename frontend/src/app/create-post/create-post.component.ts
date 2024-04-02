import { Component, OnInit } from '@angular/core';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { FormattedTextComponent } from '../formatted-text/formatted-text.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [TextEditorComponent, FormattedTextComponent, TopBarComponent],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit{
  public previewText: string = ''
  public boardID: string = ''
  public topicID: string = ''

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    let tempBoardID: string | null = this.activatedRoute.snapshot.params['board-id']
    let tempTopicID: string | null = this.activatedRoute.snapshot.params['topic-id']
    if(tempBoardID == null || tempTopicID == null) {
      this.router.navigate(['/'])
    } else {
      this.boardID = tempBoardID
      this.topicID = tempTopicID
    }
    console.log(this)
  }

  public onPreview(text: string): void {
    this.previewText = text
  }

  public onSubmit(text: string): void {
    
  }
}
