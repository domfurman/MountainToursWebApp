import { Injectable } from '@angular/core';
import {User} from "../models/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {map, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticated = false;
  signUpSuccess = false;
  private basicUrl: string = 'http://localhost:8080'
  user: User = new User();

  constructor(private http: HttpClient, private router: Router) { }

  login(username: String, password: String){
    const creds = {
      'username' : username,
      'password' : password
    }
    return this.http.post<any>(`${this.basicUrl}/api/login`, creds).pipe(
      tap(response => {
        this.authenticated = !!(response && response.success);
      })
    );
  }

  logout() {
    return this.http.post(`${this.basicUrl}/api/logout`, {}, {responseType: 'text'}).pipe(
      tap(() => {
        this.authenticated = false;
        sessionStorage.removeItem('token');
      })
    )
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

  getUserInfoByTourOwnerId(tourOwnerId: number): Observable<User> {
    return this.http.get<User>(`${this.basicUrl}/api/user-by-tour-owner-id/${tourOwnerId}`)
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }
}
