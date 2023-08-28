import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { HorizontalScrollDirective } from './directives/horizontal-scroll.directive';
import { RelationshipToggleComponent } from './home/relationshop-toggle/relationshop-toggle.component';
import { BirthdayListCompnent } from './home/birthday-list/birthday-list.component';
import { BirthdayItemCompnent } from './home/birthday-list/birthday-item/birthday-item.component';
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HorizontalScrollDirective,
    RelationshipToggleComponent,
    BirthdayListCompnent,
    BirthdayItemCompnent,
    HomeComponent,
    DateFormatPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
