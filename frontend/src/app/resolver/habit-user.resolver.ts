/**********************************************************************************************************************
 * habit-user.resolver.ts Copyright © 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 *                                                                                                                    *
 **********************************************************************************************************************/

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
  ID: number;
  habits: any[];

  constructor(private habitService: HabitService, private userService: UserService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    this.userService.getUser().subscribe((res: any) => {
        this.ID = res.id;
      }
    );
    return this.habitService.getAll();
  }
}
