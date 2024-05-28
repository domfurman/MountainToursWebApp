import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import {ToursComponent} from "./components/tours/tours.component";
import {MapComponent} from "../shared/components/map/map.component";
import { RoutePlanningComponent } from './components/route-planning/route-planning.component';
import {TourMapComponent} from "../shared/components/tour-map/tour-map.component";
import {NavbarComponent} from "../shared/components/navbar/navbar.component";
import {ProfileComponent} from "./components/profile/profile.component";


@NgModule({
  declarations: [
    ToursComponent,
    RoutePlanningComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    CommunityRoutingModule,
    MapComponent,
    TourMapComponent,
    NavbarComponent,
  ]
})
export class CommunityModule { }
