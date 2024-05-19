import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ToursComponent} from "./components/tours/tours.component";

const routes: Routes = [
  {path: 'tours', component: ToursComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }
