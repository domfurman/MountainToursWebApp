import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true
})
export class DurationPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null) return '00:00';

    const hours: number = Math.floor(value / 3600);
    const minutes: number = Math.floor((value % 3600) / 60);

    const hoursString = hours < 10 ? '0' + hours : hours.toString();
    const minutesString = minutes < 10 ? '0' + minutes : minutes.toString();

    return `${hoursString}:${minutesString}`;
  }

}
