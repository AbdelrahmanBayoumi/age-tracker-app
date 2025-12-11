import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guard/auth.guard';
import { BirthdaysResolverService } from '../birthday/birthday-resolver.service';
import { AddBirthdayComponent } from './add-birthday/add-birthday.component';
import { BirthdayDetailsComponent } from './birthday-list/birthday-details/birthday-details.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'birthday/add-birthday',
    component: AddBirthdayComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'birthday/:id',
    component: BirthdayDetailsComponent,
    canActivate: [AuthGuard],
    resolve: [BirthdaysResolverService],
  },
  {
    path: 'birthday/:id/edit',
    component: AddBirthdayComponent,
    canActivate: [AuthGuard],
    resolve: [BirthdaysResolverService],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
