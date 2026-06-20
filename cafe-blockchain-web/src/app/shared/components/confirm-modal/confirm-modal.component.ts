import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Xác nhận hành động';
  @Input() description = 'Bạn có chắc chắn muốn thực hiện hành động này không?';
  @Input() confirmText = 'Xác nhận';
  @Input() cancelText = 'Hủy bỏ';
  @Input() confirmButtonClass = 'btn-danger';
  @Input() isSubmitting = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    if (this.isSubmitting) return;
    this.confirm.emit();
  }

  onCancel(): void {
    if (this.isSubmitting) return;
    this.cancel.emit();
  }

  get confirmVariant():
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'danger-light'
    | 'cancel'
    | 'info' {
    if (this.confirmButtonClass.includes('danger')) return 'danger';
    if (this.confirmButtonClass.includes('secondary')) return 'secondary';
    if (this.confirmButtonClass.includes('success')) return 'success';
    if (this.confirmButtonClass.includes('cancel')) return 'cancel';
    return 'primary';
  }
}
