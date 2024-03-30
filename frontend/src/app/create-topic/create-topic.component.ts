import { Component, OnInit } from '@angular/core';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { TitleAndPost, TopicTextEditorComponent } from '../topic-text-editor/topic-text-editor.component';
import { FormattedTextComponent } from '../formatted-text/formatted-text.component';
import { TopicService } from '../topic.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-topic',
  standalone: true,
  imports: [TopBarComponent, TopicTextEditorComponent, FormattedTextComponent],
  templateUrl: './create-topic.component.html',
  styleUrl: './create-topic.component.css'
})
export class CreateTopicComponent implements OnInit{
  public preview: string  = ''
  private board: number | null = null

  constructor(private topicService: TopicService, private activatedRoute: ActivatedRoute, private router: Router) {}
  
  ngOnInit(): void {
    let tempBoardID: string | null = this.activatedRoute.snapshot.params['board-id']
    if(tempBoardID != null) {
      let id: number = parseInt(tempBoardID)
      if(!Number.isNaN(id)) {
        this.board = id
      }
    } else {
      this.router.navigate(['/'])
      
    }
  }

  public onPreview(text: string): void {
    this.preview = text
  }

  public onSubmit(titleAndPost: TitleAndPost): void {
    console.log(titleAndPost)
    // TODO: actually read the user
    if(this.board != null) {
      this.topicService.addTopic(this.board, titleAndPost.title, 1, titleAndPost.post)      
    }
  }
}
