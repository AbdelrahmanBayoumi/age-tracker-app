import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  appName: string = 'متتبع الأعمار';

  constructor() {}

  onSubmit(form: NgForm) {
  }
}
