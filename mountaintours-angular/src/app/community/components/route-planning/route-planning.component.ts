import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-route-planning',
  templateUrl: './route-planning.component.html',
  styleUrl: './route-planning.component.scss'
})
export class RoutePlanningComponent implements OnInit{

  constructor(protected authService: AuthService) {
  }

  ngOnInit() {
    this.isAuthenticated();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

}
