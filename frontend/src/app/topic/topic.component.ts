import { Component, OnInit } from '@angular/core';
import { PostListComponent } from '../post-list/post-list.component';
import { TopicService } from '../topic.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [PostListComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css'
})
/**
 * The main page for a topic (ie a post to a board)
 */
export class TopicComponent implements OnInit {
  topics: any[];
  form: FormGroup;
  constructor(private ts: TopicService, private router:Router) {
    this.topics = [];
    let formControls = {
      boardid: new FormControl('',[ Validators.required, Validators.nullValidator]),
      question: new FormControl('',[ Validators.required, Validators.nullValidator])
    }
    this.form = new FormGroup(formControls);
  }

  ngOnInit(): void {
      this.ts.getAllTopics(1).subscribe((data) => {
        console.log(data as any[]);
        console.log(Object.values(data))
        this.topics = Object.values(data);
      })
  }

  onSubmit() {
    console.log(this.form.value)
    this.ts.addTopic(this.form.value).subscribe((data) => {
      this.router.navigate(['/']);
    })
  }
}