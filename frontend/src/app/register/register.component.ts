import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private fb: FormBuilder, private userService: UserService) {
  }

  registerForm;
  registerForm2;
  registerForm3;

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('password_check').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('password_check').setErrors({ pw_check: true });
    }
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
    });
    this.registerForm2 = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
    });
    this.registerForm3 = this.fb.group({
      password: ['', Validators.required],
      password_check: ['', Validators.required],
    }, {validator: this.passwordMatchValidator});
  }

  onSubmit() {
    this.userService.login(this.registerForm.value);
  }

}
