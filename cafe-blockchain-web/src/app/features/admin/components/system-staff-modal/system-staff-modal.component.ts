import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { CustomSwitchComponent } from '@shared/components/custom-switch/custom-switch.component';

@Component({
  selector: 'app-system-staff-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    CustomSelectComponent,
    CustomSwitchComponent
  ],
  templateUrl: './system-staff-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SystemStaffModalComponent implements OnInit {
  public readonly modalRef = inject(ModalRef);
  public readonly data = inject<any>(MODAL_DATA, { optional: true });
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  public readonly isActionLoading = signal<boolean>(false);
  public readonly isEdit = signal<boolean>(false);
  private staffId: number | null = null;

  public readonly staffForm: FormGroup = this.fb.group({
    wallet_address: [
      '',
      [Validators.required, Validators.pattern(/^0x[a-fA-F0-9]{40}$/)],
    ],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    role: ['staff', [Validators.required]],
    is_active: [true, [Validators.required]]
  });

  ngOnInit() {
    const staff = this.data;
    if (staff) {
      this.isEdit.set(true);
      this.staffId = staff.id;
      this.staffForm.patchValue({
        wallet_address: staff.wallet_address,
        name: staff.name,
        role: staff.role,
        is_active: staff.is_active === 1 || staff.is_active === true
      });
    }
  }

  public onSubmit() {
    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched();
      return;
    }

    this.isActionLoading.set(true);
    const data = this.staffForm.value;

    if (this.isEdit()) {
      this.apiService.updateAdminSystemStaff(this.staffId!, data).subscribe({
        next: (res) => {
          this.toastService.showToast(res.message || 'Cập nhật nhân viên thành công.', 'success');
          this.isActionLoading.set(false);
          this.modalRef.close(true);
        },
        error: (err) => {
          const msg = err.error?.message || 'Có lỗi xảy ra khi cập nhật nhân viên.';
          this.toastService.showToast(msg, 'error');
          this.isActionLoading.set(false);
        }
      });
    } else {
      this.apiService.createAdminSystemStaff(data).subscribe({
        next: (res) => {
          this.toastService.showToast(res.message || 'Thêm nhân viên thành công.', 'success');
          this.isActionLoading.set(false);
          this.modalRef.close(true);
        },
        error: (err) => {
          const msg = err.error?.message || 'Có lỗi xảy ra khi thêm nhân viên.';
          this.toastService.showToast(msg, 'error');
          this.isActionLoading.set(false);
        }
      });
    }
  }

  public onCancel() {
    this.modalRef.close(false);
  }
}
