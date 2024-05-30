import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ToursComponent} from "./components/tours/tours.component";
import {RoutePlanningComponent} from "./components/route-planning/route-planning.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {OrganizerToursComponent} from "./components/organizer-tours/organizer-tours.component";
import {ParticipantToursComponent} from "./components/participant-tours/participant-tours.component";

const routes: Routes = [
  {path: 'tours', component: ToursComponent},
  {path: 'route-planning', component: RoutePlanningComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'as-organizer', component: OrganizerToursComponent},
  {path: 'as-participant', component: ParticipantToursComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }
