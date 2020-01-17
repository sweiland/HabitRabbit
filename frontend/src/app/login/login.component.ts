/*
 * login.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';
import {User} from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  usernumber;

  constructor(private fb: FormBuilder, private userService: UserService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.userService.getNumberOfUsers().subscribe((res: User) => {
        this.usernumber = res.number;
      }
    );

  }

  onSubmit() {
    if (this.loginForm.controls.email.hasError('email')) {
      this.userService.getEmail(this.loginForm.value.email).subscribe((res: User) => {
        this.loginForm.patchValue({email: res.email});
        this.userService.login(this.loginForm.value);
      }, () => alert('no such user found'));
    } else {
      this.userService.login(this.loginForm.value);
    }
  }
}
