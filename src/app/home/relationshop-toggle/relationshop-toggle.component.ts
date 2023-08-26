import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { BirthdayService } from 'src/app/birthday/birthday.service';

@Component({
  selector: 'app-relationship-toggle',
  templateUrl: './relationshop-toggle.component.html',
  styleUrls: ['./relationshop-toggle.component.css'],
})
export class RelationshipToggleComponent implements OnInit, OnDestroy {
  selectedRelation: string = '-1';
  relationships: Set<string> = new Set<string>();

  constructor(private birhtdayService: BirthdayService) {}

  ngOnInit(): void {
    this.relationships = this.birhtdayService.getRelationships();
  }

  ngOnDestroy(): void {}

  onChooseRelation(relationship: string, index: number) {
    if (relationship === this.selectedRelation) {
      return;
    }
    console.log('onChooseRelation:', relationship);
    this.selectedRelation = relationship;
  }
}
