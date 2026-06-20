import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef } from '@core/services/modal-ref';
import { ShiftService } from '@core/services/shift.service';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-start-shift-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ButtonComponent],
  templateUrl: './start-shift-modal.component.html',
})
export class StartShiftModalComponent {
  public readonly shiftService = inject(ShiftService);
  public readonly modalRef = inject(ModalRef);

  public onInitialCashInput(event: any) {
    this.shiftService.onInitialCashInput(event);
  }

  public setInitialCash(value: number) {
    this.shiftService.initialCashInput.set(value);
  }

  public confirmStartShift() {
    if (this.shiftService.isLoading()) return;
    const cash = this.shiftService.initialCashInput();
    this.shiftService.openShift(cash, () => {
      this.shiftService.initialCashInput.set(0);
      this.modalRef.close(true);
    });
  }
}
