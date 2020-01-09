import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from '../service/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<Observable<any>> {

  constructor(private userService: UserService) {
  }

  resolve() {
    return this.userService.getAll();
  }
}
