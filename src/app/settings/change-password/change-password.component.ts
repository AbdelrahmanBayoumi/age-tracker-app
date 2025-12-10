import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['../settings.component.css', './change-password.component.css'],
  standalone: false,
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  isLoading = false;
  errorMessage = '';
  authSub: any;
  userForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private translate: TranslateService
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
    this.authService.changePassword(this.userForm.value.currentPassword, this.userForm.value.newPassowrd).subscribe({
      next: (user: any) => {
        this.isLoading = false;
        this.errorMessage = '';
        Swal.fire({
          title: this.translate.instant('UPDATE_ACCOUNT_SUCCESS_TITLE'),
          text: this.translate.instant('UPDATE_PASSWORD_SUCCESS_TITLE'),
          icon: 'success',
          confirmButtonText: this.translate.instant('ok'),
        }).then(result => {
          if (result.isConfirmed) {
            this.router.navigate(['/settings']);
          }
        });
      },
      error: errorRes => {
        console.log(errorRes);

        this.isLoading = false;
        this.errorMessage = errorRes.error.message;
      },
    });
  }
}
