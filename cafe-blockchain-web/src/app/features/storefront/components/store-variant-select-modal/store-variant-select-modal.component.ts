import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';

export interface StoreVariantSelectModalData {
  product: any;
  selectedVariant: any | null;
  variantNote: string;
  variantQuantity: number;
}

@Component({
  selector: 'app-store-variant-select-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, IconComponent],
  templateUrl: './store-variant-select-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class StoreVariantSelectModalComponent {
  public readonly modalRef = inject(ModalRef);
  public readonly data = inject<StoreVariantSelectModalData>(MODAL_DATA);

  public selectedVariant = signal<any | null>(this.data.selectedVariant);
  public variantQuantity = signal<number>(this.data.variantQuantity);
  public variantNote = signal<string>(this.data.variantNote);

  public selectVariant(variant: any) {
    this.selectedVariant.set(variant);
  }

  public adjustQty(change: number) {
    const next = this.variantQuantity() + change;
    if (next >= 1) {
      this.variantQuantity.set(next);
    }
  }

  public onCancel() {
    this.modalRef.close(null);
  }

  public onConfirm() {
    this.modalRef.close({
      variant: this.selectedVariant(),
      quantity: this.variantQuantity(),
      note: this.variantNote().trim(),
    });
  }
}
