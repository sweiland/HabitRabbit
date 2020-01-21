/*
 * dashboard.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {HabitService} from '../service/habit.service';
import * as moment from 'moment';
import {UserService} from '../service/user.service';
import {ActivatedRoute} from '@angular/router';

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

  constructor(private breakpointObserver: BreakpointObserver, private habitService: HabitService, private userService: UserService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    if (data.habits) {
      this.habits = data.habits;
    }
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
      this.habits.filter((x) => {
        return x.id === id;
      }).map((x) => {
        x.today = true;
        return x;
      });
      this.ngOnInit();
    });
  }
}
