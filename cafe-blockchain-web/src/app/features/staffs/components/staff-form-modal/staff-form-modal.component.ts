import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MODAL_DATA, ModalRef } from '@core/services/modal-ref';
import { ApiService } from '@core/services/api.service';
import { StateService } from '@core/services/state.service';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-staff-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomSelectComponent,
    IconComponent,
    ButtonComponent,
  ],
  templateUrl: './staff-form-modal.component.html',
})
export class StaffFormModalComponent {
  private readonly apiService = inject(ApiService);
  public readonly stateService = inject(StateService);
  private readonly fb = inject(FormBuilder);

  public staffForm!: FormGroup;
  public readonly editingStaff = signal<any | null>(null);
  public readonly isSavingStaff = signal<boolean>(false);
  public readonly roleOptions: any[] = [];
  public readonly isStaffLimitReached = signal<boolean>(false);

  constructor(
    @Inject(MODAL_DATA) public data: any,
    public modalRef: ModalRef<boolean>
  ) {
    if (data) {
      this.editingStaff.set(data.editingStaff || null);
      this.roleOptions = data.roleOptions || [];
      this.isStaffLimitReached.set(data.isStaffLimitReached || false);
    }
    this.initStaffForm();
  }

  private initStaffForm() {
    const staff = this.editingStaff();
    this.staffForm = this.fb.group({
      name: [staff?.name || '', [Validators.required, Validators.maxLength(255)]],
      phone: [staff?.phone || '', [Validators.required, Validators.maxLength(20)]],
      wallet_address: [
        staff?.wallet_address || '',
        [Validators.required, Validators.pattern(/^0x[a-fA-F0-9]{40}$/i)],
      ],
      role_id: [staff?.role_id || null, [Validators.required]],
    });
  }

  public saveStaff() {
    if (this.isSavingStaff()) return;

    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched();
      return;
    }

    const staffId = this.editingStaff()?.id;
    if (!staffId && this.isStaffLimitReached()) {
      const maxStaffs = this.stateService.getFeatureLimit('max_staffs');
      this.stateService.showToast(
        `Gói cước hiện tại chỉ hỗ trợ tối đa ${maxStaffs} nhân viên. Vui lòng nâng cấp gói cước!`,
        'error',
      );
      return;
    }

    this.isSavingStaff.set(true);
    const data = this.staffForm.value;

    const request = staffId
      ? this.apiService.updateStaff(staffId, data)
      : this.apiService.createStaff(data);

    request.subscribe({
      next: (res) => {
        this.stateService.showToast(
          staffId ? 'Cập nhật nhân viên thành công!' : 'Thêm nhân viên mới thành công!',
          'success',
        );
        this.isSavingStaff.set(false);
        this.modalRef.close(true);
      },
      error: (err) => {
        const isLimitError = err.error?.message?.includes('subscription plan has reached the maximum limit');
        if (!isLimitError) {
          const errorMsg = err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
          this.stateService.showToast(errorMsg, 'error');
        }
        this.isSavingStaff.set(false);
      },
    });
  }
}
