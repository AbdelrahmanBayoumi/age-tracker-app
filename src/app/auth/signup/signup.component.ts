import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SignupDto } from '../dto/signup.dto';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../auth.component.scss', './signup.component.scss'],
  standalone: false,
})
export class SignupComponent implements OnDestroy {
  errorMessage: string = '';
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
    this.userSub = this.authService
      .signup(new SignupDto(form.value.email, form.value.password, form.value.fullName, form.value.birthdate))
      .subscribe({
        next: (user: any) => {
          this.router.navigate(['/home']);
          this.errorMessage = '';
        },
        error: errorRes => {
          console.log(errorRes);
          this.errorMessage = errorRes;
        },
      });
  }
}
