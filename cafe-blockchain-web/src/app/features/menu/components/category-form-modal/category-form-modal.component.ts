import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { ButtonComponent } from '@shared/components/button/button.component';

export interface CategoryFormModalData {
  category: any | null;
}

@Component({
  selector: 'app-category-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './category-form-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class CategoryFormModalComponent implements OnInit {
  public readonly modalRef = inject(ModalRef);
  public readonly data = inject<CategoryFormModalData>(MODAL_DATA);

  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);

  public name = '';
  public readonly isLoading = signal<boolean>(false);

  ngOnInit() {
    if (this.data.category) {
      this.name = this.data.category.name || '';
    }
  }

  public onSubmit() {
    if (this.isLoading()) return;

    if (!this.name.trim()) {
      this.toastService.showToast('Vui lòng nhập tên danh mục!', 'error');
      return;
    }

    this.isLoading.set(true);
    const categoryName = this.name.trim();

    const request$ = this.data.category
      ? this.apiService.updateCategory(this.data.category.id, { name: categoryName })
      : this.apiService.createCategory({ name: categoryName });

    request$.subscribe({
      next: () => {
        this.toastService.showToast(
          this.data.category ? 'Cập nhật danh mục thành công!' : 'Tạo danh mục mới thành công!',
          'success'
        );
        this.isLoading.set(false);
        this.modalRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.toastService.showToast(
          this.data.category
            ? 'Cập nhật danh mục thất bại! Tên danh mục có thể đã tồn tại.'
            : 'Tạo danh mục mới thất bại! Tên danh mục có thể đã tồn tại.',
          'error'
        );
        this.isLoading.set(false);
      },
    });
  }

  public onCancel() {
    this.modalRef.close(false);
  }
}
