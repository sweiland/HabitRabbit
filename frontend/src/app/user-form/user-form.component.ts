/** ****************************************************************************
 * user-form.component.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../service/user.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  public userForm: FormGroup;
  pressedPassword: boolean;
  isSuperUser: boolean;
  private password: string;
  private password_check: string;
  private old_password: string;
  private passwordForm: any;
  private scoreList: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private userService: UserService, private router: Router,
              private snackbar: MatSnackBar, public dialog: MatDialog) {
  }


  ngOnInit(): void {
    this.userService.getUser().subscribe((x: any) => this.isSuperUser = x.is_superuser);
    const data = this.route.snapshot.data;
    const patterns = ['^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', '^((?!@).)*'];
    this.userForm = this.fb.group({
      id: [null],
      username: ['', [Validators.required, Validators.pattern(patterns[1])], [this.uniqueUsernameValidator()]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.email, Validators.pattern(patterns[0])], [this.uniqueEmailValidator()]],
      level: [1, Validators.required],
      score: ['0', Validators.required],
      is_superuser: [false, Validators.required],
      is_staff: [false, Validators.required],
      password: [null, Validators.required],
      password_check: [null, Validators.required]
    }, {validator: this.passwordMatchValidator});
    this.passwordForm = this.fb.group({
      id: [null],
      old_password: ['', Validators.minLength(8)],
      password: ['', Validators.minLength(8)],
      password_check: ['', Validators.minLength(8)]
    }, {validator: this.passwordMatchValidator});
    if (data.user) {
      this.scoreList = data.user.score.split(',').reverse()[0];
      this.userForm.patchValue(data.user);
      this.userForm.patchValue({score: this.scoreList});
      this.passwordForm.patchValue(data.user);
      this.passwordForm.patchValue({password: ''});
      this.userForm.patchValue({password: ''});
      this.userForm.controls.password.disable();
      this.userForm.controls.password_check.disable();
    }
  }

  uniqueUsernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this.userService.getUnique().pipe(map((users: any[]) => {
        const username = control.value;
        const userExists = users.find(u => {
            return username === u.username && u.id !== this.userForm.controls.id.value;
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
            return email === u.email && u.id !== this.userForm.controls.id.value;
          }
        );
        return userExists ? {emailExists: true} : null;
      }));
    };
  }

  onSubmit() {
    const user = this.userForm.value;
    user.groups = user.is_superuser ? [1] : [2];
    if (user.id) {
      user.score = this.scoreList.concat(',', user.score);
      this.userService.updateUser(user).subscribe(() => {
        this.snackbar.open('Successfully Updated!', 'close', {duration: 1000});
        this.router.navigate(['/user-form/' + user.id]);
      });
    } else {
      this.userForm.patchValue({is_staff: this.userForm.value.is_superuser});
      this.userService.register(user).subscribe(() => {
        this.router.navigate(['/user-list']);
      });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PasswordChangeComponent, {
      width: '250px',
      data: {password: this.password, password_check: this.password_check, old_password: this.old_password}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.passwordForm.patchValue(result);
        if (this.passwordForm.controls.password_check.hasError('pw_check')) {
          this.snackbar.open('Sorry, passwords did not match!', 'close', {duration: 1000});
        } else {
          this.userService.updatePassword(this.passwordForm.value).subscribe(() => {
            this.snackbar.open('Successfully Updated!', 'close', {duration: 1000});
            this.router.navigate(['/login']);
          });
        }
      }
    });
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
}

export interface DialogData {
  password: string;
  password_check: string;
  old_password: string;
}

@Component({
  selector: 'app-password-change.component',
  templateUrl: 'password-change.component.html',
})
export class PasswordChangeComponent {

  constructor(
    public dialogRef: MatDialogRef<PasswordChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  disableCheck() {
    return (!this.data.password || !this.data.old_password || !this.data.password_check || this.data.password.length < 8 ||
      this.data.password_check.length < 8 || this.data.old_password.length < 8);
  }
}
