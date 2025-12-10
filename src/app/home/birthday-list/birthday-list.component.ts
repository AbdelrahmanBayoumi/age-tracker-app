import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { BirthdayService } from '../../birthday/birthday.service';
import { selectFilteredBirthdays } from '../../birthday/store/birthday.selectors';

@Component({
  selector: 'app-birthday-list',
  templateUrl: './birthday-list.component.html',
  styleUrls: ['./birthday-list.component.scss'],
  standalone: false,
})
export class BirthdayListComponent {
  private store = inject(Store);
  private birthdayService = inject(BirthdayService);

  private filteredBirthdays = this.store.selectSignal(selectFilteredBirthdays);
  birthdays = computed(() => this.birthdayService.getNextBirthdays(this.filteredBirthdays()));
}
