import { Component, OnInit } from '@angular/core';
import {MapDetails} from "../../../shared/models/map-details";
import {MapService} from "../../../shared/services/map.service";
import * as L from "leaflet";
import {GeoJSON} from "geojson";
import {Observable, map, switchMap, forkJoin, Subscription} from "rxjs";
import {User} from "../../../shared/models/user";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss'
})
export class ToursComponent implements OnInit{
  routes$!: Observable<any>;
  map!: L.Map;
  currentUser: User = new User();
  participantCounts: {[key: number]: number} = {};
  isParticipant: boolean = false;
  todaysDate = new Date();


  constructor(private mapService: MapService, private authService: AuthService) {
    this.routes$ = this.loadMaps();
  }

  ngOnInit(): void {
    this.retrieveUserData();
    }

  loadMaps(): Observable<any[]> {
    return this.mapService.getAllRoutes().pipe(
      switchMap((routes: MapDetails[]) => {
        const userObservables = routes.map(route =>
          this.authService.getUserInfoByTourOwnerId(route.ownerId).pipe(
            map(user => ({ ...route, owner: user }))
          )
        );

        return forkJoin(userObservables).pipe(
          switchMap(routesWithUsers => {
            const participantObservables = routesWithUsers.map(route =>
              this.mapService.getNumberOfParticipantsForTour(route.tourId).pipe(
                map(count => {
                  this.participantCounts[route.tourId] = count;
                  return route;
                })
              )
            );

            return forkJoin(participantObservables).pipe(
              map(routesWithParticipants => {
                return routesWithParticipants.map(route => ({
                  ...route,
                  isPastToday: this.isExpDatePastToday(route.expirationDate.toString())
                }));
              })
            );
          })
        );
      })
    );
  }

  retrieveUserData() {
    this.authService.getPrincipal().subscribe((user => {
      this.currentUser = user
      console.log(this.currentUser)
    }))
  }

  addParticipant(tourId: number, participantId: number) {
    this.mapService.addParticipant(tourId, participantId).subscribe(() => {
      console.log("participant added successfully");
      this.getNumberOfParticipantsForTour(tourId);
    }, error => {
      console.error("error adding participant", error);
    })
  }

  getNumberOfParticipantsForTour(tourId: number): void {
    this.mapService.getNumberOfParticipantsForTour(tourId).subscribe((data: number) => {
      this.participantCounts[tourId] = data;
    });
  }

  isRouteParticipant(tourId: number, userId: number): Subscription {
    return this.mapService.isParticipant(tourId, userId).subscribe((result: boolean) => {
      this.isParticipant = result;
    })
  }

  isExpDatePastToday(expirationDate: string) {
    const backendExpirationDate = new Date(expirationDate);
    const currentDate = new Date();

    return backendExpirationDate < currentDate;
  }

}
