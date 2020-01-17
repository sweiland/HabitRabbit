/*
 * user.service.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly accessTokenLocalStorageKey = 'access_token';
  isLoggedIn = new BehaviorSubject(false);

  constructor(private http: HttpClient, private router: Router, private jwtHelperService: JwtHelperService) {
    const token = localStorage.getItem(this.accessTokenLocalStorageKey);
    if (token) {
      console.log('Token expiration date: ' + this.jwtHelperService.getTokenExpirationDate(token));
      const tokenValid = !this.jwtHelperService.isTokenExpired(token);
      this.isLoggedIn.next(tokenValid);
    }
  }

  login(userData: { username: string, password: string }) {
    this.http.post('/api/api-token-auth/', userData)
      .subscribe((res: any) => {
        this.isLoggedIn.next(true);
        localStorage.setItem('access_token', res.token);
        this.router.navigate(['dashboard']);
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
    const username = this.jwtHelperService.decodeToken(token).username;
    return this.http.get('api/user/' + username + '/get');
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
}
