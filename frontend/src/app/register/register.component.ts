/**********************************************************************************************************************
 * register.component.ts Copyright © 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).*
 *                                                                                                                    *
 **********************************************************************************************************************/

import {Component, OnInit} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, ValidationErrors, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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
    const patterns = ['^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', '^((?!@).)*'];
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(patterns[0])], [this.uniqueEmailValidator()]],
      username: ['', [Validators.required, Validators.pattern(patterns[1])], [this.uniqueUsernameValidator()]],
    });
    this.registerForm2 = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
    });
    this.registerForm3 = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_check: ['', Validators.required, Validators.minLength(8)],
    }, {validator: this.passwordMatchValidator});
    this.registerFormFinal = this.fb.group({
      email: [''],
      username: [''],
      first_name: [''],
      last_name: [''],
      password: [''],
      is_staff: [false],
      is_superuser: [false],
      level: [1],
      score: ['0']
    });
  }

  uniqueUsernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.userService.getUnique().pipe(map((users: any[]) => {
        const username = control.value;
        const userExists = users.find(u => {
            return username === u.username;
          }
        );
        return userExists ? {usernameExists: true} : null;
      }));
    };
  }

  uniqueEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.userService.getUnique().pipe(map((users: any[]) => {
        const email = control.value;
        const userExists = users.find(u => {
            return email === u.email;
          }
        );
        return userExists ? {emailExists: true} : null;
      }));
    };
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
