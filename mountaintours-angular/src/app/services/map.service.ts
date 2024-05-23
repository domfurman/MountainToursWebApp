import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Map} from "../models/map";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private basicUrl: string = 'http://localhost:8080'
  constructor(private http: HttpClient) { }

  getAllMaps(): Observable<Map[]> {
    return this.http.get<Map[]>(`${this.basicUrl}/api/find-all-maps`);
  }
}
