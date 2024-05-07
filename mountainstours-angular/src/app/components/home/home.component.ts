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
    // this.find();
    this.appService.getList();
  }

  authenticated() {
    return this.appService.authenticated;
  }

  find() {
    this.appService.findUser().subscribe(data => {
      this.user = data;
    })
  }

}
