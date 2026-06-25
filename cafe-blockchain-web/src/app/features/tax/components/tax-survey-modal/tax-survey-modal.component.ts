import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef } from '@core/services/modal-ref';
import { TaxService } from '@core/services/tax.service';
import { ToastService } from '@core/services/toast.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { CustomSwitchComponent } from '@shared/components/custom-switch/custom-switch.component';

@Component({
  selector: 'app-tax-survey-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    IconComponent,
    CustomSwitchComponent
  ],
  templateUrl: './tax-survey-modal.component.html',
})
export class TaxSurveyModalComponent implements OnInit {
  private readonly modalRef = inject(ModalRef);
  private readonly taxService = inject(TaxService);
  private readonly toastService = inject(ToastService);

  public readonly surveyStep = signal<number>(1);
  public readonly isSaving = signal<boolean>(false);

  public readonly surveyForm = signal<any>({
    business_group: 2, // 2: 1-3 tỷ
    industry_type: 'production',
    is_multi_industry: false,
    industry_allocation: {
      distributor: 0,
      service: 0,
      production: 0,
      others: 0,
    },
    tax_method: 'revenue_percent',
  });

  ngOnInit() {
    const profile = this.taxService.taxProfile();
    if (profile) {
      this.surveyForm.set({
        business_group: profile.business_group || 2,
        industry_type: profile.industry_type || 'production',
        is_multi_industry: !!profile.is_multi_industry,
        industry_allocation: profile.industry_allocation || {
          distributor: 0,
          service: 0,
          production: 0,
          others: 0,
        },
        tax_method: profile.tax_method || 'revenue_percent',
      });
    }
  }

  public close() {
    this.modalRef.close(false);
  }

  public setSurveyField(field: string, value: any) {
    this.surveyForm.update((form) => ({
      ...form,
      [field]: value,
    }));
  }

  public setAllocationField(industry: string, val: any) {
    this.surveyForm.update((form) => {
      const alloc = { ...form.industry_allocation, [industry]: Number(val) };
      return { ...form, industry_allocation: alloc };
    });
  }

  public nextStep() {
    if (this.surveyStep() === 1) {
      const form = this.surveyForm();
      if (form.is_multi_industry) {
        const sum = Object.values(form.industry_allocation).reduce((s: any, v: any) => s + v, 0) as number;
        if (sum !== 100) {
          this.toastService.showToast('Tổng tỷ lệ phân bổ các ngành kinh doanh phải bằng 100%!', 'error');
          return;
        }
      }
    }
    this.surveyStep.update((s) => s + 1);
  }

  public prevStep() {
    this.surveyStep.update((s) => Math.max(1, s - 1));
  }

  public submitSurvey() {
    if (this.isSaving()) return;
    this.isSaving.set(true);

    this.taxService.saveTaxProfile(this.surveyForm()).subscribe({
      next: (res) => {
        this.toastService.showToast('Lập hồ sơ khảo sát thuế thành công!', 'success');
        this.taxService.taxProfile.set(res.profile);
        this.taxService.isProfileConfigured.set(true);
        this.isSaving.set(false);
        this.modalRef.close(true);
      },
      error: () => {
        this.isSaving.set(false);
        this.toastService.showToast('Lưu hồ sơ thuế thất bại!', 'error');
      }
    });
  }
}
