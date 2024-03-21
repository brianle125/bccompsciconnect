import { Component } from '@angular/core';
import { Topic } from './topic.model';
import { TopicService } from '../topic.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-topic-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './topic-create.component.html',
  styleUrl: './topic-create.component.css',
})
export class TopicCreateComponent {
  constructor(private topicService: TopicService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const newTopic: Topic = {
        question: form.value.question,
        boardId: 1, // This should be set based on your app's logic
      };

      this.topicService.createTopic(newTopic).subscribe({
        next: (topic) => {
          console.log('Topic created', topic);
          form.reset(); // Reset the form after successful submission
        },
        error: (error) => {
          console.error('There was an error!', error);
        },
      });
    }
  }
}
