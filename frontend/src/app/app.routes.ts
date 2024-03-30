import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { BoardComponent } from './board/board.component';
import { TopicComponent } from './topic/topic.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { CreateTopicComponent } from './create-topic/create-topic.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'board/:board-id', component: BoardComponent },
  { path: 'board/:board-id/topic/:topic-id', component: TopicComponent },
  { path: 'board/:board-id/topic/:topic-id/create-post', component: CreatePostComponent },
  { path: 'board/:board-id/create-topic', component: CreateTopicComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'create-topic', component: CreateTopicComponent },
];
