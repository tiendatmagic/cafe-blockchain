import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';

export interface ListVoucherModalData {
  tokenId: number;
  gradientClass: string;
}

@Component({
  selector: 'app-list-voucher-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-voucher-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ListVoucherModalComponent {
  public readonly modalRef = inject(ModalRef);
  public readonly data = inject<ListVoucherModalData>(MODAL_DATA);

  public readonly listingPrice = signal<string>('');

  public onClose() {
    this.modalRef.close(null);
  }

  public onSubmit() {
    const priceStr = this.listingPrice().trim();
    if (!priceStr) return;
    this.modalRef.close(priceStr);
  }
}
