/** ****************************************************************************
 * user.service.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, Subscription} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly accessTokenLocalStorageKey = 'access_token';
  isLoggedIn = new BehaviorSubject(false);

  constructor(private http: HttpClient, private router: Router, private jwtHelperService: JwtHelperService) {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    if (token) {
      const tokenValid = !this.jwtHelperService.isTokenExpired(token);
      this.isLoggedIn.next(tokenValid);
    }
  }

  login(userData: { username: string; password: string }) {
    this.http.post('/api/api-token-auth/', userData)
      .subscribe((res: any) => {
        this.isLoggedIn.next(true);
        localStorage.setItem('access_token', res.token);
        this.getUser().subscribe((x: any) => {
          return this.http.patch('/api/user/' + x.id + '/update', {last_login: moment()}).subscribe(() => {
            this.router.navigate(['dashboard']);
          });
        });
      }, () => {
        alert('wrong username or password');
      });
  }

  logout() {
    localStorage.removeItem(this.accessTokenLocalStorageKey);
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  hasPermission(permission) {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    const decodedToken = this.jwtHelperService.decodeToken(token);
    const permissions = decodedToken.permissions;
    return permission in permissions;
  }

  getUser() {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    const userID = this.jwtHelperService.decodeToken(token).user_id;
    return this.http.get('api/user/' + userID + '/get');
  }

  getID() {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    return this.jwtHelperService.decodeToken(token).user_id;
  }

  register(user: any) {
    return this.http.post('/api/user/create', user);
  }


  getEmail(email: string) {
    return this.http.get('/api/email/' + email + '/get');
  }

  getNumberOfUsers() {
    return this.http.get('/api/users/number');
  }

  getAll() {
    return this.http.get('/api/user/list');
  }

  getUnique() {
    return this.http.get('/api/user/unique');
  }

  getAUser(id: string) {
    return this.http.get('/api/user/' + id + '/get');
  }

  updateUser(user: any) {
    return this.http.patch('/api/user/' + user.id + '/update', user);

  }

  updatePassword(user: any) {
    if (user.password !== null) {
      return this.http.patch('/api/user/' + user.id + '/update', user);
    }

  }
}
