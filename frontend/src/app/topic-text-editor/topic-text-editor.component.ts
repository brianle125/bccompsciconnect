import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-topic-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './topic-text-editor.component.html',
  styleUrl: './topic-text-editor.component.css'
})

export class TopicTextEditorComponent {
  public static TEXT_INPUT = 'text-input'
  public static TOPIC_TITLE = 'topic-title'

  @Output() formSubmitted: EventEmitter<TitleAndPost> = new EventEmitter()
  @Output() previewClicked: EventEmitter<string> = new EventEmitter()
  public form: FormGroup

  constructor() {
    let formControls: any = {}
    formControls[TopicTextEditorComponent.TEXT_INPUT] = new FormControl('', [Validators.required])
    formControls[TopicTextEditorComponent.TOPIC_TITLE] = new FormControl('', [Validators.required])
      
    this.form = new FormGroup(formControls)
  }

  private getFormText(): string {
    return this.form.controls[TopicTextEditorComponent.TEXT_INPUT].getRawValue();
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   console.log(changes)
  //   if(changes['defaultText'] != undefined) {
  //     this.form.get(RecipeFormComponent.RECIPE_NAME)?.setValue(this.defaultText.name)
  //     this.form.get(RecipeFormComponent.RECIPE_INGREDIENTS)?.setValue(this.defaultText.ingredients)
  //     this.form.get(RecipeFormComponent.RECIPE_INSTRUCTIONS)?.setValue(this.defaultText.instructions)
  //   }
  // }

  public onSubmit(val: any): void {
    this.formSubmitted.emit(new TitleAndPost(val[TopicTextEditorComponent.TOPIC_TITLE], val[TopicTextEditorComponent.TEXT_INPUT]))
  }

  public onPreviewClicked(): void {
    this.previewClicked.emit(this.getFormText())
  }
}

export class TitleAndPost {
  constructor(
    public title: string,
    public post: string
  ) {}
}