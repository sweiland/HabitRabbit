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
      const today = moment().startOf('day');
      const start = moment(x.start_date).startOf('day');
      const end = moment(x.end_date).startOf('day');
      x.today = moment(x.last_click).add(x.interval - 1, 'day').startOf('day').isSameOrAfter(today);
      const duration = end.diff(start, 'day');
      const done = start.diff(today, 'day') * -1;
      const percentage = (done / duration * 100);
      const left = end.diff(today, 'day');
      x.left = left < 0 ? left * -1 : left;
      x.percentage = percentage < 0 || percentage > 100 ? '0' : percentage.toFixed(0);
      x.duration = duration < 0 ? duration * -1 : duration;
      x.done = done < 0 ? '0' : done;
      return x;
    });
  }
}
