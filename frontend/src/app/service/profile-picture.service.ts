/** ****************************************************************************
 * profile-picture.service.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

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
    return this.http.get('api/profilepicture/' + id + '/get');
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
