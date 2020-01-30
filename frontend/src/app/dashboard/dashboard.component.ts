/** ****************************************************************************
 * dashboard.component.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/


import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import {single} from './data';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {HabitService} from '../service/habit.service';
import * as moment from 'moment';
import {UserService} from '../service/user.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {ProfilePictureService} from '../service/profile-picture.service';
import {AbstractControl, FormBuilder, FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MessageService} from '../service/message.service';
import {TypeService} from '../service/type.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {HabitUserResolver} from '../resolver/habit-user.resolver';
import * as d3 from 'd3';
import {ActivatedRoute, Data} from '@angular/router';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MessageListItem} from '../message-list/message-list.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  habitChart: any[] = single;

  curveStepAfter: any = d3.curveBasis;

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
  chartScore;
  email;
  username = '';
  firstname;
  lastname;
  profileColor;
  profileColorPop;
  profileImage;
  friends: any[];
  displayedColumnsFriends = ['username', 'score', 'actions'];
  users: any[] = [];
  dailyMessage;
  currentLink;
  filteredOptions: Observable<any[]>;
  typeChart: any[] = [];
  pointChart: any[] = [];
  password: string;
  password_check: string;
  old_password: string;
  passwordForm: any;
  userDataForm: any;
  friendsForm: FormControl;
  friendsList: number[];
  empty: boolean;
  filteredHabits: any[];
  habitList: Array<string> = new Array<string>();
  formatedHabitList;
  breakpoint;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<MessageListItem>;
  dataSource: MatTableDataSource<any>;

  colorScheme = {
    domain: [
      '#ffea00', '#b388ff', '#ff1744', '#ff9100',
      '#00e676', '#00e5ff', '#d4e157', '#2979ff',
      '#f9d95f', '#613db1', '#e15241', '#dcdcdc'
    ]
  };
  pointScheme = {
    domain: ['#ff9100']
  };


  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'User', cols: 1, rows: 2},
          {title: 'Friends', cols: 1, rows: 1},
          {title: 'Daily Message', cols: 1, rows: 1},
          {title: 'Active Habits', cols: 1, rows: 1},
          {title: 'Charts', cols: 1, rows: 2},
        ];
      }

      return [
        {title: 'User', cols: 1, rows: 2},
        {title: 'Friends', cols: 1, rows: 1},
        {title: 'Daily Message', cols: 1, rows: 1},
        {title: 'Active Habits', cols: 1, rows: 2},
        {title: 'Charts', cols: 1, rows: 2},
      ];
    })
  );
  private isErroneos: boolean;

  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
              private http: HttpClient, private userService: UserService,
              private profilePictureService: ProfilePictureService, private snackbar: MatSnackBar,
              public dialog: MatDialog, private fb: FormBuilder, private habitService: HabitService,
              private messageService: MessageService, private typeService: TypeService, private habitUserResolver: HabitUserResolver) {
    Object.assign(this, {single});
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }


  ngOnInit(): void {
    this.breakpoint = 2;
    const data: Data = this.route.snapshot.data;
    if (data.typeOptions) {
      this.typeOptions = data.typeOptions;
    }
    this.friendsList = data.user.friends;
    this.userService.getAll().subscribe((res2: any[]) => {
      this.friends = res2.filter(x => data.user.friends.indexOf(x.id) !== -1);
      this.friends.forEach(f => f.score = f.score.split(',').reverse()[0]);
      this.friendsList = this.friends.map(f => f.id);
      this.friendsTable();
    });
    this.friendsForm = new FormControl();
    if (data.users) {
      this.users = data.users;
      this.filteredOptions = this.friendsForm.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    }
    if (data.habits) {
      this.habits = data.habits;
      this.filteredHabits = this.habits.filter(e => {
        return e.member === this.ID ? e : null;
      });
      this.empty = this.filteredHabits.length === 0;
      this.filteredHabits.sort((a, b) => {
        return moment(a.start_date).diff(moment(b.start_date));
      });
      this.populateInfo(this.filteredHabits);
    }
    if (data.user) {
      this.userId = data.user.id;
      this.level = data.user.level;
      this.chartScore = data.user.score;
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
      for (const habit of this.filteredHabits) {
        this.habitList.push('Habit Name: ' + habit.name + '\t' + 'Finished: ' + habit.is_finished);
      }
      this.formatedHabitList = this.habitList.join(',');
    }
    this.updateMessage();
    this.updateCharts();
  }

  friendsTable() {
    this.paginator.length = this.friends.length;
    this.dataSource = new MatTableDataSource(this.friends);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  updateMessage() {
    if (this.filteredHabits.length !== 0) {
      const types = this.filteredHabits.map((h) => {
        return h.type_id;
      });
      const type = types[Math.floor(Math.random() * types.length)];
      return this.typeService.getType(type).subscribe((t: any) => {
        return this.messageService.getAll().subscribe((m: any) => {
          this.dailyMessage = m.filter((i: any) => {
            return i.type === type;
          })[0].message;
          return this.currentLink = t.helpful_link;
        });
      });
      this.breakpoint = (innerWidth <= 1050) ? 1 : 2;
    }
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.users = this.users.filter(f => f.id !== this.ID);
    return this.users.filter((u) => {
      return u.username.toString().toLowerCase().includes(filterValue) || u.email.toString().toLowerCase().includes(filterValue);
    });
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 1050) ? 1 : 2;
  }

  populateInfo(habit: any[]): any[] {
    return habit.map((x) => {
      const start = moment(x.start_date).startOf('day');
      const end = moment(x.end_date).startOf('day');
      const today = moment().startOf('day');
      const duration = end.diff(start, 'day');
      const percentage = (x.clicked / duration * 100);
      x.late = moment().endOf('day').isAfter(moment(x.last_click).add(x.interval + 1, 'day'));
      x.clicked = x.late ? x.clicked - 1 : x.clicked;
      x.percentage = percentage < 0 || percentage > 100 || isNaN(percentage) ? '0' : percentage.toFixed(0);
      x.duration = duration < 0 ? duration * -1 : duration;
      if (moment().startOf('day').isSameOrAfter(end.startOf('day'))) {
        x.is_finished = true;
        x.today = true;
        x.failed = x.is_finished && x.percentage <= 50;
        x.left = 0;
        return x;
      } else {
        x.today = today.isSameOrAfter(start) ? moment(x.last_click).add(x.interval - 1, 'day').startOf('day')
          .isSameOrAfter(today) : true;
        const left = end.diff(today, 'day');
        x.left = left < 0 ? left * -1 : left;
        return x;
      }
    });
  }

  goHelpfulLink() {
    if (this.currentLink !== null) {
      window.open(this.currentLink, '_blank');
    } else {
      this.snackbar.open('There is no link available!', 'close', {duration: 1000});
    }
  }

  generatePdf() {
    const documentDefinition = {
      content: [
        {
          image: 'data:image/png;base64,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',
          width: 600,
          alignment: 'center',
        },
        {
          text: 'Your HabitRabbit Stats Summary',
          bold: true,
          fontSize: 25,
          alignment: 'center',
          margin: [0, 20, 0, 20]
        },
        {
          columns: [
            [{
              text: this.username,
              style: 'name',
              bold: true,
              fontSize: 18,
              color: this.profileColor,
              margin: [0, 10, 0, 10]
            },
              {
                text: 'First Name: ' + this.firstname,
                fontSize: 15,
                margin: [0, 10, 0, 0]
              },
              {
                text: 'Last Name: ' + this.lastname,
                fontSize: 15,
                margin: [0, 10, 0, 0]
              },
              {
                text: 'Email: ' + this.email,
                fontSize: 15,
                margin: [0, 10, 0, 0]
              },
              {
                text: 'Level: ' + this.level,
                fontSize: 15,
                margin: [0, 10, 0, 0]
              },
              {
                text: 'Score: ' + this.score,
                fontSize: 15,
                margin: [0, 10, 0, 0],
              },
              {
                text: 'Created Habits: ',
                fontSize: 18,
                bold: true,
                margin: [0, 10, 0, 10],
              },
              {
                columns: [
                  this.habitList
                ],
              },
            ],
            [
              // Document definition for Profile pic
            ]
          ]
        }
      ]
    };
    pdfMake.createPdf(documentDefinition).download();
  }

  onEnterFriend(user: any) {
    const friendsplus = this.friends.filter(f => f.id !== user.id).concat(user).filter(f => f.id !== this.ID);
    const friends = this.friendsList.concat(user.id).filter(f => f !== this.ID);
    this.userService.updateUser({
      id: this.ID,
      friends,
    }).subscribe();
    this.friendsForm.patchValue('');
    this.friendsList = friends;
    this.friends = friendsplus;
    this.friends.forEach(f => f.score = f.score.split(',').reverse()[0]);
    this.friends.reverse();
    document.getElementById('mat-input-0').blur();
    this.friendsTable();
  }

  removeFriend(id: number) {
    this.users = this.users.concat(this.friends.filter(f => f === id));
    this.friends = this.friends.filter((f) => {
      return f.id !== id;
    });
    this.friendsTable();
    const friends = this.friendsList.filter(f => f !== id);
    this.userService.updateUser({
      id: this.ID,
      friends,
    }).subscribe();
    this.friendsList = friends;
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

  getsPoints(streak: number): number {
    if (streak < 14) {
      return 2;
    }
    if (streak < 30) {
      return 4;
    }
    if (streak < 90) {
      return 8;
    }
    return 10;
  }

  getLevel(score: number): number {
    const withoutModulo = score - (score % 20);
    return withoutModulo / 20 !== 0 ? withoutModulo / 20 : 1;
  }

  logActive(habit: any): void {
    const is_finished = moment().startOf('day').isSameOrAfter(moment(habit.end_date).startOf('day'));
    this.userService.getUser().subscribe((res: any) => {
      const streak = habit.late ? 0 : res.streak + 1;
      const add: number = this.getsPoints(streak);
      const scoreList = res.score.split(',');
      const currentScore: number = +scoreList.reverse()[0];
      const scoreN: number = habit.failed ? currentScore - 50 : habit.percentage > 50 && is_finished ?
        currentScore + add + 50 : currentScore + add;
      const score = res.score.split(',') + ',' + scoreN;
      const level = habit.failed ? res.level - 1 : this.getLevel(scoreN);
      return this.http.patch('/api/user/' + this.ID + '/update', {
        streak,
        score,
        level
      }).subscribe((res2: any) => {
        this.chartScore = res2.score;
        this.score = res2.score.split(',').reverse()[0];
        this.level = res2.level;
        this.updateCharts();
        this.updateMessage();
      });
    });
    this.habitService.updateHabit({
      clicked: habit.clicked + 1,
      id: habit.id,
      last_click: moment().endOf('day'),
      is_finished,
    }).subscribe((res: any) => {
      this.filteredHabits.filter((x) => {
        return x.id === res.id;
      }).map((x) => {
        x.today = true;
        x.clicked++;
        x.percentage = ((x.clicked / x.duration) * 100).toFixed(0);
        x.failed = x.is_finished && x.percentage <= 50;
        return x;
      });
      this.updateCharts();
      this.updateMessage();
    });
  }

  enableEdit() {
    this.habitsEditable = !this.habitsEditable;
  }

  deleteHabit(id: number) {
    this.habitService.deleteHabit(id).subscribe();
    this.filteredHabits = this.filteredHabits.filter((x) => {
      return x.id !== id;
    });
    this.empty = this.filteredHabits.length === 0;
    this.updateCharts();
    this.updateMessage();
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
        priority: habit.priority === 3 ? 1 : habit.priority === 2 ? 2 : 3,
        type: this.typeOptions.filter(t => t.id === habit.type)[0],
        typeOptions: this.typeOptions
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.priority = result.priority === 3 ? 1 : result.priority === 2 ? 2 : 3;
        result.type = result.type.id;
        this.habitService.updateHabit(result).subscribe();
        this.snackbar.open('Successfully Updated!', 'close', {duration: 1000});
        this.filteredHabits = this.filteredHabits.filter((h) => {
          return h.id !== result.id;
        }).concat(result).sort((a, b) => {
          return moment(a.start_date).diff(moment(b.start_date));
        });
        this.populateInfo(this.filteredHabits);
        this.updateCharts();
        this.updateMessage();
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
      data: {id: this.userId, username: this.username, first_name: this.firstname, last_name: this.lastname, email: this.email}
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isErroneos = false;
        this.userService.getUnique().subscribe((r: any[]) => {
          r.forEach((u) => {
            if (u.id !== result.id && (u.username === result.username || u.email === result.email)) {
              this.isErroneos = true;
              this.snackbar.open('Username or Email has already been taken!', 'close', {duration: 1000});
            }
          });
          this.userDataForm.patchValue(result);
          if (this.userDataForm.controls.email.hasError('email_check')) {
            this.snackbar.open('Sorry, wrong email pattern', 'close', {duration: 1000});
          } else if (result.email !== this.email && !this.isErroneos) {
            this.userService.updateUser(this.userDataForm.value).subscribe(() => {
              this.snackbar.open('You need to log in again!', 'close', {duration: 1000});
              this.userService.logout();
            });
          } else if (!this.isErroneos) {
            this.userService.updateUser(this.userDataForm.value).subscribe((res: any) => {
              this.email = res.email;
              this.username = res.username;
              this.firstname = res.first_name;
              this.lastname = res.last_name;
              this.snackbar.open('Updated successfully!', 'close', {duration: 1000});
            });
          }
        });
      }
    });
  }

  updateCharts(): void {
    this.habitChart = [];
    this.typeChart = [];
    this.pointChart = [];
    this.habitChart = [
      {name: 'Active', value: this.filteredHabits.filter(h => !h.is_finished).length},
      {name: 'Finished', value: this.filteredHabits.filter(h => h.is_finished && !h.failed).length},
      {name: 'Failed', value: this.filteredHabits.filter(h => h.failed).length},
      {name: 'Late', value: this.filteredHabits.filter(h => h.late).length},
    ];
    const assignedTypes = new Map();
    this.filteredHabits.forEach((t) => {
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
    this.chartScore.split(',').forEach((s, i) => {
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

  getPrioSym(habit: any): string {
    const color: string = habit.late ? '❗️' : '❕';
    return color + (habit.priority === 3 ? '3️' : habit.priority === 2 ? '2️' : '1️');
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(DashboardHabitEditComponent, {
      width: '500px',
      data: {
        start_date: moment(),
        end_date: null,
        name: '',
        priority: 1,
        type: 0,
        typeOptions: this.typeOptions,
        member: this.ID
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.priority = result.priority === 3 ? 1 : result.priority === 2 ? 2 : 3;
        result.type = result.type.id;
        this.habitService.saveHabit(result).subscribe((res: any) => {
          this.snackbar.open('Successfully Created!', 'close', {duration: 1000});
          this.filteredHabits = this.filteredHabits.filter((h) => {
            return h.id !== res.id;
          }).concat(this.populateInfo([res])).sort((a, b) => {
            return moment(a.start_date).diff(moment(b.start_date));
          });
          this.empty = this.filteredHabits.length === 0;
          this.updateCharts();
          this.updateMessage();
        });
      }
    });
  }
}


export interface HabitDialogData {
  id: number;
  start_date: any;
  end_date: any;
  name: string;
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
    const startDate = moment(this.data.start_date).startOf('day');
    const endDate = moment(this.data.end_date).startOf('day');
    return (startDate.diff(endDate, 'day') === 0 || !this.data.name || !this.data.end_date || !this.data.start_date);
  }

  moment() {
    return moment();
  }

  getMax() {
    return moment(this.data.start_date).add(1, 'year');
  }

  getEnd(event: any) {
    const end_date = moment(this.data.start_date);
    const unit = event.duration === 52 || event.duration === 39 || event.duration === 26 || event.duration === 13 ? 'year' :
      event.duration >= 4 ? 'month' : 'week';
    const duration = unit === 'year' ? (event.duration / 52) : unit === 'month' ? (event.duration / 4) : event.duration;
    end_date.add(duration, unit).endOf('day');
    this.data.end_date = end_date;
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
  id: number;
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


