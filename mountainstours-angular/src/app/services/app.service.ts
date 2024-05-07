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


  findUser() {
    /*const creds = {
      'username' : username,
      'password' : password
    }*/
    return this.http.get<User>(`${this.basicUrl}/api/user/20`)
  }

  /*getUserInfo() {
    let username="johncena@gmail.com"
    let password = "password"
    const headers = new HttpHeaders({Authorization: 'Basic' + btoa(username+":"+password)})
    return this.http.get('http://localhost:8080/api/user/20', {headers})
  }*/

  getList() {
    return this.http.get<any>(`${this.basicUrl}/api/list`).subscribe(res => {
      if (res) {
        console.log(res)
      } else {
        console.error()
      }
    })
  }
}
