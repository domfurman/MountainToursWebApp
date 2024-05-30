import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/models/user";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {MapDetails} from "../../../shared/models/map-details";
import {MapService} from "../../../shared/services/map.service";
import {TourMapComponent} from "../../../shared/components/tour-map/tour-map.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  currentUser: User = new User;
  routes$!: Observable<any>;
  showRoutesAsParticipant: boolean = false;

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

  showRoutesAsParticipantFunc() {
    this.showRoutesAsParticipant = !this.showRoutesAsParticipant;
    if (this.showRoutesAsParticipant) {
      setTimeout(() => {
        this.tourMaps.forEach(tourMap => tourMap.invalidateSize());
      }, 10)
    }
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

  logout() {
    this.authService.logout().subscribe(() => {
      console.log("success logout");
      this.router.navigate(['/home]']);
    }, error => {
      console.error("error logout", error)
    });
  }

}
