import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  appName = 'متتبع الأعمار';
  constructor() {}
}
