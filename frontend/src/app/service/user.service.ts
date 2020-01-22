/*
 * user.service.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';
import {User} from '../user';
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

  login(userData: { username: string, password: string }) {
    this.http.post('/api/api-token-auth/', userData)
      .subscribe((res: any) => {
        this.isLoggedIn.next(true);
        localStorage.setItem('access_token', res.token);
        this.getUser().subscribe((x: any) => {
          return this.http.patch('/api/user/' + x.id + '/update', {last_login: moment()}).subscribe((x2: any) => {
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

  getAUser(id: string) {
    return this.http.get('/api/user/' + id + '/get');
  }

  updateUser(user: any) {
    return this.http.patch('/api/user/' + user.id + '/update', user);

  }

  updatePassword(user: any) {
    if (user.password !== undefined) {
      return this.http.patch('/api/user/' + user.id + '/update', user);
    }

  }

  logActive(ID: number) {
    return this.getUser().subscribe((res: User) => {
      const streak = res.streak + 1;
      const add = this.getsPoints(streak);
      const score = res.score + add;
      const level = this.getLevel(score);
      return this.http.patch('/api/user/' + ID + '/update', {
        streak,
        score,
        level
      }).subscribe();
    });
  }

  getsPoints(streak: number) {
    if (streak < 14) {
      return 2;
    }
    if (streak < 30) {
      return 4;
    }
    if (streak < 90) {
      return 8;
    }
    return 10;
  }

  getLevel(score: number) {
    const withoutModulo = score - (score % 20);
    return withoutModulo / 20;
  }
}
