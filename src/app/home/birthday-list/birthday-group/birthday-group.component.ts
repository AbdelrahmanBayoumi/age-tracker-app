import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Birthday } from 'src/app/birthday/model/birthday.model';

@Component({
  selector: 'app-birthday-group',
  templateUrl: './birthday-group.component.html',
  styleUrls: ['./birthday-group.component.scss'],
  standalone: false,
})
export class BirthdayGroupComponent {
  @Input() birthdaysGroup: { month: string; birthdays: Birthday[] } = {
    month: '',
    birthdays: [],
  };

  constructor(private router: Router) {}

  onGoToDetails(birthday: Birthday) {
    this.router.navigate(['birthday', birthday.id]);
  }
}
