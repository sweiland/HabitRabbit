/*
 * dashboard.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

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
import {MessageService} from '../service/message.service';
import {TypeService} from '../service/type.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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
  dailyMessage;
  currentLink;
  public userForm: any;
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'User', cols: 1, rows: 1},
          {title: 'Active Habits', cols: 1, rows: 1},
          {title: 'Daily Message', cols: 1, rows: 1},
          {title: 'Card 4', cols: 1, rows: 1}
        ];
      }

      return [
        {title: 'User', cols: 1, rows: 1},
        {title: 'Active Habits', cols: 1, rows: 2},
        {title: 'Daily Message', cols: 1, rows: 1},
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
              public dialog: MatDialog, private fb: FormBuilder, private habitService: HabitService,
              private messageService: MessageService, private typeService: TypeService) {
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
      if (res.profile_picture === null) {
        this.profileColor = '#ffffff';
        this.profileImage = false;
      } else {
        this.profilePictureService.getColor(res.profile_picture).subscribe((response: any) => {
          if (response.color === null) {
            console.log(this.profileColor);
            this.profileColor = '#ffffff';
          } else {
            this.profileColor = this.profilePictureService.getColorVal(response.color);
            this.profileColorPop = this.profileColor + '80';
          }
          if (response.picture == null) {
            this.profileImage = false;
          } else {
            this.profileImage = '../../assets/Resources/profile_pictures/carrot' + response.picture + '.svg';
          }
        });
      }
    });
    this.messageService.getAll().subscribe((mes: any[]): Promise<any[]> => {
      const types = this.habits.map((h) => {
        return h.type_id;
      });
      const tempNum = types[Math.floor(Math.random() * types.length)];
      this.typeService.getMessage(tempNum).subscribe((resp: any) => {
        if (resp.helpful_link === null) {
          this.currentLink = 'There is no link available';
        } else {
          this.currentLink = resp.helpful_link;
        }
      });
      const filtered = mes.filter((f) => {
        return types.indexOf(f.type) !== -1;
      });
      const res = filtered.map((i) => {
        return JSON.parse(i.message);
      });
      const randomMessage = res[Math.floor(Math.random() * res.length)];
      return this.dailyMessage = randomMessage;
    });
  }


  isNumber(num: number) {
    return !isNaN(num);
  }

  logActive(id: string) {
    this.userService.logActive(this.ID);
    this.habitService.updateHabit({
      id,
      last_click: moment().endOf('day')
    }).subscribe(() => {
      this.habits.filter((x) => {
        return x.id === id;
      }).map((x) => {
        x.today = true;
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
            this.router.navigate(['/login']);
          });
        }
      }
    });
  }

  openDialogUser(): void {
    const data = this.route.snapshot.data;
    this.userDataForm = this.fb.group({
      id: [this.userId],
      username: [''],
      first_name: [''],
      last_name: [''],
      email: ['']
    });
    if (data.user) {
      this.userForm.patchValue(data.user);
      this.userForm.controls.password.disable();
      this.userForm.controls.password_check.disable();
    }

    const dialogRef = this.dialog.open(UserDataChangeComponent, {
      width: '250px',
      data: {username: this.username, first_name: this.firstname, last_name: this.lastname, email: this.email}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userDataForm.patchValue(result);
        if (this.userDataForm.controls.email.hasError('email_check')) {
          this.snackbar.open('Sorry, wrong email pattern', 'close', {duration: 1000});
        } else {
          this.userService.updateUser(this.userDataForm.value).subscribe(() => {
            this.snackbar.open('You need to log in again!', 'close', {duration: 1000});
            this.userService.logout();
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
// tslint:disable-next-line:component-class-suffix
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
    const valid = !(this.data.username && this.data.first_name && this.data.last_name && emailValidator.test(this.data.email));
    return valid;
  }
}


