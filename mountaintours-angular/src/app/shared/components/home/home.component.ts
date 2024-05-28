import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {NavbarComponent} from "../navbar/navbar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  user: User = new User();

  constructor(protected authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.retrieveUserData();
  }

  authenticated() {
    return this.authService.authenticated;
  }

  retrieveUserData() {
    this.authService.getPrincipal().subscribe((user => {
      this.user = user
      console.log(this.user)
    }))
  }

  navigateToTours() {
    this.router.navigate(['/community/tours']);
  }

  navigateToRoutePlanning() {
    this.router.navigate(['/community/route-planning']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

}
