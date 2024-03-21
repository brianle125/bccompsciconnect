import { Component } from '@angular/core';
import { Topic } from './topic.model';
import { TopicService } from '../topic.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-topic-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './topic-create.component.html',
  styleUrl: './topic-create.component.css',
})
export class TopicCreateComponent {
  constructor(private topicService: TopicService, private route: ActivatedRoute, private router: Router) {}

  onSubmit(form: NgForm) {
    const routeParams = this.route.snapshot.paramMap;
    const boardId = Number(routeParams.get('board-id'));


    if (form.valid) {
      const newTopic: Topic = {
        question: form.value.question,
        boardId: boardId, // This should be set based on your app's logic
      };

      this.topicService.addTopic(newTopic).subscribe({
        next: (topic) => {
          console.log('Topic created', topic);
        },
        error: (error) => {
          console.error('There was an error!', error);
        },
      });
    }
  }
}
