import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ModalRef, MODAL_DATA } from '@core/services/modal-ref';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-table-qr-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ButtonComponent],
  templateUrl: './table-qr-modal.component.html',
})
export class TableQrModalComponent implements OnInit {
  public readonly stateService = inject(StateService);
  public readonly modalRef = inject(ModalRef);
  private readonly modalData = inject(MODAL_DATA, { optional: true });

  public selectedTable: any = null;

  public ngOnInit(): void {
    if (this.modalData && this.modalData.table) {
      this.selectedTable = this.modalData.table;
    } else {
      this.modalRef.close();
    }
  }

  public getDiningTableQrUrl(): string {
    if (!this.selectedTable) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const slug = this.stateService.settings()?.website_slug || '';
    const url = `${origin}/store/${slug}?table=${encodeURIComponent(this.selectedTable.name)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
  }

  public getTableStorefrontUrl(): string {
    if (!this.selectedTable) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const slug = this.stateService.settings()?.website_slug || '';
    return `${origin}/store/${slug}?table=${encodeURIComponent(this.selectedTable.name)}`;
  }

  public copyTableLink(): void {
    if (!this.selectedTable) return;
    const url = this.getTableStorefrontUrl();
    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.stateService.showToast('Đã sao chép liên kết gọi món trực tuyến của bàn!', 'success');
      })
      .catch(() => {
        this.stateService.showToast('Sao chép liên kết thất bại, vui lòng thử lại!', 'error');
      });
  }

  public downloadTableQrCode(): void {
    if (!this.selectedTable) return;
    const url = this.getDiningTableQrUrl();
    const filename = `qr-${this.selectedTable.name.toLowerCase().replace(/\s+/g, '-')}.png`;

    this.stateService.showToast('Đang chuẩn bị tải file QR...', 'success');
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(() => {
        window.open(url, '_blank');
      });
  }
}
