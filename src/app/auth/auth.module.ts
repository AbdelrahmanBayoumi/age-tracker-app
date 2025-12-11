import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SignupComponent, LoginComponent, AuthComponent, ForgetPasswordComponent],
  imports: [
    SharedModule,
    TranslateModule.forChild(),
    RouterModule.forChild([
      {
        path: '',
        component: AuthComponent,
        children: [
          { path: 'signup', component: SignupComponent },
          { path: 'login', component: LoginComponent },
          {
            path: 'forget-password',
            component: ForgetPasswordComponent,
          },
          { path: '', redirectTo: 'login', pathMatch: 'full' },
        ],
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]),
  ],
  exports: [RouterModule, TranslateModule],
})
export class AuthModule {}
