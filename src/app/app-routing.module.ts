import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';
import { HomeComponent } from './home/home.component';
import { AddBirthdayComponent } from './home/add-birthday/add-birthday.component';
import { BirthdayDetailsCompnent } from './home/birthday-list/birthday-details/birthday-details.component';
import { BirthdaysResolverService } from './birthday/birthday-resolver.service';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'birthday/add-birthday',
    component: AddBirthdayComponent,
    canActivate: [AuthGuard],
  },
  // route for birthday detials based on id
  {
    path: 'birthday/:id',
    component: BirthdayDetailsCompnent,
    canActivate: [AuthGuard],
    resolve: [BirthdaysResolverService],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
