import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { BoardComponent } from './board/board.component';
import { TopicComponent } from './topic/topic.component';

export const routes: Routes = [
    {path:'', component:HomePageComponent},
    {path:'board/:board-id', component:BoardComponent},
    {path:'board/:board-id/topic/:topic-id', component:TopicComponent}
];
