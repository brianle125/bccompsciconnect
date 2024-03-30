import { Component } from '@angular/core';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { TitleAndPost, TopicTextEditorComponent } from '../topic-text-editor/topic-text-editor.component';
import { FormattedTextComponent } from '../formatted-text/formatted-text.component';

@Component({
  selector: 'app-create-topic',
  standalone: true,
  imports: [TopBarComponent, TopicTextEditorComponent, FormattedTextComponent],
  templateUrl: './create-topic.component.html',
  styleUrl: './create-topic.component.css'
})
export class CreateTopicComponent {
  public preview: string  = ''

  public onPreview(text: string): void {
    this.preview = text
  }

  public onSubmit(titleAndPost: TitleAndPost): void {
    console.log(titleAndPost)
  }
}
