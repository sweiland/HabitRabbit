/*
 * register.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm;
  registerForm2;
  registerForm3;
  registerFormFinal;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('password_check').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('password_check').setErrors({pw_check: true});
    }
  }

  ngOnInit() {
    const pattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(pattern)]],
      username: ['', Validators.required],
    });
    this.registerForm2 = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
    });
    this.registerForm3 = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_check: ['', Validators.required],
    }, {validator: this.passwordMatchValidator});
    this.registerFormFinal = this.fb.group({
      email: [''],
      username: [''],
      first_name: [''],
      last_name: [''],
      password: [''],
    });
  }

  onSubmit() {
    this.registerFormFinal.patchValue({
      email: this.registerForm.value.email,
      username: this.registerForm.value.username,
      first_name: this.registerForm2.value.first_name,
      last_name: this.registerForm2.value.last_name,
      password: this.registerForm3.value.password,
    });
    this.userService.register(this.registerFormFinal.value).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

}
