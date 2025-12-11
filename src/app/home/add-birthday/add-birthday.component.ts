import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import { TranslateService } from '@ngx-translate/core';
import { Birthday } from 'src/app/birthday/model/birthday.model';
import * as BirthdayActions from '../../birthday/store/birthday.actions';
import {
  selectBirthdays,
  selectErrorMessage,
  selectLastAddedBirthdayId,
  selectLoading,
} from '../../birthday/store/birthday.selectors';
import { blobToFile, createEmptyImage, getImageUrl, hasImage, ImageFile } from '../../core/utils/image.utils';

@Component({
  selector: 'app-add-birthday',
  templateUrl: './add-birthday.component.html',
  styleUrls: ['./add-birthday.component.scss'],
  standalone: false,
})
export class AddBirthdayComponent implements OnInit, OnDestroy {
  birthdayForm: FormGroup | undefined;
  image: ImageFile = createEmptyImage();
  fileSizeError = false;
  storeSub2: Subscription | undefined;
  isEditMode = false;
  showCropModal = false;
  id: number | undefined;
  relationshipOptions: string[] = [];

  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private translate = inject(TranslateService);

  isLoading = this.store.selectSignal(selectLoading);
  errorMessage = this.store.selectSignal(selectErrorMessage);
  private birthdays = this.store.selectSignal(selectBirthdays);
  private lastAddedBirthdayId = this.store.selectSignal(selectLastAddedBirthdayId);

  private wasLoading = false;

  constructor() {
    // Extract unique relationships reactively
    effect(() => {
      const relationships = this.birthdays().map(b => b.relationship);
      this.relationshipOptions = [...new Set(relationships)];
    });

    // Handle success navigation
    effect(async () => {
      const loading = this.isLoading();
      const errMsg = this.errorMessage();

      // Detect when loading goes from true to false with no error
      if (this.wasLoading && !loading && errMsg === '') {
        if (this.isEditMode) {
          const translatedTitle = this.translate.instant('BIRTHDAY_UPDATED_SUCCESS_MESSAGE');
          await Swal.fire({
            title: translatedTitle,
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
            position: 'center',
          });
        } else {
          const translatedTitle = this.translate.instant('BIRTHDAY_ADDED_SUCCESS_MESSAGE');
          await Swal.fire({
            title: translatedTitle,
            icon: 'success',
            showConfirmButton: false,
            timer: 3000,
            position: 'center',
          });
          const lastId = this.lastAddedBirthdayId();
          if (lastId) {
            this.router.navigate(['/birthday', lastId]);
            return;
          }
        }
        this.backToHome();
      }
      this.wasLoading = loading;
    });
  }

  private initForm() {
    this.birthdayForm = new FormGroup({
      name: new FormControl('', Validators.required),
      birthday: new FormControl(null, [Validators.required, this.validBirthday]),
      relationship: new FormControl('', Validators.required),
    });

    if (this.isEditMode) {
      const birthday = this.birthdays().find(b => b.id === this.id);
      if (birthday) {
        if (birthday.image) {
          this.image = { fileURL: birthday.image };
        }
        this.birthdayForm.patchValue({
          name: birthday.name,
          birthday: birthday.birthday,
          relationship: birthday.relationship,
        });
      }
    }
  }

  private validBirthday(control: FormControl): { [s: string]: boolean } {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    const birthday = new Date(control.value);

    if (birthday > today) {
      return { birthdayNotValid: true };
    }
    return null!;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.isEditMode = params['id'] != null;
      this.initForm();
    });
  }

  ngOnDestroy(): void {
    this.storeSub2?.unsubscribe();
  }

  backToHome() {
    this.router.navigate(['/home']);
  }

  onSubmit() {
    this.wasLoading = true; // Mark that we started loading
    console.log(this.birthdayForm?.value);

    if (this.isEditMode) {
      this.store.dispatch(
        BirthdayActions.updateBirthday({
          id: this.id!,
          newBirthday: new Birthday(
            -1,
            this.birthdayForm?.value.name,
            this.birthdayForm?.value.birthday,
            this.birthdayForm?.value.relationship,
            ''
          ),
          image: this.image,
        })
      );
    } else {
      this.store.dispatch(
        BirthdayActions.addBirthday({
          birthday: {
            name: this.birthdayForm?.value.name,
            birthday: this.birthdayForm?.value.birthday,
            relationship: this.birthdayForm?.value.relationship,
          },
          image: this.image,
        })
      );
    }
  }

  // ------ Handle photo ------
  get hasImageValue(): boolean {
    return hasImage(this.image);
  }

  get userPhotoUrl(): string {
    return getImageUrl(this.image);
  }

  onDoneCropImage(croppedImage: Blob): void {
    this.image.fileObject = blobToFile(croppedImage, 'croppedImage.png');
    this.image.fileURL = URL.createObjectURL(this.image.fileObject);
    this.showCropModal = false;
  }

  openCropPopup(): void {
    this.showCropModal = true;
  }

  onCloseCropPopup(): void {
    this.showCropModal = false;
  }

  removePhoto(): void {
    this.image = createEmptyImage();
    this.fileSizeError = false;
  }
}
