import { Component } from '@angular/core';
import {Credentials} from "../../interfaces/credentials";
import {AppService} from "../../services/app.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {User} from "../../models/user";
import {error} from "@angular/compiler-cli/src/transformers/util";
// import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  credentials: Credentials = {
    email: '',
    password: ''
  }

  sessionId: any = '';

  user: User = new User();

  constructor(private appService: AppService, private router: Router) {
  }

  /*userLogin() {
    this.appService.login(this.credentials.email, this.credentials.password).subscribe(data => {
      alert('login successful')
      this.router.navigate(['/home'])
    }, error => {
      console.log('Login error: ', error)
      alert('sth went wrong')
    });
  }*/

  userLogin() {
    this.appService.login(this.credentials.email, this.credentials.password).subscribe(res => {
      // console.log(res.sessionId);
      alert('login successful')
      this.sessionId = res.sessionId
      console.log(this.sessionId)
      sessionStorage.setItem(
        'token',
        this.sessionId
      );
      // console.log(sessionStorage)
      this.router.navigate(['/home'])

    }, error => {
      console.log('Login error: ', error)
      alert('sth went wrong')
    })

  }

}
