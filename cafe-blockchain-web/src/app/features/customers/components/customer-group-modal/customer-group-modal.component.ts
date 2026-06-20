import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-customer-group-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './customer-group-modal.component.html',
})
export class CustomerGroupModalComponent implements OnInit {
  private readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  public readonly modalRef = inject(ModalRef);
  private readonly modalData = inject(MODAL_DATA, { optional: true });

  public readonly isCustomerGroupSaving = signal<boolean>(false);
  public customerGroupModalType: 'add' | 'edit' = 'add';
  private editingCustomerGroup: any = null;

  public readonly customerGroupForm = signal<any>({
    name: '',
  });

  ngOnInit(): void {
    if (this.modalData && this.modalData.group) {
      this.customerGroupModalType = 'edit';
      this.editingCustomerGroup = this.modalData.group;
      this.customerGroupForm.set({ name: this.editingCustomerGroup.name });
    } else {
      this.customerGroupModalType = 'add';
      this.customerGroupForm.set({ name: '' });
    }
  }

  public saveCustomerGroup(): void {
    const form = this.customerGroupForm();
    if (!form.name || !form.name.trim()) {
      this.stateService.showToast('Tên nhóm khách hàng là bắt buộc!', 'error');
      return;
    }

    this.isCustomerGroupSaving.set(true);
    if (this.customerGroupModalType === 'add') {
      this.apiService.createCustomerGroup(form).subscribe({
        next: () => {
          this.stateService.showToast('Thêm nhóm khách hàng thành công!', 'success');
          this.isCustomerGroupSaving.set(false);
          this.modalRef.close(true);
        },
        error: () => {
          this.stateService.showToast('Thêm nhóm thất bại hoặc tên nhóm đã tồn tại!', 'error');
          this.isCustomerGroupSaving.set(false);
        },
      });
    } else {
      const id = this.editingCustomerGroup.id;
      this.apiService.updateCustomerGroup(id, form).subscribe({
        next: () => {
          this.stateService.showToast('Cập nhật nhóm khách hàng thành công!', 'success');
          this.isCustomerGroupSaving.set(false);
          this.modalRef.close(true);
        },
        error: () => {
          this.stateService.showToast('Cập nhật nhóm thất bại!', 'error');
          this.isCustomerGroupSaving.set(false);
        },
      });
    }
  }
}
