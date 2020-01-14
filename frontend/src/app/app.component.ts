/*
 * app.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import {UserService} from './service/user.service';
import {ProfilePictureService} from './service/profile-picture.service';
import {subscribeOn} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  isLoggedIn = false;
  ppColor;
  colorPP;
  user = null;

  colorNames = {
    r: '#d4002d',
    g: '#76b82a',
    t: '#00afcb',
    y: '#f8ff2e',
    o: '#ec6608',
    v: '#673ab7',
    b: '#3876cf',
    w: '#c49052',
  };

  constructor(private userService: UserService, private profilePictureService: ProfilePictureService) {
  }

  ngOnInit() {
    this.userService.isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    if (this.user == null) {
      this.userService.getUser().subscribe((res) => {
        this.user = res;
        console.log('number' + res.profile_picture);
        this.ppColor = this.profilePictureService.getPicture(res.profile_picture)
          .subscribe( (response: any) => {
            this.colorPP = response.color;
            console.log(this.colorPP);
          } );
      });
    }
  }

}
