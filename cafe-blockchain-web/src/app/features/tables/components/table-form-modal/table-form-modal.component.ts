import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { CustomSelectComponent } from '@shared/components/custom-select/custom-select.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-table-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomSelectComponent, ButtonComponent],
  templateUrl: './table-form-modal.component.html',
})
export class TableFormModalComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  public readonly modalRef = inject(ModalRef);
  private readonly modalData = inject(MODAL_DATA, { optional: true });

  public readonly isTableSaving = signal<boolean>(false);
  public tableModalType: 'add' | 'edit' = 'add';
  private editingTable: any = null;

  public readonly tableForm = signal<any>({
    name: '',
    area_id: 0,
    status: 'empty',
  });

  public get areas() {
    return this.stateService.areas;
  }

  public readonly tableAreaOptions = computed(() => [
    { id: 0, name: '-- Chọn khu vực --' },
    ...this.areas(),
  ]);

  public ngOnInit(): void {
    if (this.modalData && this.modalData.table) {
      this.tableModalType = 'edit';
      this.editingTable = this.modalData.table;
      this.tableForm.set({
        name: this.editingTable.name,
        area_id: this.editingTable.area_id,
        status: this.editingTable.status,
      });
    } else {
      this.tableModalType = 'add';
      this.tableForm.set({
        name: '',
        area_id: this.areas().length > 0 ? this.areas()[0].id : 0,
        status: 'empty',
      });
    }
  }

  public saveTable(): void {
    const form = this.tableForm();
    if (!form.name || !form.name.trim() || form.area_id <= 0) {
      this.stateService.showToast('Vui lòng nhập tên bàn và chọn khu vực hợp lệ!', 'error');
      return;
    }

    this.isTableSaving.set(true);
    if (this.tableModalType === 'add') {
      this.apiService.createDiningTable(form).subscribe({
        next: () => {
          this.stateService.showToast('Thêm bàn ăn thành công!', 'success');
          this.isTableSaving.set(false);
          this.modalRef.close(true);
        },
        error: () => {
          this.stateService.showToast('Thêm bàn thất bại!', 'error');
          this.isTableSaving.set(false);
        },
      });
    } else {
      const id = this.editingTable.id;
      this.apiService.updateDiningTable(id, form).subscribe({
        next: () => {
          this.stateService.showToast('Cập nhật bàn ăn thành công!', 'success');
          this.isTableSaving.set(false);
          this.modalRef.close(true);
        },
        error: () => {
          this.stateService.showToast('Cập nhật bàn thất bại!', 'error');
          this.isTableSaving.set(false);
        },
      });
    }
  }
}
