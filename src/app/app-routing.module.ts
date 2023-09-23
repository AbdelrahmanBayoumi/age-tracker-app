import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';
import { HomeComponent } from './home/home.component';
import { AddBirthdayComponent } from './home/add-birthday/add-birthday.component';
import { BirthdayDetailsCompnent } from './home/birthday-list/birthday-details/birthday-details.component';
import { BirthdaysResolverService } from './birthday/birthday-resolver.service';
import { CropComponent } from './crop/crop.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'birthday/add-birthday',
    component: AddBirthdayComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'birthday/:id',
    component: BirthdayDetailsCompnent,
    canActivate: [AuthGuard],
    resolve: [BirthdaysResolverService],
  },
  {
    path: 'birthday/:id/edit',
    component: AddBirthdayComponent,
    canActivate: [AuthGuard],
    resolve: [BirthdaysResolverService],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'crop',
    component: CropComponent,
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
