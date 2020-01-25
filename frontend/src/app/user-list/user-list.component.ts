/** ****************************************************************************
 * user-list.component.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {UserService} from '../service/user.service';

interface UserListItem {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  level: number;
  score: number;
  date_joined: any;
  is_superuser: boolean;

}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<UserListItem>;
  dataSource: any;
  isSuperUser: boolean;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['username', 'first_name', 'last_name', 'email', 'level', 'score', 'date_joined', 'is_superuser', 'id'];
  userId: any;
  private filteredFriends: any;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUser().subscribe((x: any) => this.isSuperUser = x.is_superuser);
    this.userService.getUser().subscribe((response: any) => {
      this.userId = response.id;
    });
    this.userService.getAll().subscribe((response: any[]) => {
      this.paginator.length = response.length;
      response.forEach((s) => {
        s.score = s.score.split(',').reverse()[0];
      });
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  deleteUser(id: string) {
    this.userService.getAUser(id).subscribe((response) => {
      const user = response;
      // @ts-ignore
      user.is_active = !user.is_active;
      this.userService.updateUser(user).subscribe(() => {
        this.ngOnInit();
      });
    });


  }

  filterFriends(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }
}



