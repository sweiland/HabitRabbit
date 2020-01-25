/** ****************************************************************************
 * type-list.component.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {TypeService} from '../service/type.service';
import {FAQService} from '../service/faq.service';
import {UserService} from '../service/user.service';

export interface TypeListItem {
  id: number;
  name: string;
  duration: number;
  helpful_link: string;
}

@Component({
  selector: 'app-type-list',
  templateUrl: './type-list.component.html',
  styleUrls: ['./type-list.component.scss']
})
export class TypeListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<TypeListItem>;
  dataSource: any;
  isSuperUser: boolean;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'duration', 'helpful_link', 'id'];

  constructor(private typeService: TypeService, private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUser().subscribe((x: any) => this.isSuperUser = x.is_superuser);
    this.typeService.getAll().subscribe((response: unknown[]) => {
      this.paginator.length = response.length;
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    });

  }

  deleteType(id: any) {
    this.typeService.deleteType(id).subscribe(() => {
      this.ngOnInit();
    });

  }
}
