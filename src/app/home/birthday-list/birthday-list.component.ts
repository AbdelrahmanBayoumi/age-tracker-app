import { Component, OnDestroy, OnInit } from '@angular/core';
import { BirthdayService } from 'src/app/birthday/birthday.service';

@Component({
  selector: 'app-birthday-list',
  templateUrl: './birthday-list.component.html',
  styleUrls: ['./birthday-list.component.css'],
})
export class BirthdayListCompnent implements OnInit, OnDestroy {
  birthdays: any = [];
  constructor(private birthdayService: BirthdayService) {}

  ngOnInit(): void {
    this.birthdays = this.birthdayService.getNextBirthdays(
      this.birthdayService.birthdays
    );

    console.log('this.birthdays', this.birthdays);
  }
  ngOnDestroy(): void {}
}
