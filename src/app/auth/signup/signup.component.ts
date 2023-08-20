import { AuthService } from './../auth.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../auth.component.css', './signup.component.css'],
})
export class SignupComponent {
  constructor() {}

  onSubmit(form: NgForm) {
    console.log(form.value);
  }
}
