import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef } from '@core/services/modal-ref';
import { ShiftService } from '@core/services/shift.service';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-end-shift-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ButtonComponent],
  templateUrl: './end-shift-modal.component.html',
})
export class EndShiftModalComponent {
  public readonly shiftService = inject(ShiftService);
  public readonly modalRef = inject(ModalRef);

  public formatShiftTime(isoStr: string): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return (
      d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) +
      ' ' +
      d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    );
  }

  public onActualCashInput(event: any) {
    this.shiftService.onActualCashInput(event);
  }

  public confirmCloseShift() {
    if (this.shiftService.isLoading()) return;
    const actual = this.shiftService.actualCashInput();
    const note = this.shiftService.closeShiftNote();
    this.shiftService.closeShift(actual, note, () => {
      this.shiftService.shiftSummary.set(null);
      this.modalRef.close(true);
    });
  }
}
