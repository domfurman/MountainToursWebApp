import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {authenticationGuard} from "./core/guard/authentication.guard";

const routes: Routes = [
  {path: '', canActivate: [authenticationGuard], children: [
      {path: 'home', component: HomeComponent},
      {path: 'login', component: LoginComponent},
      {path: '**', redirectTo: ''}

    ]},
  // {path: 'home', component: HomeComponent},
  // {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
