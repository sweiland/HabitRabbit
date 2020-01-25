/*
 * dashboard.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */


import {Component, Inject, OnInit} from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import {single} from './data';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {HabitService} from '../service/habit.service';
import * as moment from 'moment';
import {UserService} from '../service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {ProfilePictureService} from '../service/profile-picture.service';
import {AbstractControl, FormBuilder, FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MessageService} from '../service/message.service';
import {TypeService} from '../service/type.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  habitChart: any[] = single;

  // options
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = true;
  legendPosition = 'right';
  /** Based on the screen size, switch from standard to one column per row */
  ID = this.userService.getID();
  habits: any[];
  habitsEditable: boolean;
  typeOptions: any[];
  userId;
  level;
  score;
  email;
  username = '';
  firstname;
  lastname;
  profileColor;
  profileColorPop;
  profileImage;
  friends: any[];
  displayedColumnsFriends = ['username', 'score', 'actions'];
  users;
  public userForm: any;
  dailyMessage;
  currentLink;

  colorScheme = {
    domain: ['#ffea00', '#b388ff', '#ff1744', '#ff9100', '#00e676', '#00e5ff', '#d4e157', '#2979ff', '#f9d95f', '#613db1', '#e15241', '#dcdcdc']
  };
  pointScheme = {
    domain: ['#ff9100']
  };


  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'User', cols: 1, rows: 1},
          {title: 'Active Habits', cols: 1, rows: 1},
          {title: 'Charts', cols: 1, rows: 2},
          {title: 'Friends', cols: 1, rows: 2},
          {title: 'Daily Message', cols: 1, rows: 1}
        ];
      }

      return [
        {title: 'User', cols: 1, rows: 1},
        {title: 'Active Habits', cols: 1, rows: 2},
        {title: 'Friends', cols: 1, rows: 1},
        {title: 'Charts', cols: 1, rows: 2},
        {title: 'Daily Message', cols: 1, rows: 1}
      ];
    })
  );
  filteredOptions: Observable<any[]>;
  typeChart: any[] = [];
  pointChart: any[] = [];
  private password: string;
  private password_check: string;
  private old_password: string;
  private passwordForm: any;
  private userDataForm: any;
  private friendsForm: FormControl;
  private friendsList: number[];

  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
              private http: HttpClient, private userService: UserService,
              private profilePictureService: ProfilePictureService, private snackbar: MatSnackBar, private router: Router,
              public dialog: MatDialog, private fb: FormBuilder, private habitService: HabitService,
              private messageService: MessageService, private typeService: TypeService) {
    Object.assign(this, {single});
  }


  ngOnInit() {
    const data = this.route.snapshot.data;
    if (data.habits) {
      this.habits = data.habits;
    }
    if (data.typeOptions) {
      this.typeOptions = data.typeOptions;
    }
    this.friendsList = data.user.friends;
    this.userService.getAll().subscribe((res2: any[]) => {
      this.friends = res2.filter(x => data.user.friends.indexOf(x.id) !== -1);
    });

    this.friendsForm = new FormControl();
    if (data.users) {
      this.users = data.users.filter(f => f.id !== this.ID);
    }
    this.filteredOptions = this.friendsForm.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    if (data.user) {
      this.userId = data.user.id;
      this.level = data.user.level;
      this.score = data.user.score.split(',').reverse()[0];
      this.email = data.user.email;
      this.username = data.user.username;
      this.firstname = data.user.first_name;
      this.lastname = data.user.last_name;
      if (data.user.profile_picture === null) {
        this.profileColor = '#613DB1';
        this.profileImage = false;
      } else {
        this.profilePictureService.getColor(data.user.profile_picture).subscribe((response: any) => {
          if (response.color === null) {
            this.profileColor = '#613DB1';
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
      this.habitChart = [
        {name: 'Active', value: this.habits.filter(h => !h.is_finished).length},
        {name: 'Finished', value: this.habits.filter(h => h.is_finished && !h.failed).length},
        {name: 'Failed', value: this.habits.filter(h => h.failed).length},
        {name: 'Late', value: this.habits.filter(h => h.late).length},
      ];
      const assignedTypes = new Map();
      this.habits.forEach((t) => {
        if (assignedTypes.has(t.type)) {
          let old = assignedTypes.get(t.type) + 1;
          assignedTypes.set(t.type, old++);
        } else {
          assignedTypes.set(t.type, 1);
        }
      });
      assignedTypes.forEach((value, key) => {
        const name = this.typeOptions.filter(o => o.id === key)[0].name;
        this.typeChart.push({name, value});
      });
      const series = [];
      data.user.score.split(',').forEach((s, i) => {
        series.push({
          name: i,
          value: s
        });
      });
      this.pointChart.push({
        name: this.username,
        series
      });
    }
  }

  onEnterFriend(user: any) {
    this.friends = (Array.from(new Set(this.friends.concat(user).values())).filter(f => f.id !== this.userId));
    const friends = (Array.from(new Set(this.friendsList.concat(user.id)).values())).filter(f => f !== this.userId);
    this.userService.updateUser({
      id: this.ID,
      friends,
    }).subscribe();
    this.friendsForm.patchValue('');
  }

  removeFriend(id: number) {
    this.users = this.users.concat(this.friends.filter(f => f === id));
    this.friends = this.friends.filter(f => f === id);
    const friends = this.friendsList.filter(f => f !== id);
    this.userService.updateUser({
      id: this.ID,
      friends,
    }).subscribe();
  }

  getCategorySymbol(type: number) {
    if (type === 1) {
      return '🎓';
    }
    if (type === 2) {
      return '🦴';
    }
    if (type === 3) {
      return '🏀';
    }
    if (type === 4) {
      return '👫';
    }
    if (type === 5) {
      return '🥙';
    }
    if (type === 6) {
      return '🛁';
    }
    if (type === 7) {
      return '🗣';
    }
    if (type === 8) {
      return '🧠';
    }
    if (type === 9) {
      return '💶';
    }
    if (type === 10) {
      return '🕜';
    }
    if (type === 11) {
      return '🔶';
    }
  }

  isNumber(num: number) {
    return !isNaN(num);
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((u) => {
      return u.username.toString().toLowerCase().includes(filterValue) || u.email.toString().toLowerCase().includes(filterValue);
    });
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


