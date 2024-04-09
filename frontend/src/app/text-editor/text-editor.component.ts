import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.css'
})
export class TextEditorComponent {
  public static TEXT_INPUT = 'text-input'

  @Input() defaultText: string = ''
  @Output() formSubmitted: EventEmitter<string> = new EventEmitter()
  @Output() previewClicked: EventEmitter<string> = new EventEmitter()
  public form: FormGroup

  constructor() {
    let formControls: any = {}
    formControls[TextEditorComponent.TEXT_INPUT] = new FormControl('', [Validators.required])
      
    this.form = new FormGroup(formControls)
  }

  private getFormText(): string {
    return this.form.controls[TextEditorComponent.TEXT_INPUT].getRawValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if(changes['defaultText'] != undefined) {
      this.form.get(TextEditorComponent.TEXT_INPUT)?.setValue(this.defaultText)
    }
  }

  public onSubmit(val: any): void {
    this.formSubmitted.emit(val[TextEditorComponent.TEXT_INPUT])
  }

  public onPreviewClicked(): void {
    this.previewClicked.emit(this.getFormText())
  }

  public onTextChange(event: any) {
    console.log(event)
  }
}