import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppService} from "./services/app.service";
import {Router} from "@angular/router";
import {Credentials} from "./interfaces/credentials";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mountaintours-angular';

  constructor(private http: HttpClient, private appService: AppService, private router: Router) {
    const credentials: Credentials = {
      email: '',
      password: ''
    };
    const callback = () => {};

    // this.appService.authenticate(credentials, callback);
  }
}
