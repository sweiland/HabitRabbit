/** ****************************************************************************
 * login.component.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  usernumber;

  constructor(private fb: FormBuilder, private userService: UserService, private snackbar: MatSnackBar) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.userService.getNumberOfUsers().subscribe((res: any) => {
        this.usernumber = res.number;
      }
    );

  }

  onSubmit() {
    if (this.loginForm.value.email.search(/@/gi) === -1) {
      this.userService.getEmail(this.loginForm.value.email).subscribe((res: any) => {
        this.loginForm.patchValue({email: res.email});
        this.userService.login(this.loginForm.value);
      }, () => this.snackbar.open('Wrong Username or Password!', 'close', {duration: 1000}));
    } else {
      this.userService.login(this.loginForm.value);
    }
  }
}

