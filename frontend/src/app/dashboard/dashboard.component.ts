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
import {ActivatedRoute, Data, Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {ProfilePictureService} from '../service/profile-picture.service';
import {AbstractControl, FormBuilder, FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MessageService} from '../service/message.service';
import {TypeService} from '../service/type.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

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

  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute,
              private http: HttpClient, private userService: UserService,
              private profilePictureService: ProfilePictureService, private snackbar: MatSnackBar, private router: Router,
              public dialog: MatDialog, private fb: FormBuilder, private habitService: HabitService,
              private messageService: MessageService, private typeService: TypeService) {
    Object.assign(this, {single});
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }


  ngOnInit(): void {
    const data: Data = this.route.snapshot.data;
    if (data.typeOptions) {
      this.typeOptions = data.typeOptions;
    }
    this.friendsList = data.user.friends;
    this.userService.getAll().subscribe((res2: any[]) => {
      this.friends = res2.filter(x => data.user.friends.indexOf(x.id) !== -1);
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
      this.populateInfo(this.filteredHabits);
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
      for (const habit of this.filteredHabits) {
        this.habitList.push('Habit Name: ' + habit.name + '\t' + 'Finished: ' + habit.is_finished);
      }
      this.formatedHabitList = this.habitList.join(',');
    }
    this.messageService.getAll().subscribe((mes: any[]): Promise<any[]> => {
      const types = this.filteredHabits.map((h) => {
        return h.type_id;
      });
      const tempNum = types[Math.floor(Math.random() * types.length)];
      if (tempNum) {
        this.typeService.getMessage(tempNum).subscribe((resp: any) => {
          if (resp.helpful_link === null) {
            this.currentLink = 'There is no link available';
          } else {
            this.currentLink = resp.helpful_link;
          }
        });
      } else {
        this.currentLink = 'There is no link available';
      }
      const filtered = mes.filter((f) => {
        return types.includes(f.type);
      });
      const res = filtered.map((i) => {
        return i.message;
      });
      const randomMessage = res[Math.floor(Math.random() * res.length)];
      return this.dailyMessage = randomMessage;
    });
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((u) => {
      return u.username.toString().toLowerCase().includes(filterValue) || u.email.toString().toLowerCase().includes(filterValue);
    });
  }

  populateInfo(habit: any[]): any[] {
    return habit.map((x) => {
      const start = moment(x.start_date).startOf('day');
      const end = moment(x.end_date).startOf('day');
      const today = moment().startOf('day');
      const duration = end.diff(start, 'day');
      const percentage = (x.clicked / duration * 100);
      x.late = moment().endOf('day').isAfter(moment(x.last_click).add(x.interval + 3, 'day'));
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
    window.location.href = this.currentLink;
  }

  generatePdf() {
    const documentDefinition = {
      content: [
        {
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACbUAAANrCAIAAAD0oHC5AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAKZWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAxLTA2VDE4OjAzOjI5KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAxLTI0VDEzOjU4OjUwKzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMS0yNFQxMzo1ODo1MCswMTowMCIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplNmY1M2E0Yy04OTc2LTRmMDItODIyZS04MGY2MGI4MzdmZGUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1ZjQxY2UzOS0zODFiLTExNDMtYTUxZS1hNmQ0NjYwNDc0YjQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozMDI1ODYwYi0yZGJlLTRjZTAtYjcxOS1kNjAzNmU4YTZkYWIiPiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9ImhhYml0IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJoYWJpdCIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IlJhYkJpdOKEoiIgcGhvdG9zaG9wOkxheWVyVGV4dD0iUmFiQml04oSiIi8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozMDI1ODYwYi0yZGJlLTRjZTAtYjcxOS1kNjAzNmU4YTZkYWIiIHN0RXZ0OndoZW49IjIwMjAtMDEtMDZUMTg6MDM6MjkrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjMWUzMTI2NS03NDA2LTRlMDQtOTJmZC1iYmMzYmNiNDE4MWIiIHN0RXZ0OndoZW49IjIwMjAtMDEtMDhUMDY6MjM6MzQrMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozNWZiMmQxOC1kZDI3LTRjYTktOGZlYi1lZjcwMjhkZTZlNTQiIHN0RXZ0OndoZW49IjIwMjAtMDEtMjRUMTM6NTg6NTArMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplNmY1M2E0Yy04OTc2LTRmMDItODIyZS04MGY2MGI4MzdmZGUiIHN0RXZ0OndoZW49IjIwMjAtMDEtMjRUMTM6NTg6NTArMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozNWZiMmQxOC1kZDI3LTRjYTktOGZlYi1lZjcwMjhkZTZlNTQiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo4MzQxN2FjYi0xNDRkLWQ2NDAtYWJkNS0wMTJkMmRkNzk4NzQiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozMDI1ODYwYi0yZGJlLTRjZTAtYjcxOS1kNjAzNmU4YTZkYWIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1l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',
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
                text: 'Last Name:' + this.lastname,
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
    const is_finished = moment().startOf('day').isSameOrAfter(moment(habit.end_date).startOf('day'));
    this.userService.logActive(this.ID, is_finished, habit.late, habit.percentage, habit.failed);
    this.habitService.updateHabit({
      clicked: habit.clicked + 1,
      id: habit.id,
      last_click: moment().endOf('day'),
      is_finished,
    }).subscribe(() => {
      this.filteredHabits.filter((x) => {
        return x.id === habit.id;
      }).map((x) => {
        x.today = true;
        x.clicked++;
        x.percentage = ((x.clicked / x.duration) * 100).toFixed(0);
        x.failed = x.is_finished && x.percentage <= 50;
        return x;
      });
    });
    this.ngOnInit();
  }

  enableEdit() {
    this.habitsEditable = !this.habitsEditable;
  }

  deleteHabit(id: number) {
    this.habitService.deleteHabit(id).subscribe((res: any) => {
      location.reload();
    });
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


