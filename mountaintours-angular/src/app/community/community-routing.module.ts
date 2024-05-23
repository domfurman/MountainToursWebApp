import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ToursComponent} from "./components/tours/tours.component";
import {RoutePlanningComponent} from "./components/route-planning/route-planning.component";

const routes: Routes = [
  {path: 'tours', component: ToursComponent},
  {path: 'route-planning', component: RoutePlanningComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }
