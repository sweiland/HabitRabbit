/*
 * dashboard.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {HabitService} from '../service/habit.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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

  constructor(private breakpointObserver: BreakpointObserver, private habitService: HabitService) {
  }

  ngOnInit(): void {
    this.habitService.getAll().subscribe((res: any) => {
      this.habits = res;
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
}
