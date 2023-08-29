import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import * as fromApp from '../../store/app.reducer';
import * as BirthdayActions from '../../birthday/store/birthday.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-add-birthday',
  templateUrl: './add-birthday.component.html',
  styleUrls: ['./add-birthday.component.css'],
})
export class AddBirthdayComponent implements OnInit, OnDestroy {
  isLoading = false;
  errorMessage = '';
  storeSub: any;

  constructor(private router: Router, private store: Store<fromApp.AppState>) {}
  ngOnInit(): void {
    this.storeSub = this.store
      .select('birthdays')
      .subscribe((birthdayState) => {
        if (this.isLoading === true) {
          if (birthdayState.errMsg === '' && birthdayState.loading === false) {
            this.isLoading = birthdayState.loading;
            this.errorMessage = birthdayState.errMsg;
            this.router.navigate(['/']);
            return;
          }
        }
        this.isLoading = birthdayState.loading;
        this.errorMessage = birthdayState.errMsg;
      });
  }

  ngOnDestroy(): void {
    this.storeSub?.unsubscribe();
  }

  backToHome() {
    this.router.navigate(['/']);
  }

  onSubmit(form: NgForm) {
    this.isLoading = true;
    console.log(form.value);

    this.store.dispatch(
      BirthdayActions.addBirthday({
        birthday: {
          name: form.value.name,
          birthday: form.value.birthday,
          relationship: form.value.relationship,
        },
      })
    );
  }
}
