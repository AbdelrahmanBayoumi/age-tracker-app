import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HomeComponent } from './home/home.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-before-interceptor.service';
import { HorizontalScrollDirective } from './directives/horizontal-scroll.directive';
import { RelationshipToggleComponent } from './home/relationshop-toggle/relationshop-toggle.component';
import { BirthdayListCompnent } from './home/birthday-list/birthday-list.component';
import { BirthdayGroupCompnent } from './home/birthday-list/birthday-group/birthday-group.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { BirthdayEffects } from './birthday/store/birthday.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import * as fromApp from './store/app.reducer';
import { environment } from 'src/environments/environment';
import { AddBirthdayComponent } from './home/add-birthday/add-birthday.component';
import { CheckAuthAfterRequestInterceptor } from './auth/auth-after-interceptor.service';
import { BirthdayDetailsCompnent } from './home/birthday-list/birthday-details/birthday-details.component';
import { NumberWithCommasPipe } from './pipes/number-with-commas.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CropComponent } from './crop/crop.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BirthdayCardompnent } from './home/birthday-list/birthday-card/birthday-card.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NgParticlesModule } from 'ng-particles';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from './shared/language.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    HorizontalScrollDirective,
    RelationshipToggleComponent,
    BirthdayListCompnent,
    BirthdayGroupCompnent,
    BirthdayCardompnent,
    AddBirthdayComponent,
    HomeComponent,
    BirthdayDetailsCompnent,
    DateFormatPipe,
    NumberWithCommasPipe,
    CropComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ImageCropperModule,
    NgParticlesModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([BirthdayEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CheckAuthAfterRequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
