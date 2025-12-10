import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './forget-password.component.html',
    styleUrls: ['../auth.component.css'],
    standalone: false
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  @ViewChild('authForm') authForm!: NgForm;

  isLoading: boolean = false;
  private loadingSub: any;
  private userSub: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadingSub = this.authService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  ngOnDestroy(): void {
    this.loadingSub?.unsubscribe();
    this.userSub?.unsubscribe();
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.userSub = this.authService.forgetPassword(form.value.email).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'We send temp password to your email',
          text: 'Please use it to login and change your password',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        this.authService.isLoading.next(false);
      },
      error: (errorRes) => {
        console.log(errorRes);
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong, please try again later',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        this.authService.isLoading.next(false);
      },
    });
  }
}
