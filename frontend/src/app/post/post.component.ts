import { Component, NgModule } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent {
  onSubmit() {
    throw new Error('Method not implemented.');
  }
  message: string = '';
  newPostBody: any;

  postMessage() {
    // Here you can implement logic to post the message
    console.log('Posted message:', this.message);
    // Optionally, you can reset the message field after posting
    this.message = '';
  }
}
