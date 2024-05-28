import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/models/user";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {MapDetails} from "../../../shared/models/map-details";
import {MapService} from "../../../shared/services/map.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  currentUser: User = new User;
  routes$!: Observable<any>;
  showRoutesAsParticipant: boolean = false;

  constructor(private authService: AuthService, private mapService: MapService) {

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
  }
}
