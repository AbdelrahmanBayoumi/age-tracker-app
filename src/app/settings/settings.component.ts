import { Component, effect, OnInit } from '@angular/core';
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
export class SettingsComponent implements OnInit {
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
    // add general validation to the form
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      birthday: [null, Validators.required],
    });

    // Use effect() to reactively update form when user signal changes
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

  ngOnInit(): void {
    // Form initialization now handled in effect()
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
    console.log('this.userForm.value', this.userForm.value);

    this.authService
      .updateUser(this.userForm.value.name, this.userForm.value.email, this.userForm.value.birthday, this.image)
      .pipe(take(1))
      .subscribe(e => {
        console.log('e', e);
        this.isLoading = false;

        Swal.fire({
          title: this.translate.instant('UPDATE_ACCOUNT_SUCCESS_TITLE'),
          text: this.translate.instant('UPDATE_ACCOUNT_SUCCESS_MESSAGE'),
          icon: 'success',
          confirmButtonText: 'Ok',
        });
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

  // ------ Handle photo ------
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

    this.image.fileObject = file;
    this.image.fileURL = URL.createObjectURL(file);
    this.fileSizeError = false;
  }

  removePhoto(): void {
    this.image = createEmptyImage();
    this.fileSizeError = false;
  }
}
