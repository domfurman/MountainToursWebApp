import { Component } from '@angular/core';
import {Credentials} from "../../interfaces/credentials";
import {RegistrationCredentials} from "../../interfaces/registration-credentials";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  credentials: Credentials = {
    email: '',
    password: ''
  }

  registrationCredentials: RegistrationCredentials = {
    firstName: '',
    lastName: '',
    password:'',
    email: ''
  }

  sessionId: any = '';
  showLoginForm = false;

  constructor(private appService: AuthService, private router: Router) {
  }

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

  userRegistration() {
    this.appService.registerUser(
      this.registrationCredentials.firstName,
      this.registrationCredentials.lastName,
      this.registrationCredentials.email,
      this.registrationCredentials.password).subscribe(res => {
      console.log('success')
      this.changeForm();
    }, error => {
      console.log(error)
    })

  }

  changeForm() {
    this.showLoginForm = !this.showLoginForm;
  }

}
