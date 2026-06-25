import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-tax-result-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="space-y-4 text-left">
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
        Doanh thu thuộc nhóm {{ group }} - {{ getGroupDescription() }}
      </p>
      <p class="text-xs text-slate-400 dark:text-slate-500 font-semibold italic">
        (*) Nhóm doanh thu có thể thay đổi theo thực tế kinh doanh. Bạn có thể cập nhật lại bất kỳ lúc nào.
      </p>
      <div class="flex justify-end pt-2">
        <button app-button variant="primary" class="!bg-emerald-600 hover:!bg-emerald-700 text-white !px-6" (click)="close()">Đã hiểu</button>
      </div>
    </div>
  `
})
export class TaxResultModalComponent implements OnInit {
  private readonly modalRef = inject(ModalRef);
  private readonly modalData = inject(MODAL_DATA);
  public group = 1;

  ngOnInit() {
    this.group = this.modalData?.group || 1;
  }

  getGroupDescription(): string {
    if (this.group === 1) return 'Được miễn tất cả thuế GTGT và TNCN';
    if (this.group === 2) return 'Kê khai thuế theo phương pháp kê khai cơ bản.';
    return 'Khuyên dùng chế độ chốt chênh lệch doanh thu và chi phí hóa đơn.';
  }

  close() {
    this.modalRef.close(true);
  }
}
