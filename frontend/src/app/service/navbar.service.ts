import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  changeColor: EventEmitter<string> = new EventEmitter<string>();
  changePicture: EventEmitter<string> = new EventEmitter<string>();
  showPicture: EventEmitter<string> = new EventEmitter<string>();
  disablePicture: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

}


