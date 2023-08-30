import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { ChagePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [SettingsComponent, ChagePasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingsComponent,
      },
      { path: 'change-password', component: ChagePasswordComponent },
      // { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]),
  ],
  exports: [RouterModule],
})
export class SettingsModule {}
