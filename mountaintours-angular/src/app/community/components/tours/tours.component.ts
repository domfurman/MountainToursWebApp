import { Component, OnInit } from '@angular/core';
import {MapDetails} from "../../../models/map-details";
import {MapService} from "../../../services/map.service";
import * as L from "leaflet";
import {GeoJSON} from "geojson";
import {Observable, map, switchMap, forkJoin} from "rxjs";
import {User} from "../../../models/user";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss'
})
export class ToursComponent implements OnInit{
  routes$!: Observable<any>;
  map!: L.Map;


  constructor(private mapService: MapService, private authService: AuthService) {
    this.routes$ = this.loadMaps();
  }

  ngOnInit(): void {

    }


  loadMaps(): Observable<any[]> {
    return this.mapService.getAllRoutes().pipe(
      switchMap((routes: MapDetails[]) => {
        const userObservables = routes.map(route =>
          this.authService.getUserInfoByTourOwnerId(route.ownerId).pipe(
            map(user => ({ ...route, owner: user }))
          )
        );
        return forkJoin(userObservables); //forkJoin czeka na skonczenie sie requestu do zebrania danych o userze i laczy to do jednego observable
      })
    );
  }

}
