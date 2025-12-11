import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { BirthdayService } from '../../birthday/birthday.service';
import * as BirthdayActions from '../../birthday/store/birthday.actions';
import { selectRelationshipSelected } from '../../birthday/store/birthday.selectors';

@Component({
  selector: 'app-relationship-toggle',
  templateUrl: './relationship-toggle.component.html',
  styleUrls: ['./relationship-toggle.component.scss'],
  standalone: false,
})
export class RelationshipToggleComponent {
  private store = inject(Store);
  private birthdayService = inject(BirthdayService);

  relationships: Set<string> = new Set<string>();
  selectedRelation = this.store.selectSignal(selectRelationshipSelected);

  constructor() {
    // Subscribe to relationships from the service (still Observable-based)
    this.birthdayService.getRelationships().subscribe(relationships => {
      this.relationships = relationships;
    });
  }

  onChooseRelation(relationship: string, index: number) {
    if (relationship === this.selectedRelation()) {
      return;
    }
    this.store.dispatch(BirthdayActions.filterByRelationship({ relationship }));
  }
}
