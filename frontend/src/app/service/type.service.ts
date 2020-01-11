/*
 * type.service.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get('/api/type/list');
  }
}
