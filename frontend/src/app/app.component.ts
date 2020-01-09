import {Component, OnInit} from '@angular/core';
import {UserService} from './service/user.service';
import {User} from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  isLoggedIn = false;
  user;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.isLoggedIn.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.userService.getUser().subscribe((res) => {
      this.user = res;
    });
  }
}
