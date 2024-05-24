import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {MapDetails} from "../models/map-details";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private basicUrl: string = 'http://localhost:8080'
  constructor(private http: HttpClient) { }

  getAllMaps(): Observable<MapDetails[]> {
    return this.http.get<MapDetails[]>(`${this.basicUrl}/api/find-all-maps`);
  }

  addNewRoute(mapDetails: MapDetails): Observable<MapDetails> {
    return this.http.post<MapDetails>(`${this.basicUrl}/api/save-map`, mapDetails);
  }
}
