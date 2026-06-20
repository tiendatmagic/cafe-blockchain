import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { CustomDatePickerComponent } from '@shared/components/custom-date-picker/custom-date-picker.component';
import { ButtonComponent } from '@shared/components/button/button.component';

export interface TenantSubscriptionModalData {
  tenant: any;
  planOptions: { value: string; label: string }[];
}

@Component({
  selector: 'app-tenant-subscription-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomSelectComponent,
    CustomDatePickerComponent,
    ButtonComponent
  ],
  templateUrl: './tenant-subscription-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class TenantSubscriptionModalComponent implements OnInit {
  public readonly modalRef = inject(ModalRef);
  public readonly data = inject<TenantSubscriptionModalData>(MODAL_DATA);
  
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  public subscriptionForm!: FormGroup;
  public readonly isLoading = signal<boolean>(false);

  // Today string YYYY-MM-DD
  public get todayStr(): string {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    const tenant = this.data.tenant;
    let dateStr = null;
    if (tenant.subscription_expires_at) {
      dateStr = tenant.subscription_expires_at.split(/[T ]/)[0];
    }

    this.subscriptionForm = this.fb.group({
      store_name: [tenant.store_name || '', [Validators.required, Validators.maxLength(255)]],
      plan_code: [tenant.plan_code || 'free', [Validators.required]],
      subscription_expires_at: [dateStr, [Validators.required]],
      subscription_status: [tenant.subscription_status || 'active', [Validators.required]],
    });

    // Auto set 7 days if changing plan code to 'free'
    this.subscriptionForm.get('plan_code')?.valueChanges.subscribe((planCode) => {
      if (planCode === 'free') {
        this.setSubscriptionDuration(7, 'days');
      }
    });
  }

  public setSubscriptionDuration(value: number, unit: 'days' | 'months' = 'months') {
    const today = new Date();
    if (unit === 'months') {
      today.setMonth(today.getMonth() + value);
    } else {
      today.setDate(today.getDate() + value);
    }
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const dateStr = `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
    this.subscriptionForm.patchValue({
      subscription_expires_at: dateStr,
    });
  }

  public onSubmit() {
    if (this.isLoading()) return;

    if (this.subscriptionForm.invalid) {
      this.subscriptionForm.markAllAsTouched();
      return;
    }

    const tenant = this.data.tenant;
    if (!tenant) return;

    this.isLoading.set(true);
    const postData = this.subscriptionForm.value;

    this.apiService.updateTenantSubscription(tenant.id, postData).subscribe({
      next: () => {
        this.toastService.showToast('Cập nhật thuê bao quán thành công!', 'success');
        this.isLoading.set(false);
        this.modalRef.close(true);
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
        this.toastService.showToast(errorMsg, 'error');
        this.isLoading.set(false);
      },
    });
  }

  public onCancel() {
    this.modalRef.close(false);
  }
}
