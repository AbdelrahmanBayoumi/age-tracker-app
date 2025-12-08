import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalizedDatePipe } from '../pipes/localizedDate.pipe';
import { HorizontalScrollDirective } from '../directives/horizontal-scroll.directive';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { NumberWithCommasPipe } from '../pipes/number-with-commas.pipe';
import { CropComponent } from '../crop/crop.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LocalizedDatePipe,
    DateFormatPipe,
    NumberWithCommasPipe,
    HorizontalScrollDirective,
    CropComponent,
  ],
  imports: [CommonModule, FormsModule, ImageCropperModule, TranslateModule],
  exports: [
    CommonModule,
    FormsModule,
    LocalizedDatePipe,
    DateFormatPipe,
    NumberWithCommasPipe,
    HorizontalScrollDirective,
    CropComponent,
  ],
  providers: [],
})
export class SharedModule {}
