import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MODAL_DATA, ModalRef } from '@core/services/modal-ref';
import { StateService } from '@core/services/state.service';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { VNDCurrencyPipe } from '@shared/pipes/vnd.pipe';

@Component({
  selector: 'app-shift-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    ButtonComponent,
    BadgeComponent,
    VNDCurrencyPipe,
  ],
  templateUrl: './shift-detail-modal.component.html',
})
export class ShiftDetailModalComponent {
  public readonly stateService = inject(StateService);
  public readonly modalRef = inject(ModalRef);

  constructor(@Inject(MODAL_DATA) public data: any) {}

  public get selectedShiftDetails() {
    return this.data.shift;
  }

  public printShiftReceipt() {
    if (this.data.onPrint) {
      this.data.onPrint(this.selectedShiftDetails);
    }
  }

  // Tính thời lượng làm việc (dành cho ca đã kết thúc)
  public calculateShiftDuration(startIso: string, endIso: string | null | undefined): string {
    if (!startIso || !endIso) return '—';
    const start = new Date(startIso);
    const end = new Date(endIso);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return '00:00:00';

    const diffSecs = Math.floor(diffMs / 1000);
    const hours = Math.floor(diffSecs / 3600);
    const minutes = Math.floor((diffSecs % 3600) / 60);
    const seconds = diffSecs % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
}
