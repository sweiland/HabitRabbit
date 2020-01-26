/** ********************************************************************************************************************
 * profile-picture-form.component.ts Copyright © 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 *                                                                                                                    *
 **********************************************************************************************************************/

import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../service/user.service';
import {ProfilePictureService} from '../service/profile-picture.service';
import {NavbarService} from '../service/navbar.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile-picture-form',
  templateUrl: './profile-picture-form.component.html',
  styleUrls: ['./profile-picture-form.component.scss']
})

export class ProfilePictureFormComponent implements OnInit {

  colorForm;
  pictureForm;
  currentId;
  currentColor;
  pictureId;
  colorPP;
  colorFF = '#ffffff';
  violet = '#673ab7';
  picturesource;
  hoverActive;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private userService: UserService,
              private profilePictureService: ProfilePictureService, private navbar: NavbarService) {
  }

  ngOnInit() {
    this.userService.getUser().subscribe((res: any) => {
      this.currentId = res.id;
      this.pictureId = res.profile_picture;
      if (this.pictureId) {
        this.http.get('api/profilepicture/' + this.pictureId + '/get')
          .subscribe((response: any) => {
            this.colorPP = this.getColorVal(response.color);
            this.picturesource = '../../assets/Resources/profile_pictures/carrot' + response.picture + '.svg';
          });
      }
    });
    this.colorForm = this.fb.group({
      color: [null]
    });
    this.pictureForm = this.fb.group({
      picture: [null]
    });
  }

  onSubmitColor(colorValue: string) {
    this.colorForm.patchValue({colorValue});
    const profilepicture = this.colorForm.value;
    this.http.get('api/user/' + this.currentId + '/get')
      .subscribe((res: any) => {
        if (this.pictureId !== null) {
          this.http.patch('/api/profilepicture/' + this.pictureId + '/update', {color: colorValue})
            .subscribe((resp: any) => {
            });
          this.colorPP = this.getColorVal(colorValue);
          this.changeColor();
        } else {
          this.http.post('/api/profilepicture/create', {color: colorValue})
            .subscribe((response: any) => {
              this.http.patch('/api/user/' + this.currentId + '/update', {profile_picture: response.id}).subscribe(() => {
              });
              this.colorPP = this.getColorVal(colorValue);
              this.changeColor();
              if (this.pictureId) {
                this.enablePicture();
              }
            });
        }
      });
  }

  onSubmitPicture(image: number) {
    this.pictureForm.patchValue(image);
    const profilepicture = this.pictureForm.value;
    this.http.get('api/user/' + this.currentId + '/get')
      .subscribe((res: any) => {
        if (res.profile_picture !== null) {
          console.log(res.profile_picture);
          this.profilePictureService.getPicture(res.profile_picture).subscribe((resp: any) => {
            this.currentColor = resp.color;
            this.http.patch('/api/profilepicture/' + res.profile_picture + '/update', {picture: image})
              .subscribe((boop: any) => {
                this.picturesource = '../../assets/Resources/profile_pictures/carrot' + image + '.svg';
                this.changePicture();
              });
          });
        } else {
          this.http.post('/api/profilepicture/create', {picture: image})
            .subscribe((response: any) => {
              this.http.patch('/api/user/' + this.currentId + '/update', {profile_picture: response.id}).subscribe(() => {
              });
              this.picturesource = '../../assets/Resources/profile_pictures/carrot' + image + '.svg';
              this.enablePicture();
              this.changePicture();
            });
        }
      });
  }

  onDeleteColor() {
    this.http.patch('api/user/' + this.currentId + '/update', {profile_picture: null}).subscribe(() => {
      this.navbar.showPicture.emit(null);
      this.navbar.changeColor.emit(null);
      this.navbar.changePicture.emit(null);
      this.navbar.disablePicture.emit(false);
      this.pictureId = null;
    });
  }

  enablePicture() {
    this.navbar.showPicture.emit(this.currentId);
    this.navbar.disablePicture.emit(true);
  }

  changeColor() {
    this.navbar.showPicture.emit(this.currentId);
    this.navbar.changeColor.emit(this.colorPP);
  }

  changePicture() {
    this.navbar.changePicture.emit(this.picturesource);
  }

  getColorVal(letter: string) {
    if (letter === 'r') {
      return '#ff1744';
    }
    if (letter === 'g') {
      return '#00e676';
    }
    if (letter === 't') {
      return '#00e5ff';
    }
    if (letter === 'y') {
      return '#ffea00';
    }
    if (letter === 'o') {
      return '#ff9100';
    }
    if (letter === 'v') {
      return '#2979ff';
    }
    if (letter === 'b') {
      return '#b388ff';
    }
    if (letter === 'w') {
      return '#d4e157';
    }
  }
}
