import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  isLoading = false;
  authSub: any;
  isEditMode = false;
  userForm: FormGroup;
  private currentUser: any;
  fileSizeError = false;
  image: { fileURL: string; fileObject?: File } = {
    fileURL: '',
  };

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
  }

  get hasImage() {
    return (
      this.image &&
      this.image?.fileURL !== '' &&
      this.image?.fileURL !== null &&
      this.image?.fileURL !== undefined
    );
  }

  get userPhotoUrl() {
    if (this.hasImage) {
      return this.image?.fileURL;
    }
    return '/assets/images/no-image.png';
  }

  ngOnInit(): void {
    this.initFormWithUser();
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  private initFormWithUser() {
    this.authSub = this.authService.user.subscribe((user) => {
      this.currentUser = user;
      this.userForm?.patchValue({
        name: this.currentUser?.fullName,
        email: this.currentUser?.email,
        birthday: this.currentUser?.birthday,
      });
      this.image = {
        fileURL: this.currentUser?.image,
      };
    });
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
      .updateUser(
        this.userForm.value.name,
        this.userForm.value.email,
        this.userForm.value.birthday,
        this.image
      )
      .pipe(take(1))
      .subscribe((e) => {
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
  openFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  addPhoto(event: any) {
    this.image.fileObject = <File>event.target.files[0];
    if (!this.image.fileObject) {
      return;
    }
    console.log('this.image.fileObject', this.image.fileObject);

    if (this.image.fileObject.size > 2 * 1024 * 1024) {
      this.fileSizeError = true;
      console.log('this.fileSizeError', this.fileSizeError);

      this.image.fileObject = undefined;
      return;
    }
    this.image.fileURL = URL.createObjectURL(event.target.files[0]);
    this.fileSizeError = false;
  }

  removePhoto() {
    this.image = {
      fileURL: '',
      fileObject: undefined,
    };
    this.fileSizeError = false;
  }
}
