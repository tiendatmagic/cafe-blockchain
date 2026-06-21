import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalRef } from '@core/services/modal-ref';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';

@Component({
  selector: 'app-system-staff-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    CustomSelectComponent
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
export class SystemStaffModalComponent {
  public readonly modalRef = inject(ModalRef);
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  public readonly isActionLoading = signal<boolean>(false);
  public readonly staffForm: FormGroup = this.fb.group({
    wallet_address: [
      '',
      [Validators.required, Validators.pattern(/^0x[a-fA-F0-9]{40}$/)],
    ],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    role: ['staff', [Validators.required]],
    is_active: [true, [Validators.required]]
  });

  public onSubmit() {
    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched();
      return;
    }

    this.isActionLoading.set(true);
    const data = this.staffForm.value;

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

  public onCancel() {
    this.modalRef.close(false);
  }
}
