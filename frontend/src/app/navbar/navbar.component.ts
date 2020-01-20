/*
 * navbar.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, Injectable, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../service/user.service';
import {ProfilePictureService} from '../service/profile-picture.service';
import {NavbarService} from '../service/navbar.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class NavbarComponent implements OnInit {

  @Input() username: string;
  @Input() color: string;
  profilepictures: any[];
  testcolor = '';
  ppColor;
  colorPP;
  isLoggedIn = false;
  picturesource = '';
  pictureId;
  imageExists = false;
  showComponent;

  constructor(private http: HttpClient, private userService: UserService, private profilePictureService: ProfilePictureService,
              private navbar: NavbarService) {
  }

  ngOnInit() {
    this.navbar.changeColor.subscribe((data) => {
      this.colorPP = data;
    });
    this.navbar.changePicture.subscribe((data) => {
      this.imageExists = true;
      this.picturesource = data;
      console.log(data);
    });
    this.navbar.disablePicture.subscribe(data => {
      this.imageExists = data;
    });
    this.navbar.showPicture.subscribe((data) => {
      this.pictureId = data;
      console.log(this.pictureId, this.colorPP, this.picturesource);
    });
    console.log('då samma');
    this.userService.isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.userService.getUser().subscribe((res: any) => {
      if (res.profile_picture != null) {
        this.ppColor = this.profilePictureService.getPicture(res.profile_picture)
          .subscribe((response: any) => {
            this.pictureId = response.id;
            this.colorPP = this.getColorVal(response.color);
            this.http.get('/api/profilepicture/' + this.pictureId + '/get').subscribe((res2: any) => {
              if (res2.picture) {
                this.imageExists = true;
                this.picturesource = '../../assets/Resources/profile_pictures/carrot' + res2.picture + '.svg';
                console.log(this.picturesource);
              }
            });
          });
      }
    });
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
