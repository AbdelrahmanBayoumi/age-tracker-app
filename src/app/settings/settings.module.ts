import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [SettingsComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forChild(),
    RouterModule.forChild([
      {
        path: '',
        component: SettingsComponent,
      },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'my-age-stat', redirectTo: 'birthday/me' },
      // { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]),
  ],
  exports: [RouterModule, TranslateModule],
})
export class SettingsModule {}
