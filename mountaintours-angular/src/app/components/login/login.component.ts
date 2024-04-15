import { Component } from '@angular/core';
import {Credentials} from "../../interfaces/credentials";
import {AppService} from "../../services/app.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {User} from "../../models/user";
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

  user: User = new User();

  constructor(private appService: AppService, private router: Router) {
  }

  userLogin() {
    console.log(this.user);
    this.appService.login(this.credentials.email, this.credentials.password).subscribe(data => {
      // alert('login successful')
      /*this.appService.findUser(this.credentials.email, this.credentials.password).subscribe(dataUser => {
        this.user = dataUser
      })*/
      this.router.navigate(['/home'])
    }, error => {
      console.log('Login error: ', error)
      alert('sth went wrong')
    });
    // this.appService.dologin(this.credentials.username, this.credentials.password)
    /*this.appService.authenticate(this.credentials, () => {
      this.router.navigate(['/']);
    });*/
    /*let response = this.appService.dologin(this.username, this.password);
    response.subscribe(data => {
      console.log(data)
    })*/

  }

  // protected readonly error = error;
}
