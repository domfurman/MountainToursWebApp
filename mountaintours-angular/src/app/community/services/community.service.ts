import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  constructor() { }

  isExpDatePastToday(expirationDate: string) {
    const backendExpirationDate = new Date(expirationDate);
    const currentDate = new Date();

    return backendExpirationDate < currentDate;
  }

  convertDate(date: string) {
    return new Date(date);
  }
}
