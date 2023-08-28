import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BirthdayService } from '../../birthday/birthday.service';
import * as fromApp from '../../store/app.reducer';
import * as BirthdayActions from '../../birthday/store/birthday.actions';
import { map } from 'rxjs';
import { Birthday } from '../../birthday/model/birthday.model';

@Component({
  selector: 'app-birthday-list',
  templateUrl: './birthday-list.component.html',
  styleUrls: ['./birthday-list.component.css'],
})
export class BirthdayListCompnent implements OnInit, OnDestroy {
  birthdays: any = [];
  constructor(
    private birthdayService: BirthdayService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(BirthdayActions.fetchBirthdays());

    this.store
      .select('birthdays')
      .pipe(
        map((birthdayState) => {
          // filter by relationship
          if (birthdayState.relationshipSelected !== '-1') {
            return birthdayState.birthdays.filter((birthday: Birthday) => {
              return (
                birthday.relationship === birthdayState.relationshipSelected
              );
            });
          } else {
            return birthdayState.birthdays;
          }
        })
      )
      .subscribe((birthdays: Birthday[]) => {
        console.log('birthdays', birthdays);
        this.birthdays = this.birthdayService.getNextBirthdays(birthdays);
      });
  }
  ngOnDestroy(): void {}
}
