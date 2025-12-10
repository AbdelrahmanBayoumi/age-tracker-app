import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { BirthdayService } from '../../birthday/birthday.service';
import { Birthday } from '../../birthday/model/birthday.model';
import { selectFilteredBirthdays } from '../../birthday/store/birthday.selectors';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-birthday-list',
  templateUrl: './birthday-list.component.html',
  styleUrls: ['./birthday-list.component.css'],
  standalone: false,
})
export class BirthdayListComponent implements OnInit {
  birthdays: { month: string; birthdays: Birthday[] }[] = [];

  constructor(
    private birthdayService: BirthdayService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectFilteredBirthdays)
      .subscribe((birthdays: Birthday[]) => (this.birthdays = this.birthdayService.getNextBirthdays(birthdays)));
  }
}
