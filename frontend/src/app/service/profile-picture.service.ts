/*
 * profile-picture.service.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilePictureService {

  constructor(private http: HttpClient) {
  }


  getPicture(profilepicture: any) {
    return this.http.get('/api/profilepicture/' + profilepicture + '/get');
  }
}
