import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {User} from "../../../shared/models/user";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {TourMapComponent} from "../../../shared/components/tour-map/tour-map.component";
import {AuthService} from "../../../shared/services/auth.service";
import {MapService} from "../../../shared/services/map.service";
import {Router} from "@angular/router";
import {MapDetails} from "../../../shared/models/map-details";

@Component({
  selector: 'app-organizer-tours',
  templateUrl: './organizer-tours.component.html',
  styleUrl: './organizer-tours.component.scss'
})
export class OrganizerToursComponent implements OnInit{
  currentUser: User = new User;
  routes$!: Observable<any>;
  toursAsOwner$!: Observable<any>;
  showRoutesAsParticipant: boolean = false;

  @ViewChildren(TourMapComponent) tourMaps!: QueryList<TourMapComponent>;

  constructor(private authService: AuthService, private mapService: MapService, private router: Router) {

  }

  ngOnInit() {
    this.retrieveUserData();
  }

  loadRoutesByOwnerId(): Observable<any[]> {
    return this.mapService.findAllRoutesByOwnerId(this.currentUser.id).pipe(
      switchMap((routes: MapDetails[]) => {
        const participantObservables = routes.map(route =>
          this.mapService.getAllParticipantsInfoByTourId(route.tourId).pipe(
            map(users => ({...route, participants: users}))
          )
        );
        return forkJoin(participantObservables)
      })
    );
  }

  retrieveUserData() {
    this.authService.getPrincipal().subscribe((user => {
      this.currentUser = user;
      console.log(this.currentUser);
      this.toursAsOwner$ = this.loadRoutesByOwnerId();
    }))
  }

  invalidateTourMapSize() {
    this.tourMaps.forEach(tourMap => tourMap.invalidateSize());
  }

  deleteTour(tourId: number, ownerId: number) {
  }

}
