import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.css', './login.component.css'],
})
export class LoginComponent {
  constructor(private asc: AuthService) {}

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.asc.login();
  }
}
