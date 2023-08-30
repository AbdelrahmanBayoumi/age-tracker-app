import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingsComponent,
        children: [
          // { path: 'signup', component: SignupComponent },
          // { path: 'login', component: LoginComponent },
          // { path: '', redirectTo: 'login', pathMatch: 'full' },
        ],
      },
      // { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]),
  ],
  exports: [RouterModule],
})
export class SettingsModule {}
