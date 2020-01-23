/*
 * dashboard.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {single} from './data';
import {Component, Inject, OnInit} from '@angular/core';
import {map} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {HabitService} from '../service/habit.service';
import * as moment from 'moment';
import {UserService} from '../service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {ProfilePictureService} from '../service/profile-picture.service';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {User} from '../user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  single: any[] = single;
  view: number[] = [700];

  // options
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = true;
  legendPosition = 'below';
  /** Based on the screen size, switch from standard to one column per row */

  export;
  class;
  DashboardComponent;
  implements;
  OnInit;
  ID = this.userService.getID();
  habits: any[];
  habitsEditable: boolean;
  typeOptions: any[];
  userId;
  level;
  score;
  email;
  username;
  firstname;
  lastname;
  profileColor;
  profileColorPop;
  profileImage;
  public userForm: any;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'User', cols: 1, rows: 1},
          {title: 'Active Habits', cols: 1, rows: 1},
          {title: 'Charts', cols: 2, rows: 2},
          {title: 'Card 4', cols: 1, rows: 1}
        ];
      }

      return [
        {title: 'User', cols: 1, rows: 1},
        {title: 'Active Habits', cols: 1, rows: 2},
        {title: 'Charts', cols: 2, rows: 2},
        {title: 'Card 4', cols: 1, rows: 1}
      ];
    })
  );

  private password: string;
  private password_check: string;
  private old_password: string;
  private passwordForm: any;
  private userDataForm: any;

  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
              private http: HttpClient, private userService: UserService,
              private profilePictureService: ProfilePictureService, private snackbar: MatSnackBar, private router: Router,
              public dialog: MatDialog, private fb: FormBuilder, private habitService: HabitService) {
    Object.assign(this, {single});
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


  ngOnInit() {
    const data = this.route.snapshot.data;
    if (data.habits) {
      this.habits = data.habits;
    }
    if (data.typeOptions) {
      this.typeOptions = data.typeOptions;
    }
    this.userService.getUser().subscribe((res: any) => {
      this.userId = res.id;
      this.level = res.level;
      this.score = res.score;
      this.email = res.email;
      this.username = res.username;
      this.firstname = res.first_name;
      this.lastname = res.last_name;
      this.profilePictureService.getColor(res.profile_picture).subscribe((response: any) => {
        this.profileColor = this.profilePictureService.getColorVal(response.color);
        this.profileColorPop = this.profileColor + '80';
        this.profileImage = '../../assets/Resources/profile_pictures/carrot' + response.picture + '.svg';
      });
    });
  }


  isNumber(num: number) {
    return !isNaN(num);
  }

  logActive(habit: any) {
    const is_finished = moment().startOf('day').isSameOrAfter(moment(habit.end_date).endOf('day'));
    this.userService.logActive(this.ID, is_finished, habit.late, habit.percentage, habit.failed);
    this.habitService.updateHabit({
      clicked: habit.clicked + 1,
      id: habit.id,
      last_click: moment().endOf('day'),
      is_finished,
    }).subscribe(() => {
      this.habits.filter((x) => {
        return x.id === habit.id;
      }).map((x) => {
        x.today = true;
        x.clicked++;
        x.percentage = ((x.clicked / x.duration) * 100).toFixed(0);
        x.failed = x.is_finished && x.percentage <= 50;
        return x;
      });
      this.ngOnInit();
    });
  }

  enableEdit() {
    this.habitsEditable = !this.habitsEditable;
  }

  openHabitDialog(habit: any) {
    const dialogRef = this.dialog.open(DashboardHabitEditComponent, {
      width: '500px',
      data: {
        id: habit.id,
        start_date: habit.start_date,
        end_date: habit.end_date,
        name: habit.name,
        interval: habit.interval,
        priority: habit.priority,
        type: habit.type,
        typeOptions: this.typeOptions
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.habitService.updateHabit(result).subscribe(() => {
          this.snackbar.open('Successfully Updated!', 'close', {duration: 1000});
          location.reload();
        });
      }
    });
  }

  openDialog(): void {
    const data = this.route.snapshot.data;
    this.passwordForm = this.fb.group({
      id: [this.userId],
      old_password: [''],
      password: [''],
      password_check: ['']
    }, {validator: this.passwordMatchValidator});

    const dialogRef = this.dialog.open(PasswordChangeComponentDash, {
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
            this.userService.logout();
          });
        }
      }
    });
  }

  openDialogUser(): void {
    this.userDataForm = this.fb.group({
      id: [this.userId],
      username: [''],
      first_name: [''],
      last_name: [''],
      email: ['']
    });

    const dialogRef = this.dialog.open(UserDataChangeComponent, {
      width: '250px',
      data: {username: this.username, first_name: this.firstname, last_name: this.lastname, email: this.email}
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userDataForm.patchValue(result);
        if (this.userDataForm.controls.email.hasError('email_check')) {
          this.snackbar.open('Sorry, wrong email pattern', 'close', {duration: 1000});
        } else if (result.email !== this.email) {
          this.userService.updateUser(this.userDataForm.value).subscribe(() => {
            this.snackbar.open('You need to log in again!', 'close', {duration: 1000});
            this.userService.logout();
          });
        } else {
          this.userService.updateUser(this.userDataForm.value).subscribe(() => {
            this.snackbar.open('Updated successfully!', 'close', {duration: 1000});
            location.reload();
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

export interface HabitDialogData {
  id: number;
  start_date: string;
  end_date: string;
  name: string;
  interval: number;
  priority: number;
  typeOptions: any;
  type: number;
}

@Component({
  selector: 'app-dashboard-habitedit.component',
  templateUrl: 'dashboard-habitedit.component.html',
})
export class DashboardHabitEditComponent {

  constructor(
    public dialogRef: MatDialogRef<DashboardHabitEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HabitDialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  disableCheck() {
    return false;
  }

}

export interface DialogData {
  password: string;
  password_check: string;
  old_password: string;
}

@Component({
  selector: 'app-password-change-dash.component',
  templateUrl: 'password-change-dash.component.html',
})
// tslint:disable-next-line:component-class-suffix
export class PasswordChangeComponentDash {

  constructor(
    public dialogRef: MatDialogRef<PasswordChangeComponentDash>,
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

export interface UserData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

@Component({
  selector: 'app-user-info.component',
  templateUrl: 'user-info.component.html',
})
export class UserDataChangeComponent {

  constructor(
    public dialogRef: MatDialogRef<UserDataChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  disableCheck2() {
    const emailValidator = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    return !(this.data.username && this.data.first_name && this.data.last_name && emailValidator.test(this.data.email));
  }
}


