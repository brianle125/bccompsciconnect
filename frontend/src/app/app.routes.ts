import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { BoardComponent } from './board/board.component';
import { TopicComponent } from './topic/topic.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { TopicCreateComponent } from './topic-create/topic-create.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { PostListComponent } from './post-list/post-list.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'board/:board-id', component: BoardComponent },
  { path: 'board/:board-id/topic/:topic-id', component: TopicComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'create-topic', component: TopicCreateComponent },
  { path: 'user/:username', component: UserProfileComponent},
  // tentative
  { path: 'user/:username/edit', component: UserEditComponent}
];
