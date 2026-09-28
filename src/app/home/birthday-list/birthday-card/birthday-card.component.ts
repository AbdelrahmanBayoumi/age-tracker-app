import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Birthday } from 'src/app/birthday/model/birthday.model';

@Component({
  selector: 'app-birthday-card',
  templateUrl: './birthday-card.component.html',
  styleUrls: ['./birthday-card.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BirthdayCardComponent implements OnChanges {
  @Input() birthday: Birthday | null = null;

  ageAndBirthDate = '';
  daysUntilNextBirthday = 0;
  photoUrl = '/assets/images/no-image.png';

  ngOnChanges(): void {
    if (this.birthday) {
      this.ageAndBirthDate = this.birthday.getAgeAndBirthDate?.() ?? '';
      this.daysUntilNextBirthday = this.birthday.getDaysUntilNextBirthday?.() ?? 0;
      this.photoUrl =
        this.birthday.image && this.birthday.image !== '' ? this.birthday.image : '/assets/images/no-image.png';
    }
  }
}
