import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Credentials} from "../interfaces/credentials";
import {map, Observable} from "rxjs";
import {User} from "../models/user";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  authenticated = false;
  private basicUrl: string = 'http://localhost:8080'
  user: User = new User();

  constructor(private http: HttpClient, private router: Router) { }

  login(username: String, password: String){
    // console.log();
    const headers = new HttpHeaders({Authorization: 'Basic ' + btoa(username+":"+password)})
    const options = {headers, withCredentials: true, responseType: 'text' as 'json'};
    const creds = {
      'username' : username,
      'password' : password
    }
    return this.http.post<any>(`${this.basicUrl}/api/login`, creds);
  }

  findUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.basicUrl}/api/currentuser`, { params: { email } });
  }

  getList() {
    return this.http.get<any>(`${this.basicUrl}/api/list`).subscribe(res => {
      if (res) {
        console.log(res)
      } else {
        console.error()
      }
    })
  }

  getPrincipal() {
    return this.http.get<any>(`${this.basicUrl}/api/principaluser`).pipe(
      map(res => {
        if (res && res.principal) {
          const user = new User();
          user.id = res.principal.id;
          user.email = res.principal.email;
          user.firstName = res.principal.firstName;
          user.lastName = res.principal.lastName;
          user.password = res.principal.password;
          user.userRole = res.principal.userRole;
          this.authenticated = true;
          return user;
        }
        return new User();
      })
    );
  }

  registerUser(firstName: string, lastName: string, email: string, password: string) {
    const creds = {
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'password': password
    }

    return this.http.post<any>(`${this.basicUrl}/api/registration`, creds)
  }
}
