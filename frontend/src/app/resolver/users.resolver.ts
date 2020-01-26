/** ****************************************************************************
 * users.resolver.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class UsersResolver implements Resolve<Observable<any>> {

  constructor(private userService: UserService) {
  }

  resolve() {
    return this.userService.getAll();
  }
}
