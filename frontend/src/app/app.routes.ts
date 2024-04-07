import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { BoardComponent } from './board/board.component';
import { TopicComponent } from './topic/topic.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { CreateTopicComponent } from './create-topic/create-topic.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { PostListComponent } from './post-list/post-list.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { authGuard } from './auth.guard';
import { sessionGuard } from './session.guard';
import { EditPostComponent } from './edit-post/edit-post.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'board/:board-id', component: BoardComponent },
  { path: 'board/:board-id/topic/:topic-id', component: TopicComponent },
  { path: 'board/:board-id/topic/:topic-id/create-post', component: CreatePostComponent },
  { path: 'board/:board-id/topic/:topic-id/post/:post-id/edit-post', component: EditPostComponent },
  { path: 'board/:board-id/create-topic', component: CreateTopicComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'create-topic', component: CreateTopicComponent },
  { path: 'user/:username', component: UserProfileComponent},
  {path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [authGuard]},
  // tentative
  { path: 'user/:username/edit', component: UserEditComponent, canActivate: [sessionGuard]}
];
