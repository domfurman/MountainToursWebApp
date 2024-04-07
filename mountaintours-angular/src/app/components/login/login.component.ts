import { Component } from '@angular/core';
import {Credentials} from "../../interfaces/credentials";
import {AppService} from "../../services/app.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
// import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials: Credentials = {
    username: '',
    password: ''
  }

  constructor(private appService: AppService, private http: HttpClient, private router: Router) {
  }

  login(loginForm: NgForm) {
    this.appService.dologin(this.credentials.username, this.credentials.password)
    this.appService.authenticate(this.credentials, () => {
      this.router.navigate(['/']);
    });
    console.log("test1")

  }

  // protected readonly error = error;
}
