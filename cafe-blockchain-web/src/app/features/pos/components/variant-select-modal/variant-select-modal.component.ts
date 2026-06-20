import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ButtonComponent } from '@shared/components/button/button.component';

export interface VariantSelectModalData {
  product: any;
  selectedVariant: any | null;
}

@Component({
  selector: 'app-variant-select-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './variant-select-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class VariantSelectModalComponent {
  public readonly modalRef = inject(ModalRef);
  public readonly data = inject<VariantSelectModalData>(MODAL_DATA);

  public selectedVariant = this.data.selectedVariant;

  public selectVariantForCart(variant: any) {
    this.selectedVariant = variant;
  }

  public onCancel() {
    this.modalRef.close(null);
  }

  public onConfirm() {
    if (!this.selectedVariant && this.data.product?.variants?.length > 0) {
      this.selectedVariant = this.data.product.variants[0];
    }
    this.modalRef.close(this.selectedVariant);
  }
}
