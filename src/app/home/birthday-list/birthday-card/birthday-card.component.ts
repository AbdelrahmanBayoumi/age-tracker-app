import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Birthday } from 'src/app/birthday/model/birthday.model';

@Component({
  selector: 'app-birthday-card',
  templateUrl: './birthday-card.component.html',
  styleUrls: ['./birthday-card.component.css'],
})
export class BirthdayCardompnent implements OnInit, OnDestroy {
  @Input() birthday: Birthday | null = null;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
