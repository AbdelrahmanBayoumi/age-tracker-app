import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  appName: string = 'متتبع الأعمار';

  constructor() {}

  onSubmit(form: NgForm) {
    console.log(form.value);
  }
}
