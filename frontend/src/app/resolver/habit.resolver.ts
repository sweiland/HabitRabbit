/** ****************************************************************************
 * habit.resolver.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {HabitService} from '../service/habit.service';

@Injectable({
  providedIn: 'root'
})
export class HabitResolver implements Resolve<Observable<any>> {

  constructor(private habitService: HabitService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.habitService.getHabit(route.paramMap.get('id'));
  }
}
