/** ****************************************************************************
 * user.resolver.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<Observable<any>> {

  constructor(private userService: UserService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.userService.getAUser(route.paramMap.get('id'));
  }
}
