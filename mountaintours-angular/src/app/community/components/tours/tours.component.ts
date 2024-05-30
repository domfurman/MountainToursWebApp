import { Component, OnInit } from '@angular/core';
import {MapDetails} from "../../../shared/models/map-details";
import {MapService} from "../../../shared/services/map.service";
import * as L from "leaflet";
import {GeoJSON} from "geojson";
import {Observable, map, switchMap, forkJoin, Subscription, mergeMap, BehaviorSubject, take} from "rxjs";
import {User} from "../../../shared/models/user";
import {AuthService} from "../../../shared/services/auth.service";
import {CommunityService} from "../../services/community.service";

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss'
})
export class ToursComponent implements OnInit{
  private routesSubject = new BehaviorSubject<any[]>([]);
  routes$: Observable<any[]> = this.routesSubject.asObservable();
  // routes$!: Observable<any>;
  map!: L.Map;
  currentUser: User = new User();
  participantCounts: {[key: number]: number} = {};

  constructor(private mapService: MapService, private authService: AuthService, private communityService: CommunityService) {
    // this.routes$ = this.loadMaps();
  }

  ngOnInit(): void {
    this.retrieveUserData();
    }

  loadMaps(): void {
    this.mapService.getAllRoutes().pipe(
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
                  isPastToday: this.communityService.isExpDatePastToday(route.expirationDate.toString()),
                  tourDateConvert: this.communityService.convertDate(route.tourDate.toString()),
                  expDateConvert: this.communityService.convertDate(route.expirationDate.toString())
                }));
              }),
              mergeMap(mappedRoutes => {
                const isRouteParticipantObservables = mappedRoutes.map(route =>
                  this.mapService.isParticipant(route.tourId, this.currentUser.id).pipe(
                    map(result => ({
                      ...route,
                      isParticipant: result
                    }))
                  )
                );
                return forkJoin(isRouteParticipantObservables);
              })
            );
          })
        );
      }),
    ).subscribe(updatedRoutes => {
      this.routesSubject.next(updatedRoutes);
    });
  }

  retrieveUserData() {
    this.authService.getPrincipal().subscribe((user => {
      this.currentUser = user
      console.log(this.currentUser)
      this.loadMaps()
    }))
  }

  updateRoutes(tourId: number, participantId: number) {
    this.routes$.pipe(
      take(1),
      map(routes => {
        return routes.map(route => {
          if (route.tourId === tourId) {
            route.isParticipant = true;
          }
          return route;
        });
      })
    ).subscribe(updatedRoutes => {
      this.routesSubject.next(updatedRoutes);
    });
    this.getNumberOfParticipantsForTour(tourId);
  }

  addParticipant(tourId: number, participantId: number) {
    if (confirm("Jesteś pewny?")) {
      this.mapService.addParticipant(tourId, participantId).subscribe(() => {
        console.log("participant added successfully");
        this.updateRoutes(tourId, participantId)
        // this.getNumberOfParticipantsForTour(tourId);
      }, error => {
        console.error("error adding participant", error);
      })
    } else {
      return
    }
  }

  getNumberOfParticipantsForTour(tourId: number): void {
    this.mapService.getNumberOfParticipantsForTour(tourId).subscribe((data: number) => {
      this.participantCounts[tourId] = data;
    });
  }
}
