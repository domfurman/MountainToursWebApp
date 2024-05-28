import { Routes } from '@angular/router';
import {authenticationGuard} from "./core/guard/authentication.guard";
import {HomeComponent} from "./shared/components/home/home.component";
import {LoginComponent} from "./shared/components/login/login.component";

export const routes: Routes = [
  {path: '', canActivate: [authenticationGuard], children: [
      {path: 'home', component: HomeComponent},
      {path: 'login', component: LoginComponent},
      {path: 'community', loadChildren: () => import('./community/community.module').then(m => m.CommunityModule)},
      {path: '**', redirectTo: 'home'}
    ]},

];
