import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { AddBirthdayComponent } from './add-birthday/add-birthday.component';
import { BirthdayCardComponent } from './birthday-list/birthday-card/birthday-card.component';
import { BirthdayDetailsComponent } from './birthday-list/birthday-details/birthday-details.component';
import { BirthdayGroupComponent } from './birthday-list/birthday-group/birthday-group.component';
import { BirthdayListComponent } from './birthday-list/birthday-list.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { RelationshipToggleComponent } from './relationship-toggle/relationship-toggle.component';

@NgModule({
  declarations: [
    HomeComponent,
    RelationshipToggleComponent,
    BirthdayListComponent,
    BirthdayGroupComponent,
    BirthdayCardComponent,
    AddBirthdayComponent,
    BirthdayDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
