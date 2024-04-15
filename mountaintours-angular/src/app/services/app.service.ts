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
  private basicUrl: string = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

/*
  login(user: User): Observable<object> {
    console.log(user);
    return this.http.post(`${this.basicUrl}/`, user, {withCredentials: true});
  }
*/
  login(username: String, password: String): Observable<object> {
    // console.log();
    const headers = new HttpHeaders({Authorization: 'Basic ' + btoa(username+":"+password)})
    const options = {headers, withCredentials: true, responseType: 'text' as 'json'};
    const creds = {
      'username' : username,
      'password' : password
    }
    return this.http.post(`${this.basicUrl}/api/login`, creds);
  }


  findUser(username: String, password: String) {
    const creds = {
      'username' : username,
      'password' : password
    }
    return this.http.get<User>(`${this.basicUrl}/api/user/20`)
  }

  /*authenticate(credentials: Credentials, callback: any) {
    const headers = new HttpHeaders(credentials ? {
      authorization : 'Basic ' + btoa(credentials.email + ':' + credentials.password)
    } : {});

    this.http.get('http://localhost:8080/user', {headers: headers}).subscribe(response => {
      this.authenticated = true;
      /!*if (response['authenticated']) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
      }*!/
      return callback && callback();
    })
    this.authenticated = false;
  }*/

  /*dologin(username: String, password: String) {
    const headers = new HttpHeaders({Authorization: 'Basic' + btoa(username+":"+password)})
    return this.http.get('http://localhost:8080/login', {headers, responseType:'text' as 'json'})
  }*/
  /*authenticate(credentials: Credentials, callback: any) {
    const headers = credentials ?
      new HttpHeaders({
        authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
      }) : new HttpHeaders();

    this.http.get('user', {headers: headers}).subscribe(
      response => {
        this.authenticated = !!response['name'];
      },
      error => {
        console.error('Authentication Error:', error);
        this.authenticated = false;
      },
      () => {
        if (callback) {
          callback();
        }
      }
    );
  }*/

  /*getUserInfo() {
    let username="johncena@gmail.com"
    let password = "password"
    const headers = new HttpHeaders({Authorization: 'Basic' + btoa(username+":"+password)})
    return this.http.get('http://localhost:8080/api/user/20', {headers})
  }*/



}
