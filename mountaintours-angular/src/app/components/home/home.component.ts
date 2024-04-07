import {Component, OnInit} from '@angular/core';
import {AppService} from "../../services/app.service";
import {HttpClient} from "@angular/common/http";
import {User} from "../../models/user";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  protected greeting: Object = {
    'id': 0,
    'firstName': ''
  }

  user: User = new User();
  constructor(protected appService: AppService, private http: HttpClient) {
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  authenticated() {
    return this.appService.authenticated;
  }

  loadUserInfo(): void {
    this.appService.getUserInfo().subscribe(userData => {
      this.user = userData
    })
  }
}
