import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';

export interface OrderSuccessModalData {
  orderCode: string;
}

@Component({
  selector: 'app-order-success-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent, BadgeComponent],
  templateUrl: './order-success-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class OrderSuccessModalComponent {
  public readonly modalRef = inject(ModalRef);
  public readonly data = inject<OrderSuccessModalData>(MODAL_DATA);

  public onContinue() {
    this.modalRef.close(true);
  }
}
