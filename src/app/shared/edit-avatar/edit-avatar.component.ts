import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-edit-avatar',
  templateUrl: './edit-avatar.component.html',
  styleUrls: ['./edit-avatar.component.scss'],
})
export class EditAvatarComponent implements OnInit {
  @ViewChild('avatarImg', { static: true }) avatarImgElement:
    | ElementRef
    | undefined;

  @Input() photo: string | ArrayBuffer | null = '';
  @Output() photoUpdated = new EventEmitter<string | ArrayBuffer | null>();

  showAddPhotoOverlay = false;

  constructor() {}

  ngOnInit() {}

  addPhoto(event: any) {
    console.log('event', event);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.avatarImgElement?.nativeElement?.setAttribute(
        'src',
        fileReader.result as string
      );
      this.photo = fileReader.result;
      this.photoUpdated.emit(this.photo);
    };
    fileReader.readAsDataURL(event.target.files[0]);
  }

  openFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
    this.showAddPhotoOverlay = false;
  }

  removePhoto() {
    if (this.avatarImgElement?.nativeElement) {
      this.avatarImgElement.nativeElement.src = '';
    }

    this.photo = '';
    this.photoUpdated.emit(this.photo);
  }
}
