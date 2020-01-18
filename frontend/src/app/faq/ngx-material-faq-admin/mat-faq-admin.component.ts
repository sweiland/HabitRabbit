import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FaqItem} from '../faq.item';
import {FAQService} from '../../service/faq.service';

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

  constructor(private faqService: FAQService) {
  }

  reset() {
    this.question = this.answer = this.id = undefined;
  }

  add(): void {
    if (this.id) {
      const faqItem: FaqItem = {
        id: this.id,
        question: this.question,
        answer: this.answer
      };
      console.log(faqItem);
      this.FAQItemAdded.emit(faqItem);
    } else {
      const faqItem: FaqItem = {
        question: this.question,
        answer: this.answer
      };
      console.log(faqItem);
      this.FAQItemAdded.emit(faqItem);
    }
    this.reset();
  }

  ngOnInit(): void {
    this.faqService.emitter.subscribe((res: FaqItem) => {
      this.id = res.id;
      this.question = res.question;
      this.answer = res.answer;
    });

  }

}
