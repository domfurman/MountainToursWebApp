import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import {ToursComponent} from "./components/tours/tours.component";
import {MapComponent} from "../shared/components/map/map.component";
import { RoutePlanningComponent } from './components/route-planning/route-planning.component';
import {TourMapComponent} from "../shared/components/tour-map/tour-map.component";
import {NavbarComponent} from "../shared/components/navbar/navbar.component";
import {ProfileComponent} from "./components/profile/profile.component";
import { OrganizerToursComponent } from './components/organizer-tours/organizer-tours.component';
import { ParticipantToursComponent } from './components/participant-tours/participant-tours.component';
import {DurationPipe} from "../shared/pipes/duration.pipe";
import {DaysDifferencePipe} from "../shared/pipes/days-difference.pipe";


@NgModule({
  declarations: [
    ToursComponent,
    RoutePlanningComponent,
    ProfileComponent,
    OrganizerToursComponent,
    ParticipantToursComponent,
  ],
  imports: [
    CommonModule,
    CommunityRoutingModule,
    MapComponent,
    TourMapComponent,
    NavbarComponent,
    DurationPipe,
    DaysDifferencePipe,
  ]
})
export class CommunityModule { }
