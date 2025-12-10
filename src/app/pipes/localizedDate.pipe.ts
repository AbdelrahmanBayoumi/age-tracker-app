import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizedDate',
  pure: false,
  standalone: false,
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: any, pattern: string = 'shortDate'): string {
    const locale = this.translateService.currentLang;
    const datePipe: DatePipe = new DatePipe(locale);
    return datePipe.transform(value, pattern) || value;
  }
}
