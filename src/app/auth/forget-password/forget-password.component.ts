import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './forget-password.component.html',
  styleUrls: ['../auth.component.scss'],
  standalone: false,
})
export class ForgetPasswordComponent implements OnDestroy {
  @ViewChild('authForm') authForm!: NgForm;

  private userSub: Subscription | null = null;

  // Expose the isLoading signal from authService for template binding
  get isLoading() {
    return this.authService.isLoading();
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.userSub = this.authService.forgetPassword(form.value.email).subscribe({
      next: res => {
        Swal.fire({
          title: 'We send temp password to your email',
          text: 'Please use it to login and change your password',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        this.authService.isLoading.set(false);
      },
      error: errorRes => {
        console.log(errorRes);
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong, please try again later',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        this.authService.isLoading.set(false);
      },
    });
  }
}
