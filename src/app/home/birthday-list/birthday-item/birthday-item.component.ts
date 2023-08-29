import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Birthday } from 'src/app/birthday/model/birthday.model';

@Component({
  selector: 'app-birthday-item',
  templateUrl: './birthday-item.component.html',
  styleUrls: ['./birthday-item.component.css'],
})
export class BirthdayItemCompnent implements OnInit, OnDestroy {
  @Input() birthdaysGroup: { month: string; birthdays: Birthday[] } = {
    month: '',
    birthdays: [],
  };

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onGoToDetails(birthday: Birthday) {
    this.router.navigate(['birthday', birthday.id]);
  }
}
