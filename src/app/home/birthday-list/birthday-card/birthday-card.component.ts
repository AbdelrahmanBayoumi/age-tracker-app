import { Component, Input } from '@angular/core';
import { Birthday } from 'src/app/birthday/model/birthday.model';

@Component({
  selector: 'app-birthday-card',
  templateUrl: './birthday-card.component.html',
  styleUrls: ['./birthday-card.component.scss'],
  standalone: false,
})
export class BirthdayCardComponent {
  @Input() birthday: Birthday | null = null;
}
