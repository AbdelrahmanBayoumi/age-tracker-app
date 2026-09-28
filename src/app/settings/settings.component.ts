import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { createEmptyImage, getImageUrl, hasImage, ImageFile, isFileSizeValid } from '../core/utils/image.utils';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: false,
})
export class SettingsComponent implements OnInit, OnDestroy {
  isLoading = false;
  isEditMode = false;
  userForm: FormGroup;
  private currentUser: any;
  fileSizeError = false;
  image: ImageFile = createEmptyImage();

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      birthday: [null, Validators.required],
    });

    effect(() => {
      const user = this.authService.user();
      if (user) {
        this.currentUser = user;
        this.userForm.patchValue({
          name: user.fullName,
          email: user.email,
          birthday: user.birthday,
        });
        this.image = {
          fileURL: user.image,
        };
      }
    });
  }

  get hasImageValue(): boolean {
    return hasImage(this.image);
  }

  get userPhotoUrl(): string {
    return getImageUrl(this.image);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.image.fileURL && this.image.fileURL.startsWith('blob:')) {
      URL.revokeObjectURL(this.image.fileURL);
    }
  }

  backToHome() {
    this.router.navigate(['/home']);
  }

  onStartEdit() {
    this.isEditMode = true;
  }

  onSubmit() {
    this.fileSizeError = false;
    this.isEditMode = false;
    this.isLoading = true;
    const formVal = this.userForm.getRawValue();

    this.authService
      .updateUser(formVal.name, formVal.email, formVal.birthday, this.image)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire({
            title: this.translate.instant('UPDATE_ACCOUNT_SUCCESS_TITLE'),
            text: this.translate.instant('UPDATE_ACCOUNT_SUCCESS_MESSAGE'),
            icon: 'success',
            confirmButtonText: 'Ok',
          });
        },
        error: err => {
          this.isLoading = false;
          Swal.fire({
            title: this.translate.instant('error') || 'Error',
            text: err?.message || 'Failed to update account',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        },
      });
  }

  showMyAgeStat() {
    this.router.navigate(['/birthday/me']);
  }

  changePassword() {
    this.router.navigate(['/settings/change-password']);
  }

  async deleteAccount() {
    const result = await Swal.fire({
      title: this.translate.instant('DELETE_ACCOUNT_TITLE'),
      text: this.translate.instant('DELETE_ACCOUNT_MESSAGE'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('DELETE_ACCOUNT_CONFIRMATION'),
      cancelButtonText: this.translate.instant('DELETE_ACCOUNT_CANCEL'),
      cancelButtonColor: 'green',
      confirmButtonColor: '#d33',
    });

    if (result.isConfirmed) {
      this.authService
        .deleteAccount()
        .pipe(take(1))
        .subscribe(() => {
          Swal.fire(
            this.translate.instant('DELETE_ACCOUNT_SUCCESS_MESSAGE'),
            this.translate.instant('DELETE_ACCOUNT_SUCCESS_MESSAGE'),
            'success'
          );
          this.router.navigate(['/auth/signup']);
        });
    }
  }

  openFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  addPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!isFileSizeValid(file)) {
      this.fileSizeError = true;
      return;
    }

    if (this.image.fileURL && this.image.fileURL.startsWith('blob:')) {
      URL.revokeObjectURL(this.image.fileURL);
    }

    this.image.fileObject = file;
    this.image.fileURL = URL.createObjectURL(file);
    this.fileSizeError = false;
  }

  removePhoto(): void {
    if (this.image.fileURL && this.image.fileURL.startsWith('blob:')) {
      URL.revokeObjectURL(this.image.fileURL);
    }
    this.image = createEmptyImage();
    this.fileSizeError = false;
  }
}
