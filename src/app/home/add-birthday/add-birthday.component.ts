import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';

import Swal from 'sweetalert2';

import * as fromApp from '../../store/app.reducer';
import * as BirthdayActions from '../../birthday/store/birthday.actions';
import { State } from '../../birthday/store/birthday.reducer';
import { map } from 'rxjs';
import { Birthday } from 'src/app/birthday/model/birthday.model';

@Component({
  selector: 'app-add-birthday',
  templateUrl: './add-birthday.component.html',
  styleUrls: ['./add-birthday.component.css'],
})
export class AddBirthdayComponent implements OnInit, OnDestroy {
  birthdayForm: FormGroup | undefined;
  avatarPhoto: string = '';
  isLoading = false;
  errorMessage = '';
  storeSub: any;
  storeSub2: any;
  isEditMode = false;
  id: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  private initForm() {
    this.birthdayForm = new FormGroup({
      name: new FormControl('', Validators.required),
      birthday: new FormControl(null, [
        Validators.required,
        this.validBirthday,
      ]),
      relationship: new FormControl('', Validators.required),
    });

    if (this.isEditMode) {
      this.storeSub2 = this.store
        .select('birthdays')
        .pipe(
          map((birthdayState) => {
            return birthdayState.birthdays.find((birthday, index) => {
              return birthday.id === this.id;
            });
          })
        )
        .subscribe((birthday) => {
          console.log('birthday', birthday);
          console.log('this.birthdayForm', this.birthdayForm);
          if (birthday && birthday.image) {
            this.avatarPhoto = birthday.image;
          }
          this.birthdayForm?.patchValue({
            name: birthday?.name,
            birthday: birthday?.birthday,
            relationship: birthday?.relationship,
          });
        });
    }
  }

  private validBirthday(control: FormControl): { [s: string]: boolean } {
    const today = new Date();
    const birthday = new Date(control.value);

    if (birthday > today) {
      return { birthdayNotValid: true };
    }
    return null!;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.isEditMode = params['id'] != null;
      this.initForm();
    });

    this.storeSub = this.store
      .select('birthdays')
      .subscribe(async (birthdayState) => {
        if (this.isAddSuccess(birthdayState)) {
          this.isLoading = birthdayState.loading;
          this.errorMessage = birthdayState.errMsg;

          if (this.isEditMode) {
            await Swal.fire({
              title: 'Birthday updated successfully!',
              icon: 'success',
              showConfirmButton: false,
              timer: 3000,
              position: 'center',
            });
          } else {
            await Swal.fire({
              title: 'Birthday added successfully!',
              icon: 'success',
              showConfirmButton: false,
              timer: 3000,
              position: 'center',
            });
          }

          this.router.navigate(['/']);
          return;
        }
        this.isLoading = birthdayState.loading;
        this.errorMessage = birthdayState.errMsg;
      });
  }

  private isAddSuccess(birthdayState: State): boolean {
    return (
      this.isLoading === true &&
      birthdayState.errMsg === '' &&
      birthdayState.loading === false
    );
  }

  ngOnDestroy(): void {
    this.storeSub?.unsubscribe();
    this.storeSub2?.unsubscribe();
  }

  backToHome() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.isLoading = true;
    console.log(this.birthdayForm?.value);

    if (this.isEditMode) {
      this.store.dispatch(
        BirthdayActions.updateBirthday({
          id: this.id!,
          newBirthday: new Birthday(
            -1,
            this.birthdayForm?.value.name,
            this.birthdayForm?.value.birthday,
            this.birthdayForm?.value.relationship,
            '',
            this.avatarPhoto?.toString()
          ),
        })
      );
    } else {
      this.store.dispatch(
        BirthdayActions.addBirthday({
          birthday: {
            name: this.birthdayForm?.value.name,
            birthday: this.birthdayForm?.value.birthday,
            relationship: this.birthdayForm?.value.relationship,
          },
        })
      );
    }
  }

  onUpdatePhoto(photo: string) {
    this.avatarPhoto = photo;
  }
}
