import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html'
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
}
