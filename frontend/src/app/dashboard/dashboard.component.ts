/*
 * dashboard.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {HabitService} from '../service/habit.service';
import * as moment from 'moment';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  ID = this.userService.getID();
  habits: any[];

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'Card 1', cols: 1, rows: 1},
          {title: 'Card 2', cols: 1, rows: 1},
          {title: 'Active Habits', cols: 1, rows: 1},
          {title: 'Card 4', cols: 1, rows: 1}
        ];
      }

      return [
        {title: 'Card 1', cols: 2, rows: 1},
        {title: 'Card 2', cols: 1, rows: 1},
        {title: 'Active Habits', cols: 1, rows: 2},
        {title: 'Card 4', cols: 1, rows: 1}
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver, private habitService: HabitService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.habitService.getAll().subscribe((res: any[]) => {
      this.habits = res.filter(e => {
        return e.member_id === this.ID ? e : null;
      });
      this.clickedToday(this.habits);
    });
  }

  progress(id: number) {
    const habit = this.habits.find(e => e.id === id);
    const duration = moment(habit.end_date).startOf('day').diff(moment(habit.start_date).startOf('day'), 'days');
    const done = moment(habit.start_date).startOf('day').diff(moment().startOf('day'), 'days') * -1;
    const left = moment(habit.end_date).startOf('day').diff(moment().startOf('day'), 'days');
    const percentage = done / duration * 100;
    return {duration, left, done, percentage};
  }

  isNumber(num: number) {
    return !isNaN(num);
  }

  logActive(id: string) {
    this.userService.logActive(this.ID);
    this.habitService.updateHabit({
      id,
      last_click: moment().startOf('day')
    }).subscribe(() => {
      this.ngOnInit();
    });
  }

  clickedToday(habit: any[]): any[] {
    return habit.map((x) => {
      this.habitService.getHabit(x.id).subscribe((res: any) => {
        x.today = (moment(res.last_click).startOf('day').isSame(moment().startOf('day')));
        return x;
      });
    });
  }
}
