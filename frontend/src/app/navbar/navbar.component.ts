/*
 * navbar.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../service/user.service';
import {ProfilePictureService} from '../service/profile-picture.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() username: string;
  @Input() color: string;
  profilepictures: any[];
  testcolor = '';
  ppColor;
  colorPP;
  isLoggedIn = false;
  user = null;

  constructor(private http: HttpClient, private userService: UserService, private profilePictureService: ProfilePictureService) {
  }

  ngOnInit() {
    this.userService.isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    if (this.user == null) {
      this.userService.getUser().subscribe((res: any) => {
        this.user = res;
        console.log('number' + res.profile_picture);
        this.ppColor = this.profilePictureService.getPicture(res.profile_picture)
          .subscribe( (response: any) => {
            const colorKey = response.color;
            this.colorPP = this.getColorVal(response.color);
            console.log(this.colorPP);
          } );
      });
    }
  }

  getColorVal(letter: string) {
    if (letter === 'r') { return '#d4002d'; }
    if (letter === 'g') { return '#76b82a'; }
    if (letter === 't') { return '#00afcb'; }
    if (letter === 'y') { return '#f8ff2e'; }
    if (letter === 'o') { return '#ec6608'; }
    if (letter === 'v') { return '#673ab7'; }
    if (letter === 'b') { return '#3876cf'; }
    if (letter === 'w') { return '#c49052'; }
  }

}
