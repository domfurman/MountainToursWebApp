import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/models/user";
import {TourMapComponent} from "../../../shared/components/tour-map/tour-map.component";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  currentUser: User = new User;

  @ViewChildren(TourMapComponent) tourMaps!: QueryList<TourMapComponent>;

  constructor(private authService: AuthService, private router: Router) {

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

    }, error => {
      console.error("error logout", error)
    });
  }

  logoutAlert() {
    Swal.fire({
      title: 'Log out successful',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
        this.router.navigate(['/home]']);
      }
    });
  }
}
