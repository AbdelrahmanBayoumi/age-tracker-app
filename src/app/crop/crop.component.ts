import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.css'],
})
export class CropComponent {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('dropZone') dropZone: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  constructor(private sanitizer: DomSanitizer) {}

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

    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl!);
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

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
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
    Swal.fire({
      icon: 'success',
      title: 'Image saved!',
      showConfirmButton: false,
      timer: 1500,
    });
    this.removeImage();
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
      this.fileInput.nativeElement.dispatchEvent(
        new Event('change', { bubbles: true })
      );
    }
  }
}
