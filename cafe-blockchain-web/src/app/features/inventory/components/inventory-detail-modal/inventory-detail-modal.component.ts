import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-inventory-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    VNDCurrencyPipe,
    ButtonComponent,
  ],
  templateUrl: './inventory-detail-modal.component.html',
})
export class InventoryDetailModalComponent {
  public readonly modalRef = inject(ModalRef);
  public readonly record = inject(MODAL_DATA);
}
