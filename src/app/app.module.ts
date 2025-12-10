import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgParticlesModule } from 'ng-particles';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AuthInterceptorService } from './auth/auth-before-interceptor.service';
import { CheckAuthAfterRequestInterceptor } from './auth/auth-after-interceptor.service';
import { BirthdayEffects } from './birthday/store/birthday.effects';
import * as fromApp from './store/app.reducer';
import { hydrationMetaReducer } from './store/hydration.reducer';
import { environment } from 'src/environments/environment';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({ declarations: [AppComponent, LandingPageComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        SharedModule,
        ReactiveFormsModule,
        AppRoutingModule,
        NgParticlesModule,
        StoreModule.forRoot(fromApp.appReducer, {
            metaReducers: [hydrationMetaReducer],
        }),
        EffectsModule.forRoot([BirthdayEffects]),
        StoreDevtoolsModule.instrument({ logOnly: environment.production, connectInZone: true }),
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
            registrationStrategy: 'registerWhenStable:30000',
        })], providers: [
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
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
