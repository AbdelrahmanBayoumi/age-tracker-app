import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BirthdayService } from 'src/app/birthday/birthday.service';
import { Birthday } from 'src/app/birthday/model/birthday.model';

@Component({
  selector: 'app-birthday-item',
  templateUrl: './birthday-item.component.html',
  styleUrls: ['./birthday-item.component.css'],
})
export class BirthdayItemCompnent implements OnInit, OnDestroy {
  @Input() birthdays: { month: string; birthdays: Birthday[] } = {
    month: '',
    birthdays: [],
  };

  constructor(private birthdayService: BirthdayService) {}

  ngOnInit(): void {
    console.log('this.birthday', this.birthdays);
    this.birthdays.birthdays
  }

  ngOnDestroy(): void {}
}
