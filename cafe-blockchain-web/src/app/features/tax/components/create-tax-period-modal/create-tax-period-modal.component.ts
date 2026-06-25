import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef } from '@core/services/modal-ref';
import { TaxService } from '@core/services/tax.service';
import { ToastService } from '@core/services/toast.service';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { CustomRadioComponent } from '@shared/components/custom-radio/custom-radio.component';

@Component({
  selector: 'app-create-tax-period-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomSelectComponent,
    ButtonComponent,
    CustomRadioComponent
  ],
  templateUrl: './create-tax-period-modal.component.html',
})
export class CreateTaxPeriodModalComponent implements OnInit {
  private readonly modalRef = inject(ModalRef);
  private readonly taxService = inject(TaxService);
  private readonly toastService = inject(ToastService);

  public readonly newPeriodType = signal<'month' | 'quarter' | 'year'>('month');
  public readonly newPeriodValue = signal<number>(1);
  public readonly newPeriodYear = signal<number>(2026);
  public readonly isSaving = signal<boolean>(false);

  public readonly monthOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `Tháng ${i + 1}` }));
  public readonly quarterOptions = [
    { value: 1, label: 'Quý 1 (T1 - T3)' },
    { value: 2, label: 'Quý 2 (T4 - T6)' },
    { value: 3, label: 'Quý 3 (T7 - T9)' },
    { value: 4, label: 'Quý 4 (T10 - T12)' },
  ];
  public readonly yearOptions = [2025, 2026, 2027, 2028].map(y => ({ value: y, label: `Năm ${y}` }));

  ngOnInit() {
    const now = new Date();
    this.newPeriodValue.set(now.getMonth() + 1);
    this.newPeriodYear.set(now.getFullYear());
  }

  public close() {
    this.modalRef.close(false);
  }

  public createPeriod() {
    if (this.isSaving()) return;

    this.isSaving.set(true);
    const payload = {
      period_type: this.newPeriodType(),
      period_value: this.newPeriodValue(),
      period_year: this.newPeriodYear(),
    };

    this.taxService.createTaxPeriod(payload).subscribe({
      next: () => {
        this.toastService.showToast('Tạo kỳ kê khai thuế thành công!', 'success');
        this.isSaving.set(false);
        this.modalRef.close(true);
      },
      error: (err) => {
        this.isSaving.set(false);
        const errorMsg = err.error?.message || 'Tạo kỳ kê khai thất bại!';
        this.toastService.showToast(errorMsg, 'error');
      }
    });
  }
}
