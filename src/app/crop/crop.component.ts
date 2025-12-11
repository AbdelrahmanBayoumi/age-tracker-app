import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.scss'],
  standalone: false,
})
export class CropComponent {
  @Output() doneImageCrop = new EventEmitter<Blob>();
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('dropZone') dropZone: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;

  get imageSelected(): boolean {
    return this.showCropper;
  }

  fileChangeEvent(event: any): void {
    console.log('fileChangeEvent', event);
    if (event.target.files[0].size > 5 * 1024 * 1024) {
      this.bigFileAlert();
      return;
    }
    if (!event.target.files[0].type.startsWith('image/')) {
      this.selectImageAlert();
      return;
    }
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log('imageCropped', event);
    this.croppedImage = event.blob;
  }

  imageLoaded() {
    console.log('Image loaded');
    this.showCropper = true;
  }

  loadImageFailed() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Image load failed!',
    });
  }

  openFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  removeImage() {
    this.imageChangedEvent = '';
    this.croppedImage = null;
    this.showCropper = false;
    this.fileInput.nativeElement.value = '';
  }

  saveImage() {
    this.doneImageCrop.emit(this.croppedImage);
    this.removeImage();
  }

  close(event: MouseEvent) {
    if (
      event.target instanceof HTMLElement &&
      (event.target.classList.contains('crop-popup') || event.target.classList.contains('close-btn'))
    ) {
      this.closeModal.emit();
    }
  }

  private selectImageAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please select an image file!',
    });
  }

  private bigFileAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'File size must be less than 5MB!',
    });
  }

  // ------- handle drag and drop -------
  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (!this.dropZone.nativeElement.classList.contains('drag-over')) {
      this.dropZone.nativeElement.classList.add('drag-over');
    }
  }

  onDragLeave() {
    console.log('onDragLeave');
    this.dropZone.nativeElement.classList.remove('drag-over');
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const files = event.dataTransfer.files;
      this.handleDroppedFiles(files);
    }
  }

  private handleDroppedFiles(files: FileList) {
    if (files.length > 0) {
      this.fileInput.nativeElement.files = files;
      this.fileInput.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}
