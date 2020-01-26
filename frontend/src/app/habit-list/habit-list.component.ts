/** ****************************************************************************
 * habit-list.component.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {HabitService} from '../service/habit.service';
import {UserService} from '../service/user.service';

export interface HabitListItem {
  id: number;
  start_date: Date;
  end_date: Date;
  name: string;
  priority: number;
}

@Component({
  selector: 'app-habit-list',
  templateUrl: './habit-list.component.html',
  styleUrls: ['./habit-list.component.scss']
})
export class HabitListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<HabitListItem>;
  dataSource: any;
  isSuperUser: boolean;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['member_id', 'name', 'start_date', 'end_date', 'priority', 'id'];

  constructor(private habitService: HabitService, private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUser().subscribe((x: any) => this.isSuperUser = x.is_superuser);
    this.habitService.getAll().subscribe((res: any) => {

      this.paginator.length = res.length;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteHabit(id: number) {
    this.habitService.deleteHabit(id).subscribe(() => {
      this.ngOnInit();
    });
  }
}

