import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import {ToursComponent} from "./components/tours/tours.component";
import {MapComponent} from "../shared/components/map/map.component";
import { RoutePlanningComponent } from './components/route-planning/route-planning.component';
import {TourMapComponent} from "../shared/components/tour-map/tour-map.component";


@NgModule({
  declarations: [
    ToursComponent,
    RoutePlanningComponent
  ],
  imports: [
    CommonModule,
    CommunityRoutingModule,
    MapComponent,
    TourMapComponent,
  ]
})
export class CommunityModule { }
