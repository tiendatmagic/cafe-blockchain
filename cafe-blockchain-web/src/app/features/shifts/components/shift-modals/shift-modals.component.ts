import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-shift-modals',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, IconComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './shift-modals.component.html',
})
export class ShiftModalsComponent {
  public readonly stateService = inject(StateService);

  public formatShiftTime(isoStr: string): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return (
      d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) +
      ' ' +
      d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    );
  }
}
