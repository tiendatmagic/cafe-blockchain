import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-area-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './area-form-modal.component.html',
})
export class AreaFormModalComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);
  public readonly modalRef = inject(ModalRef);
  private readonly modalData = inject(MODAL_DATA, { optional: true });

  public readonly isAreaSaving = signal<boolean>(false);
  public areaModalType: 'add' | 'edit' = 'add';
  private editingArea: any = null;

  public readonly areaForm = signal<any>({
    name: '',
  });

  public ngOnInit(): void {
    if (this.modalData && this.modalData.area) {
      this.areaModalType = 'edit';
      this.editingArea = this.modalData.area;
      this.areaForm.set({ name: this.editingArea.name });
    } else {
      this.areaModalType = 'add';
      this.areaForm.set({ name: '' });
    }
  }

  public saveArea(): void {
    const form = this.areaForm();
    if (!form.name || !form.name.trim()) {
      this.stateService.showToast('Tên khu vực là bắt buộc!', 'error');
      return;
    }

    this.isAreaSaving.set(true);
    if (this.areaModalType === 'add') {
      this.apiService.createArea(form).subscribe({
        next: () => {
          this.stateService.showToast('Thêm khu vực thành công!', 'success');
          this.isAreaSaving.set(false);
          this.modalRef.close(true);
        },
        error: () => {
          this.stateService.showToast('Thêm khu vực thất bại hoặc tên đã tồn tại!', 'error');
          this.isAreaSaving.set(false);
        },
      });
    } else {
      const id = this.editingArea.id;
      this.apiService.updateArea(id, form).subscribe({
        next: () => {
          this.stateService.showToast('Cập nhật khu vực thành công!', 'success');
          this.isAreaSaving.set(false);
          this.modalRef.close(true);
        },
        error: () => {
          this.stateService.showToast('Cập nhật khu vực thất bại!', 'error');
          this.isAreaSaving.set(false);
        },
      });
    }
  }
}
