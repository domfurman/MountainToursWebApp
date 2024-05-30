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

  @ViewChildren(TourMapComponent) tourMaps!: QueryList<TourMapComponent>;

  constructor(private authService: AuthService, private mapService: MapService, private router: Router) {

  }

  ngOnInit() {
    this.retrieveUserData();
  }

  retrieveUserData() {
    this.authService.getPrincipal().subscribe((user => {
      this.currentUser = user;
      console.log(this.currentUser);
    }))
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
