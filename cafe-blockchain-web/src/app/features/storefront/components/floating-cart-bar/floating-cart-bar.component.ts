import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@shared/components/icon/icon.component';
import { CardComponent } from '@shared/components/card/card.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';

@Component({
  selector: 'app-floating-cart-bar',
  standalone: true,
  imports: [CommonModule, IconComponent, CardComponent, ButtonComponent, VNDCurrencyPipe],
  templateUrl: './floating-cart-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class FloatingCartBarComponent {
  @Input() cartCount: number = 0;
  @Input() cartTotal: number = 0;
  @Output() checkout = new EventEmitter<void>();
}
