import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// https://stackoverflow.com/questions/44939878/dynamically-adding-and-removing-components-in-angular

@Component({
  selector: 'app-formatted-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './formatted-text.component.html',
  styleUrl: './formatted-text.component.css'
})
export class FormattedTextComponent {
  @Input() text: string = `
    text
    <div>text</div>
    super <span>special</span> text
  `

  constructor() {
    let doc: Document = new DOMParser().parseFromString(this.text, "text/xml");
    console.log(doc)
  }
}
