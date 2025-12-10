import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { BirthdayService } from '../../birthday/birthday.service';
import * as BirthdayActions from '../../birthday/store/birthday.actions';
import { selectRelationshipSelected } from '../../birthday/store/birthday.selectors';
import * as fromApp from '../../store/app.reducer';

@Component({
    selector: 'app-relationship-toggle',
    templateUrl: './relationship-toggle.component.html',
    styleUrls: ['./relationship-toggle.component.css'],
    standalone: false
})
export class RelationshipToggleComponent implements OnInit, OnDestroy {
  selectedRelation: string = '-1';
  relationships: Set<string> = new Set<string>();
  relationSub: Subscription | undefined;

  constructor(
    private birthdayService: BirthdayService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.relationSub = this.birthdayService
      .getRelationships()
      .subscribe((relationships) => {
        this.relationships = relationships;
      });

    this.store.select(selectRelationshipSelected).subscribe((relationship) => {
      this.selectedRelation = relationship;
    });
  }

  ngOnDestroy(): void {
    this.relationSub?.unsubscribe();
  }

  onChooseRelation(relationship: string, index: number) {
    if (relationship === this.selectedRelation) {
      return;
    }
    this.selectedRelation = relationship;
    this.store.dispatch(BirthdayActions.filterByRelationship({ relationship }));
  }
}
