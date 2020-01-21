/*
 * profile-picture.service.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfilePictureService {

  currentColor;
  currentPicture;

  constructor(private http: HttpClient) {
  }


  getPicture(profilepicture: any) {
    return this.http.get('/api/profilepicture/' + profilepicture + '/get');
  }

  getColor(id: number) {
    return this.http.get('api/profilepicture/' + id + '/get').subscribe(() => {
    });
  }
}
