import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss', './login.component.scss'],
  standalone: false,
})
export class LoginComponent implements OnDestroy, AfterViewInit {
  @ViewChild('authForm') authForm!: NgForm;

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

  ngAfterViewInit(): void {
    if (this.authForm) {
      setTimeout(() => {
        if (this.authForm) {
          try {
            this.authForm.setValue({
              email: 'test@example.com',
              password: '123456',
            });
          } catch (error) {}
        }
      });
    } else {
    }
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.userSub = this.authService.login(form.value.email, form.value.password).subscribe({
      next: (user: User) => {
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
