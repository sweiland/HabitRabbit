/** ****************************************************************************
 * message-list.component.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MessageService} from '../service/message.service';
import {UserService} from '../service/user.service';

export interface MessageListItem {
  id: number;
  message: string;
  title: string;
  type: number;
}

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<MessageListItem>;
  dataSource: any;
  isSuperUser: boolean;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['type', 'message', 'id'];

  constructor(private messageService: MessageService, private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUser().subscribe((x: any) => this.isSuperUser = x.is_superuser);
    this.messageService.getAll().subscribe((res: any) => {
      this.paginator.length = res.length;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.ngOnInit();
    });
  }
}

