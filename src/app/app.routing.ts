import { RouterModule, Routes } from '@angular/router';
import { Detail } from './../pages/detail/detail';
import { Chat } from './../pages/chat/chat';
import { Missions } from './../pages/missions/missions';
import { Login } from './../pages/login/login';
import { Video } from '../pages/video/video';
export const ROUTES: Routes = [
  { path: '',      component: Login },
  { path: 'Login', component: Login },
  { path: 'Chat',  component: Chat },
  { path: 'Missions', component: Missions },
  { path: 'Detail', component: Detail },
  { path: 'Video', component: Video },
];

