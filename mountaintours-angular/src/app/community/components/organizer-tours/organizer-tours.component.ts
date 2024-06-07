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
  selector: 'app-organizer-tours',
  templateUrl: './organizer-tours.component.html',
  styleUrl: './organizer-tours.component.scss'
})
export class OrganizerToursComponent implements OnInit{
  currentUser: User = new User;
  toursAsOwner$!: Observable<any>;
  isOrganizingAnyTours: boolean = false;

  @ViewChildren(TourMapComponent) tourMaps!: QueryList<TourMapComponent>;

  constructor(private authService: AuthService, private mapService: MapService, private router: Router, private communityService: CommunityService) {

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
        return forkJoin(participantObservables).pipe(
          map(routesWithParticipants => {
            return routesWithParticipants.map(route => ({
              ...route,
              tourDateConvert: this.communityService.convertDate(route.tourDate.toString()),
              expDateConvert: this.communityService.convertDate(route.expirationDate.toString())
            }));
          })
        );
      })
    );
  }

  retrieveUserData() {
    this.authService.getPrincipal().subscribe((user => {
      this.currentUser = user;
      this.isUserOrganizingAnyTour(this.currentUser.id);
      console.log(this.currentUser);
      this.toursAsOwner$ = this.loadRoutesByOwnerId();
    }))
  }


  deleteTour(tourId: number, ownerId: number) {
      this.mapService.deleteTour(tourId, ownerId).subscribe(() => {
        console.log("delete successful")
        this.toursAsOwner$ = this.toursAsOwner$.pipe(
          map((tours: MapDetails[]) => tours.filter(tour => tour.tourId !== tourId))
        )
        this.isUserOrganizingAnyTour(ownerId);
      }, error => {
        console.error("error on delete", error)
      });
  }

  isUserOrganizingAnyTour(ownerId: number) {
    this.mapService.isUserOrganizingAnyTour(ownerId).subscribe((result: boolean) => {
      this.isOrganizingAnyTours = result;
    })
  }

  navigateToRoutePlanning() {
    this.router.navigate(['community/route-planning'])
  }

  deleteTourAlert(tourId: number, ownerId: number) {
    Swal.fire({
      title: 'Tour cancellation',
      text: "Are you sure you want to cancel this tour?",
      icon: 'warning',
      confirmButtonText: 'Yes',
      showDenyButton: true,
      denyButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTour(tourId, ownerId);
      } else {
        return;
      }
    });
  }
}
