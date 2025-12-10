import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberWithCommas',
    standalone: false
})
export class NumberWithCommasPipe implements PipeTransform {
  transform(value: number | string | undefined): string {
    if (value === undefined || value === null) {
      return '';
    }

    const stringValue = typeof value === 'number' ? value.toString() : value;
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
