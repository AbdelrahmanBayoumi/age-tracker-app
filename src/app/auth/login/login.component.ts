import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Observable, catchError, map, of, switchMap, take, tap } from 'rxjs';
import { User } from '../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.css', './login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
  ngOnDestroy(): void {
    this.authService.isLoading.unsubscribe();
  }
  onSubmit(form: NgForm) {
    console.log(form.value);
    this.authService
      .login(form.value.email, form.value.password)
      .subscribe({
        next: (user: User) => {
          console.log(user);
          this.router.navigate(['/']);
          this.errorMessage = '';
        },
        error: (errorRes) => {
          console.log(errorRes);
          this.errorMessage = errorRes;
        }
      });
  }
}
