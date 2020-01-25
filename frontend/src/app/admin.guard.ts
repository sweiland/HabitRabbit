/** ****************************************************************************
 * admin.guard.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from './service/user.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  loggedIn;
  access;

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.loggedIn = this.userService.isLoggedIn.pipe(
      map((isLoggedIn) => {
        this.loggedIn = isLoggedIn;
        if (!this.loggedIn) {
          this.router.navigate(['login']);
        } else {
          this.userService.getUser().subscribe((res: any) => {
            if (!res.is_superuser) {
              this.router.navigate(['dashboard']);
              this.loggedIn = false;
            } else {
              this.loggedIn = true;
            }
          });
        }
        return isLoggedIn;
      })
    );
  }
}
