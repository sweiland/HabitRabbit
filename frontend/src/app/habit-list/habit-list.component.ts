import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {HabitService} from '../service/habit.service';

export interface HabitListItem {
  id: number;
  start_date: Date;
  end_date: Date;
  name: string;
  interval: number;
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

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  constructor(private habitService: HabitService) {
  }

  ngOnInit() {
    this.habitService.getAll().subscribe((res) => {
      this.dataSource = res;
      console.log(this.dataSource);
    });
  }
}
