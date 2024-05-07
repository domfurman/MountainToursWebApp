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

  user: User = new User();
  constructor(protected appService: AppService) {
  }

  ngOnInit() {
    this.retrieveUserData();
  }

  authenticated() {
    return this.appService.authenticated;
  }

  retrieveUserData() {
    this.appService.getPrincipal().subscribe((user => {
      this.user = user
      console.log(this.user)
    }))
  }

}
