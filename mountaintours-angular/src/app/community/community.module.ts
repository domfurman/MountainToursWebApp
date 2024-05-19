import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunityRoutingModule } from './community-routing.module';
import {ToursComponent} from "./components/tours/tours.component";
import {MapComponent} from "../components/map/map.component";


@NgModule({
  declarations: [
    ToursComponent
  ],
  imports: [
    CommonModule,
    CommunityRoutingModule,
    MapComponent
  ]
})
export class CommunityModule { }
