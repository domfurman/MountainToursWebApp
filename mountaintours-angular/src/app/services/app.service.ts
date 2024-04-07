import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Credentials} from "../interfaces/credentials";
import {Observable} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  authenticated = false;

  constructor(private http: HttpClient) { }

  authenticate(credentials: Credentials, callback: any) {
    /*const headers = new HttpHeaders(credentials ? {
      authorization : 'Basic ' + btoa(credentials.username + ':' + credentials.password)
    } : {});

    this.http.get('http://localhost:8080/user', {headers: headers}).subscribe(response => {
      this.authenticated = true;
      /!*if (response['authenticated']) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
      }*!/
      return callback && callback();
    })*/
    this.authenticated = true;
  }

  dologin(username: String, password: String) {
    return this.http.post('http://localhost:8080/login', {username, password})
  }
  /*authenticate(credentials: Credentials, callback: any) {
    const headers = credentials ?
      new HttpHeaders({
        authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
      }) : new HttpHeaders();

    this.http.get('user', {headers: headers}).subscribe(
      response => {
        // Handle successful response
        this.authenticated = !!response['name']; // Set authenticated based on response
      },
      error => {
        // Handle error
        console.error('Authentication Error:', error);
        this.authenticated = false; // Set authenticated to false on error
      },
      () => {
        // Callback after request completion
        if (callback) {
          callback();
        }
      }
    );
  }*/

  getUserInfo(): Observable<User> {
    return this.http.get<User>('http://localhost:8080/api/user/20')
  }



}
