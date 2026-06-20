import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { CustomCheckboxComponent } from '@shared/components/custom-checkbox/custom-checkbox.component';
import { ButtonComponent } from '@shared/components/button/button.component';

export interface SubscriptionPlanModalData {
  plan: any | null;
}

@Component({
  selector: 'app-subscription-plan-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomSelectComponent,
    CustomCheckboxComponent,
    ButtonComponent
  ],
  templateUrl: './subscription-plan-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SubscriptionPlanModalComponent implements OnInit {
  public readonly modalRef = inject(ModalRef);
  public readonly data = inject<SubscriptionPlanModalData>(MODAL_DATA);

  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  public planForm!: FormGroup;
  public readonly isLoading = signal<boolean>(false);

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.planForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[a-z0-9_-]+$/)]],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      is_active: [true, [Validators.required]],
      price_per_month: [0, [Validators.required, Validators.min(0)]],
      price_per_year: [0, [Validators.required, Validators.min(0)]],
      features: this.fb.group({
        max_products: [20, [Validators.required]],
        max_staffs: [2, [Validators.required]],
        max_customers: [50, [Validators.required]],
        max_transactions: [100, [Validators.required]],
        max_debts: [10, [Validators.required]],
        enable_dashboard: [true, [Validators.required]],
        enable_pos: [true, [Validators.required]],
        enable_orders: [true, [Validators.required]],
        enable_tables: [true, [Validators.required]],
        enable_shifts: [true, [Validators.required]],
        enable_menu: [true, [Validators.required]],
        enable_inventory: [false, [Validators.required]],
        enable_customers: [true, [Validators.required]],
        enable_debts: [false, [Validators.required]],
        enable_financials: [false, [Validators.required]],
        enable_staffs: [true, [Validators.required]],
        enable_storefront: [false, [Validators.required]],
        enable_reports: [false, [Validators.required]],
        enable_excel_export: [false, [Validators.required]],
      }),
    });

    const plan = this.data.plan;
    if (plan) {
      // Disable code when editing
      this.planForm.get('code')?.disable();

      this.planForm.patchValue({
        code: plan.code,
        name: plan.name,
        is_active: plan.is_active,
        price_per_month: plan.price_per_month ?? 0,
        price_per_year: plan.price_per_year ?? 0,
        features: {
          max_products: plan.features?.max_products ?? 20,
          max_staffs: plan.features?.max_staffs ?? 2,
          max_customers: plan.features?.max_customers ?? 50,
          max_transactions: plan.features?.max_transactions ?? 100,
          max_debts: plan.features?.max_debts ?? 10,
          enable_dashboard: plan.features?.enable_dashboard !== false,
          enable_pos: plan.features?.enable_pos !== false,
          enable_orders: plan.features?.enable_orders !== false,
          enable_tables: plan.features?.enable_tables !== false,
          enable_shifts: plan.features?.enable_shifts !== false,
          enable_menu: plan.features?.enable_menu !== false,
          enable_inventory: !!plan.features?.enable_inventory,
          enable_customers: plan.features?.enable_customers !== false,
          enable_debts: !!plan.features?.enable_debts,
          enable_financials: !!plan.features?.enable_financials,
          enable_staffs: plan.features?.enable_staffs !== false,
          enable_storefront: !!plan.features?.enable_storefront,
          enable_reports: !!plan.features?.enable_reports,
          enable_excel_export: !!plan.features?.enable_excel_export,
        },
      });
    }
  }

  public onSubmit() {
    if (this.isLoading()) return;

    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const postData = this.planForm.getRawValue();
    const isEdit = !!this.data.plan;

    const request$ = isEdit
      ? this.apiService.updateAdminPlan(this.data.plan.id, postData)
      : this.apiService.createAdminPlan(postData);

    request$.subscribe({
      next: () => {
        this.toastService.showToast(
          isEdit ? 'Cập nhật gói cước thành công!' : 'Tạo gói cước mới thành công!',
          'success'
        );
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
