/*
 * habit.resolver.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {HabitService} from '../service/habit.service';
import * as moment from 'moment';
import {UserService} from '../service/user.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HabitUserResolver implements Resolve<Observable<any>> {
  ID = this.userService.getID();
  habits: any[];

  constructor(private habitService: HabitService, private userService: UserService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.habitService.getAll().pipe(map((res: any[]) => {
      this.habits = res.filter(e => {
        return e.member_id === this.ID ? e : null;
      });
      return this.populateInfo(this.habits);
    }));
  }

  populateInfo(habit: any[]): any[] {
    return habit.map((x) => {
      x.today = moment(x.last_click).startOf('day').isSame(moment().startOf('day'));
      const duration = moment(x.end_date).startOf('day').diff(moment(x.start_date).startOf('day'), 'days');
      const done = moment(x.start_date).startOf('day').diff(moment().startOf('day'), 'days') * -1;
      x.left = moment(x.end_date).startOf('day').diff(moment().startOf('day'), 'days');
      x.percentage = done / duration * 100;
      x.duration = duration;
      x.done = done;
      return x;
    });
  }
}
