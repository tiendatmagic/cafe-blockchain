import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card, [app-card]',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  host: {
    '[class.app-card]': '!interactive',
    '[class.app-card-interactive]': 'interactive'
  },
  styles: [`
    :host:not(.flex):not(.grid):not(.inline-block):not(.inline-flex):not(.hidden) {
      display: block;
    }
  `]
})
export class CardComponent {
  @Input() interactive = false;
}
