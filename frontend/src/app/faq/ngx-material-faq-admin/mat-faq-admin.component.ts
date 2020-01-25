/** ****************************************************************************
 * mat-faq-admin.component.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FaqItem} from '../faq.item';
import {FAQService} from '../../service/faq.service';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'mat-faq-admin',
  templateUrl: './mat-faq-admin.component.html',
  styleUrls: ['./mat-faq-admin.component.scss']
})
export class MatFaqAdminComponent implements OnInit {

  @Input()
  title = 'Admin';
  @Output()
  FAQItemAdded: EventEmitter<FaqItem> = new EventEmitter<FaqItem>();
  id: string;
  question: string;
  answer: string;
  isSuperUser: boolean;

  constructor(private faqService: FAQService, private userService: UserService) {
  }

  reset() {
    this.question = this.answer = this.id = null;
  }

  add(): void {
    if (this.id) {
      const faqItem: FaqItem = {
        id: this.id,
        question: this.question,
        answer: this.answer
      };
      this.FAQItemAdded.emit(faqItem);
    } else {
      const faqItem: FaqItem = {
        question: this.question,
        answer: this.answer
      };
      this.FAQItemAdded.emit(faqItem);
    }
    this.reset();
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe((x: any) => this.isSuperUser = x.is_superuser);
    this.faqService.emitter.subscribe((res: FaqItem) => {
      this.id = res.id;
      this.question = res.question;
      this.answer = res.answer;
    });

  }

  disableCheck() {
    return !this.answer || !this.question;
  }

}
