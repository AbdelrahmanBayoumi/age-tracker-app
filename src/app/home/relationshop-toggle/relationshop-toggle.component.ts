import { Component, OnDestroy, OnInit } from '@angular/core';
import { BirthdayService } from 'src/app/birthday/birthday.service';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import * as BirthdayActions from '../../birthday/store/birthday.actions';

@Component({
  selector: 'app-relationship-toggle',
  templateUrl: './relationshop-toggle.component.html',
  styleUrls: ['./relationshop-toggle.component.css'],
})
export class RelationshipToggleComponent implements OnInit, OnDestroy {
  selectedRelation: string = '-1';
  relationships: Set<string> = new Set<string>();
  relationSub: any;

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
  }

  ngOnDestroy(): void {
    this.relationSub.unsubscribe();
  }

  onChooseRelation(relationship: string, index: number) {
    if (relationship === this.selectedRelation) {
      return;
    }
    this.selectedRelation = relationship;
    this.store.dispatch(BirthdayActions.filterByRelationship({ relationship }));
  }
}
