import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalizedDatePipe } from '../pipes/localizedDate.pipe';
@NgModule({
  declarations: [LocalizedDatePipe],
  imports: [CommonModule, FormsModule],
  exports: [CommonModule, FormsModule, LocalizedDatePipe],
  providers: [],
})
export class SharedModule {}
