/*
 * profile-picture-form.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {UserService} from '../service/user.service';
import {ProfilePictureService} from '../service/profile-picture.service';

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
  colorPP = '#000000';
  colorFF = '#ffffff';
  picturesource;
  hoverActive;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private userService: UserService,
              private profilePictureService: ProfilePictureService) {
  }

  ngOnInit() {
    this.userService.getUser().subscribe((res: any) => {
      this.currentId = res.id;
      this.pictureId = res.profile_picture;
      this.http.get('api/profilepicture/' + this.pictureId + '/get')
        .subscribe((response: any) => {
          this.colorPP = this.getColorVal(response.color);
          this.picturesource = '../../assets/Resources/profile_pictures/carrot' + response.picture + '.svg';
        });
      console.log('id=' + res.id);
      console.log('id=' + res.profile_picture);
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
        if (this.pictureId != null) {
          this.http.patch('/api/profilepicture/' + this.pictureId + '/update', {color: colorValue})
            .subscribe((resp: any) => {
            });
          this.colorPP = this.getColorVal(colorValue);
        } else {
          this.http.post('/api/profilepicture/create', profilepicture)
            .subscribe((response: any) => {
              this.http.patch('/api/user/' + this.currentId + '/update', {profile_picture: response.id}).subscribe(() => {
              });
              this.router.navigate(['/profile-picture-form/' + response.id]);
              console.log('patched' + profilepicture.color);
              this.colorPP = this.getColorVal(colorValue);
            });
        }
      });
  }

  onSubmitPicture(image: number) {
    this.pictureForm.patchValue(image);
    const profilepicture = this.pictureForm.value;
    this.http.get('api/user/' + this.currentId + '/get')
      .subscribe((res: any) => {
        if (this.pictureId != null) {
          this.profilePictureService.getPicture(this.pictureId).subscribe((resp: any) => {
            this.currentColor = resp.color;
            console.log(resp.color);
            this.http.patch('/api/profilepicture/' + this.pictureId + '/update', {color: this.currentColor, picture: image})
              .subscribe(() => {
              });
            this.picturesource = '../../assets/Resources/profile_pictures/carrot' + resp.picture + '.svg';
            this.ngOnInit();
            console.log(this.currentColor, image);
          });
        } else {
          this.http.post('/api/profilepicture/create', profilepicture)
            .subscribe((response: any) => {
              this.http.patch('/api/user/' + this.currentId + '/update', {profile_picture: response.id}).subscribe(() => {
              });
              this.picturesource = '../../assets/Resources/profile_pictures/carrot' + response.picture + '.svg';
              this.ngOnInit();
              this.router.navigate(['/profile-picture-form/' + response.id]);
            });
        }
      });
  }

  getColorVal(letter: string) {
    if (letter === 'r') {
      return '#d4002d';
    }
    if (letter === 'g') {
      return '#76b82a';
    }
    if (letter === 't') {
      return '#00afcb';
    }
    if (letter === 'y') {
      return '#f8ff2e';
    }
    if (letter === 'o') {
      return '#ec6608';
    }
    if (letter === 'v') {
      return '#673ab7';
    }
    if (letter === 'b') {
      return '#3876cf';
    }
    if (letter === 'w') {
      return '#c49052';
    }
  }
}
