import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {MapDetails} from "../models/map-details";
import {Observable} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private basicUrl: string = 'http://localhost:8080'
  constructor(private http: HttpClient) { }

  getAllRoutes(): Observable<MapDetails[]> {
    return this.http.get<MapDetails[]>(`${this.basicUrl}/api/find-all-maps`);
  }

  addNewRoute(mapDetails: MapDetails): Observable<MapDetails> {
    return this.http.post<MapDetails>(`${this.basicUrl}/api/save-map`, mapDetails);
  }

  addParticipant(tourId: number, participantId: number): Observable<number> {
    return this.http.post<number>(`${this.basicUrl}/api/tours/${tourId}/participants/${participantId}`, {
      tourId,
      participantId
    });
  }

  getNumberOfParticipantsForTour(tourId: number): Observable<number> {
    return this.http.get<number>(`${this.basicUrl}/api/number-of-participants/tour/${tourId}`);
  }

  isParticipant(tourId: number, participantId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.basicUrl}/api/tour/${tourId}/participant/${participantId}`);
  }

  getRoutesByParticipantId(participantId: number): Observable<MapDetails[]> {
    return this.http.get<MapDetails[]>(`${this.basicUrl}/api/routes-by-participant/${participantId}`);
  }

  resignFromTour(tourId: number, participantId: number): Observable<number> {
    return this.http.delete<number>(`${this.basicUrl}/api/resign/tour/${tourId}/participant/${participantId}`);
  }

  findAllRoutesByOwnerId(ownerId: number): Observable<MapDetails[]> {
    return this.http.get<MapDetails[]>(`${this.basicUrl}/api/routes-by-owner/${ownerId}`);
  }

  getAllParticipantsInfoByTourId(tourId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.basicUrl}/api/participants-info/tour/${tourId}`);
  }

  deleteTour(tourId: number, ownerId: number): Observable<number> {
    return this.http.delete<number>(`${this.basicUrl}/api/delete/tour/${tourId}/owner/${ownerId}`);
  }

  getMapDifficulties(): Observable<string[]> {
    return this.http.get<string[]>(`${this.basicUrl}/api/map-difficulties`);
  }


}
