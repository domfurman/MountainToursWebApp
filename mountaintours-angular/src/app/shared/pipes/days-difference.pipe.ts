import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysDifference',
  standalone: true
})
export class DaysDifferencePipe implements PipeTransform {

  transform(expDate: Date | string): number {
    const today = new Date()
    const expiration = new Date(expDate)

    const difference = expiration.getTime() - today.getTime();
    const differenceInDays = Math.floor(difference / (1000 * 3600 * 24))

    return differenceInDays;
  }

}
