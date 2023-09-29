import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'dateFormat',
  pure: false // Make the pipe impure to watch the language changes
})
export class DateFormatPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: string): string {
    const [year, month] = value.split('-');

    // Key of the month in your translation files
    const monthKey = `MONTHS.${parseInt(month) - 1}`;

    // Translate the month name using the current language
    const translatedMonth = this.translate.instant(monthKey);

    const formattedDate = `${translatedMonth} ${year}`;
    return formattedDate;
  }
}
