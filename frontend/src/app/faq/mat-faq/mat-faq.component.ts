import {Component, Input} from '@angular/core';
import {FAQService} from '../../service/faq.service';
import {FaqComponent} from '../faq.component';
import {FaqItem} from '../faq.item';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-faq',
  templateUrl: './mat-faq.component.html',
  styleUrls: ['./mat-faq.component.scss']
})
export class MatFaqComponent {
  @Input()
  title = 'FAQ';
  @Input()
  multi = false;
  @Input()
  displayMode = 'default'; // or flat
  @Input()
  faqList: FaqItem[] = [];

  constructor(private faqService: FAQService, private faqComponent: FaqComponent) {
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
