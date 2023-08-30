import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Store } from '@ngrx/store';

import Swal from 'sweetalert2';

import * as fromApp from '../store/app.reducer';
import * as BirthdayActions from '../birthday/store/birthday.actions';
import { State } from '../birthday/store/birthday.reducer';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  isLoading = false;
  errorMessage = '';
  authSub: any;
  isEditMode = false;
  userForm: FormGroup;
  private currentUser: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      birthday: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.initFormWithUser();
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  private initFormWithUser() {
    this.authSub = this.authService.user.subscribe((user) => {
      this.currentUser = user;
      this.userForm?.patchValue({
        name: this.currentUser?.fullName,
        email: this.currentUser?.email,
        birthday: this.currentUser?.birthday,
      });
    });
  }

  backToHome() {
    this.router.navigate(['/']);
  }

  onStartEdit() {
    this.isEditMode = true;
  }

  onSubmit() {
    this.isEditMode = false;
    this.isLoading = true;
    this.authService
      .updateUser(
        this.userForm.value.name,
        this.userForm.value.email,
        this.userForm.value.birthday
      )
      .subscribe(() => {
        this.isLoading = false;
        Swal.fire({
          title: 'Success!',
          text: 'Your profile has been updated.',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
      });
  }

  showMyAgeStat() {}

  changePassword() {}

  async deleteAccount() {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover your account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it!',
      cancelButtonColor: 'green',
      confirmButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      this.authService.deleteAccount().subscribe(() => {
        Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
        this.router.navigate(['/auth/signup']);
      });
    }
  }
}
