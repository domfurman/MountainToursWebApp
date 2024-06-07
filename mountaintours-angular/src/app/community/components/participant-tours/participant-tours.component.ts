import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {User} from "../../../shared/models/user";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {TourMapComponent} from "../../../shared/components/tour-map/tour-map.component";
import {AuthService} from "../../../shared/services/auth.service";
import {MapService} from "../../../shared/services/map.service";
import {Router} from "@angular/router";
import {MapDetails} from "../../../shared/models/map-details";
import {CommunityService} from "../../services/community.service";
import Swal from 'sweetalert2';

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

  constructor(private authService: AuthService, private mapService: MapService, private communityService: CommunityService, private router: Router) {

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
        return forkJoin(userObservables).pipe(
          map(routesWithParticipants => {
            return routesWithParticipants.map(route => ({
              ...route,
              tourDateConvert: this.communityService.convertDate(route.tourDate.toString()),
              expDateConvert: this.communityService.convertDate(route.expirationDate.toString())
            }));
          })
        );; //forkJoin czeka na skonczenie sie requestu do zebrania danych o userze i laczy to do jednego observable
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
      this.isUserParticipantInAnyTour(this.currentUser.id);
      console.log(this.currentUser);
      this.routes$ = this.loadMaps();
    }))
  }
  invalidateTourMapSize() {
    this.tourMaps.forEach(tourMap => tourMap.invalidateSize());
  }

  resignFromTour(tourId: number, participantId: number) {
      this.mapService.resignFromTour(tourId, participantId).subscribe(() => {
        console.log('Resign success');
        this.routes$ = this.routes$.pipe(
          map((routes: MapDetails[]) => routes.filter(route => route.tourId !== tourId))
        );
        this.isUserParticipantInAnyTour(participantId);
      }, error => {
        console.error("Error during resigning", error);
      });
  }

  isUserParticipantInAnyTour(participantId: number) {
    this.mapService.isUserParticipantInAnyTour(participantId).subscribe((result: boolean) => {
      this.isParticipantInAnyRoute = result;
    });
  }

  navigateToTours() {
    this.router.navigate(['/community/tours']);
  }

  resignFromTourAlert(tourId: number, participantId: number) {

    Swal.fire({
      title: 'Resignation',
      text: "Are you sure you want to resign?",
      icon: 'question',
      confirmButtonText: 'Yes',
      showDenyButton: true,
      denyButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resignFromTour(tourId, participantId);
      } else {
        return;
      }
    });
  }
}
