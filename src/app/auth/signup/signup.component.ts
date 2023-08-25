import { AuthService } from './../auth.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupDto } from '../dto/signup.dto';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../auth.component.css', './signup.component.css'],
})
export class SignupComponent {
  errorMessage: string = '';
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
    this.userSub = this.authService
      .signup(
        new SignupDto(
          form.value.email,
          form.value.password,
          form.value.fullName,
          form.value.birthdate
        )
      )
      .subscribe({
        next: (user: any) => {
          this.router.navigate(['/']);
          this.errorMessage = '';
        },
        error: (errorRes) => {
          console.log(errorRes);
          this.errorMessage = errorRes;
        },
      });
  }
}
