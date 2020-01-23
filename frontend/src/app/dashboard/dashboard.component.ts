/*
 * dashboard.component.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

<<<<<<< Updated upstream
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
=======
import {Component, Inject, OnInit} from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {HabitService} from '../service/habit.service';
import * as moment from 'moment';
import {UserService} from '../service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {ProfilePictureService} from '../service/profile-picture.service';
import {AbstractControl, FormBuilder, FormControl} from '@angular/forms';
import {User} from '../user';
import {Observable} from 'rxjs';

>>>>>>> Stashed changes

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
<<<<<<< Updated upstream
export class DashboardComponent {
  /** Based on the screen size, switch from standard to one column per row */
=======
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
  friends: any[];
  displayedColumnsFriends = ['username', 'score', 'actions'];
  users;
  public userForm: any;
>>>>>>> Stashed changes
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
<<<<<<< Updated upstream
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
=======
          {title: 'User', cols: 1, rows: 1},
          {title: 'Active Habits', cols: 1, rows: 1},
          {title: 'Friends', cols: 1, rows: 1},
          {title: 'Card 4', cols: 1, rows: 1}
>>>>>>> Stashed changes
        ];
      }

      return [
<<<<<<< Updated upstream
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );
=======
        {title: 'User', cols: 1, rows: 1},
        {title: 'Active Habits', cols: 1, rows: 2},
        {title: 'Friends', cols: 1, rows: 1},
        {title: 'Card 4', cols: 1, rows: 1}
      ];
    })
  );
  filteredOptions: Observable<any[]>;
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
              public dialog: MatDialog, private fb: FormBuilder, private habitService: HabitService) {
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
      this.friendsList = res.friends;
      this.userService.getAll().subscribe((res2: any[]) => {
          this.friends = res2.filter(x => res.friends.indexOf(x.id) !== -1);
        }
      );

    });
    this.friendsForm = new FormControl();
    if (data.users) {
      this.users = data.users;
    }
    this.filteredOptions = this.friendsForm.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  onEnterFriend(id: number) {
    const friends = Array.from(new Set(this.friendsList.concat(id)).values());
    this.userService.updateUser({
      id: this.ID,
      friends,
    }).subscribe();
    this.friendsForm.patchValue('');
    // alert('User has been added to friends list.');
  }

  removeFriend(id: number) {
    const friends = this.friendsList.filter(f => f !== id)
    this.userService.updateUser( {
      id: this.ID,
      friends,
    }).subscribe();
    // alert('User has been removed from friends list.');
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

  addFriend() {

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
>>>>>>> Stashed changes

  constructor(private breakpointObserver: BreakpointObserver) {}
}
