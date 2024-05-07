import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Credentials} from "../interfaces/credentials";
import {map, Observable} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  authenticated = false;
  private basicUrl: string = 'http://localhost:8080'
  user: User = new User();

  constructor(private http: HttpClient) { }

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
        return new User(); // Return null if user data is not available
      })
    );
    // this.http.get<any>(`${this.basicUrl}/api/principaluser`).subscribe(res => {
    //   if (res != null) {
    //     // console.log(res.principal)
    //     this.user.id = res.principal.id;
    //     this.user.email = res.principal.email;
    //     this.user.firstName = res.principal.firstName;
    //     this.user.lastName = res.principal.lastName;
    //     this.user.password = res.principal.password;
    //     this.user.userRole = res.principal.userRole;
    //
    //     console.log(this.user)
    //   }
    //   return this.user;
    // })
  }

  // getCurUserInfo() {
  //   this.getPrincipal();
  //   console.log(this.user);
  // }
}
