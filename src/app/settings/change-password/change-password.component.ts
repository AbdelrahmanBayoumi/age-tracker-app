import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['../settings.component.css', './change-password.component.css'],
})
export class ChagePasswordComponent implements OnInit, OnDestroy {
  isLoading = false;
  errorMessage = '';
  authSub: any;
  userForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassowrd: ['', [Validators.required, Validators.minLength(6)]],
        reNewPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validator: this.checkPasswords }
    );
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('newPassowrd')?.value;
    const confirmPass = group.get('reNewPassword')?.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  backToHome() {
    this.router.navigate(['/settings']);
  }

  onSubmit() {
    this.isLoading = true;
    this.authService
      .changePassword(
        this.userForm.value.currentPassword,
        this.userForm.value.newPassowrd
      )
      .subscribe({
        next: (user: any) => {
          this.isLoading = false;
          this.errorMessage = '';
          Swal.fire({
            title: 'Success!',
            text: 'Your password has been changed successfully!',
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/settings']);
            }
          });
        },
        error: (errorRes) => {
          console.log(errorRes);

          this.isLoading = false;
          this.errorMessage = errorRes.error.message;
        },
      });
  }
}
