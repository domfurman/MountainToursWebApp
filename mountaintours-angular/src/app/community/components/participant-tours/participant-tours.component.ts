import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {User} from "../../../shared/models/user";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {TourMapComponent} from "../../../shared/components/tour-map/tour-map.component";
import {AuthService} from "../../../shared/services/auth.service";
import {MapService} from "../../../shared/services/map.service";
import {Router} from "@angular/router";
import {MapDetails} from "../../../shared/models/map-details";

@Component({
  selector: 'app-participant-tours',
  templateUrl: './participant-tours.component.html',
  styleUrl: './participant-tours.component.scss'
})
export class ParticipantToursComponent implements OnInit{
  currentUser: User = new User;
  routes$!: Observable<any>;
  isParticipantInAnyRoute: boolean = false;

  @ViewChildren(TourMapComponent) tourMaps!: QueryList<TourMapComponent>;

  constructor(private authService: AuthService, private mapService: MapService, private router: Router) {

  }

  ngOnInit() {
    this.retrieveUserData();
  }

  loadMaps(): Observable<any[]> {
    return this.mapService.getRoutesByParticipantId(this.currentUser.id).pipe(
      switchMap((routes: MapDetails[]) => {
        const userObservables = routes.map(route =>
          this.authService.getUserInfoByTourOwnerId(route.ownerId).pipe(
            map(user => ({ ...route, owner: user }))
          )
        );
        return forkJoin(userObservables); //forkJoin czeka na skonczenie sie requestu do zebrania danych o userze i laczy to do jednego observable
      }),
      map(routes => {
        this.
          isParticipantInAnyRoute= routes.length > 0;
        return routes;
      })
    );
  }

  retrieveUserData() {
    this.authService.getPrincipal().subscribe((user => {
      this.currentUser = user;
      console.log(this.currentUser);
      this.routes$ = this.loadMaps();
    }))
  }
  invalidateTourMapSize() {
    this.tourMaps.forEach(tourMap => tourMap.invalidateSize());
  }

  resignFromTour(tourId: number, participantId: number) {
    if(confirm("Jesteś pewny?")) {
      this.mapService.resignFromTour(tourId, participantId).subscribe(() => {
        console.log('Resign success');
        this.routes$ = this.routes$.pipe(
          map((routes: MapDetails[]) => routes.filter(route => route.tourId !== tourId))
        );
      }, error => {
        console.error("Error during resigning", error);
      });
    } else {
      return
    }
  }
}
