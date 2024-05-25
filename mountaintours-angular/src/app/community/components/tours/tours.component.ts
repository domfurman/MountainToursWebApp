import { Component, OnInit } from '@angular/core';
import {MapDetails} from "../../../models/map-details";
import {MapService} from "../../../services/map.service";
import * as L from "leaflet";
import {GeoJSON} from "geojson";
import {Observable} from "rxjs";

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss'
})
export class ToursComponent implements OnInit{
  mapList: MapDetails[] = [];
  routes$!: Observable<MapDetails[]>;
  map!: L.Map;


  constructor(private mapService: MapService) {
    this.routes$ = this.loadMaps();
  }

  ngOnInit(): void {
    this.loadAllMaps()
    console.log(this.routes$)
    console.log(this.mapList);
    }

  loadMaps() {
    return this.mapService.getAllRoutes();
    // return this.mapService.getAllRoutes().subscribe(
    //   (data) => this.mapList = data
    // )
  }

  loadAllMaps() {
    return this.mapService.getAllRoutes().subscribe(
      (data) => this.mapList = data
    )
  }

}
