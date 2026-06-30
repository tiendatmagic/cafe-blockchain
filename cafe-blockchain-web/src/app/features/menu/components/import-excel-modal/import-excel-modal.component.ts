import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef } from '@core/services/modal-ref';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { StateService } from '@core/services/state.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-import-excel-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './import-excel-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ImportExcelModalComponent {
  public readonly modalRef = inject(ModalRef);
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);
  private readonly stateService = inject(StateService);

  public selectedFile = signal<File | null>(null);
  public isUploading = signal<boolean>(false);
  
  public importResult = signal<{
    success_count: number;
    error_count: number;
    errors: Array<{
      row: number;
      product_name: string;
      reasons: string[];
    }>;
  } | null>(null);

  public onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile.set(file);
      this.importResult.set(null);
    }
  }

  public onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  public onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      this.selectedFile.set(file);
      this.importResult.set(null);
    } else {
      this.toastService.showToast('Vui lòng chỉ chọn tệp Excel (.xls, .xlsx)!', 'error');
    }
  }

  public downloadTemplate() {
    this.toastService.showToast('Đang tạo và tải file mẫu...', 'success');
    this.apiService.downloadProductImportTemplate().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cafe_blockchain_product_template.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.toastService.showToast('Tải file mẫu thành công!', 'success');
      },
      error: (err) => {
        console.error(err);
        this.toastService.showToast('Tải file mẫu thất bại!', 'error');
      }
    });
  }

  public onSubmit() {
    const file = this.selectedFile();
    if (!file) {
      this.toastService.showToast('Vui lòng chọn tệp Excel để nhập!', 'error');
      return;
    }

    this.isUploading.set(true);
    this.apiService.importProductsFromExcel(file).subscribe({
      next: (res) => {
        this.isUploading.set(false);
        this.importResult.set({
          success_count: res.success_count || 0,
          error_count: res.error_count || 0,
          errors: res.errors || []
        });

        if (res.success_count > 0) {
          (this.modalRef as any).isImportedSuccess = true;
          this.stateService.clearPosProductsCache();
          this.stateService.refreshProducts();
        }

        if (res.error_count === 0) {
          this.toastService.showToast(`Nhập dữ liệu thành công ${res.success_count} sản phẩm!`, 'success');
        } else if (res.success_count > 0) {
          this.toastService.showToast(`Nhập thành công ${res.success_count} sản phẩm, có ${res.error_count} sản phẩm lỗi.`, 'error');
        } else {
          this.toastService.showToast('Tất cả sản phẩm trong tệp đều lỗi!', 'error');
        }
      },
      error: (err) => {
        console.error(err);
        const errMsg = err.error?.message || 'Có lỗi xảy ra khi tải tệp lên máy chủ!';
        this.toastService.showToast(errMsg, 'error');
        this.isUploading.set(false);
      }
    });
  }

  public onCancel() {
    const result = this.importResult();
    if ((result && result.success_count > 0) || (this.modalRef as any).isImportedSuccess) {
      this.modalRef.close(true);
    } else {
      this.modalRef.close(false);
    }
  }
}
