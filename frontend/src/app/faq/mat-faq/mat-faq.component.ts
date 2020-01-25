/** ****************************************************************************
 * mat-faq.component.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Component, Input, OnInit} from '@angular/core';
import {FAQService} from '../../service/faq.service';
import {FaqComponent} from '../faq.component';
import {FaqItem} from '../faq.item';
import {UserService} from '../../service/user.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-faq',
  templateUrl: './mat-faq.component.html',
  styleUrls: ['./mat-faq.component.scss']
})
export class MatFaqComponent implements OnInit {
  @Input()
  title = 'FAQ';
  @Input()
  multi = false;
  @Input()
  displayMode = 'default'; // or flat
  @Input()
  faqList: FaqItem[] = [];
  isSuperuser;

  constructor(private faqService: FAQService, private faqComponent: FaqComponent, private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe((res: any) => {
      this.isSuperuser = res.is_superuser;
    });
  }

  deleteFaq(id: string) {
    this.faqService.deleteFaq(id).subscribe(() => {
      this.faqComponent.ngOnInit();
    });
  }

  edit(faqItem: FaqItem) {
    this.faqService.emitFaq(faqItem);
  }
}
