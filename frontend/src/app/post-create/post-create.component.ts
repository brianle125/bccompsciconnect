import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Message } from '../post-create/post-create.model';
import { PostService } from '../post.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent {
  constructor(private route: ActivatedRoute, private postService: PostService) {}

  onSubmit(form: NgForm) {
    const routeParams = this.route.snapshot.paramMap;
    const topicId = Number(routeParams.get('topic-id'));

    if (form.invalid) {
      return;
    }
    const newMessage: Message = {
      body: form.value.body,
      // Assign the other properties as needed
      topicId: topicId,
      userId: 1,
      status: 'active',
    };
    // Log the message object to the console
    console.log(newMessage);
    this.postService.addMessage(newMessage);
    form.resetForm();
  }
}
