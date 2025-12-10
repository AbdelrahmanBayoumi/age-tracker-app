import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { CropComponent } from '../crop/crop.component';
import { HorizontalScrollDirective } from '../directives/horizontal-scroll.directive';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { LocalizedDatePipe } from '../pipes/localized-date.pipe';
import { NumberWithCommasPipe } from '../pipes/number-with-commas.pipe';

@NgModule({
  declarations: [LocalizedDatePipe, DateFormatPipe, NumberWithCommasPipe, HorizontalScrollDirective, CropComponent],
  imports: [CommonModule, FormsModule, ImageCropperComponent, TranslateModule],
  exports: [
    CommonModule,
    FormsModule,
    LocalizedDatePipe,
    DateFormatPipe,
    NumberWithCommasPipe,
    HorizontalScrollDirective,
    CropComponent,
    ImageCropperComponent,
  ],
  providers: [],
})
export class SharedModule {}
