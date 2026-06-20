import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalRef } from '@core/services/modal-ref';
import { ToastService } from '@core/services/toast.service';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

@Component({
  selector: 'app-barcode-scanner-modal',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  templateUrl: './barcode-scanner-modal.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class BarcodeScannerModalComponent implements OnInit, OnDestroy {
  public readonly modalRef = inject(ModalRef);
  private readonly toastService = inject(ToastService);

  public readonly isLoading = signal<boolean>(true);
  public readonly error = signal<string>('');
  
  private html5Qrcode: any = null;

  ngOnInit() {
    setTimeout(() => {
      this.initScanner();
    }, 300);
  }

  ngOnDestroy() {
    this.cleanupScanner();
  }

  private initScanner() {
    try {
      this.html5Qrcode = new Html5Qrcode('barcode-scanner-reader', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.QR_CODE,
        ],
        verbose: false,
      });

      const config = {
        fps: 10,
        qrbox: (width: number, height: number) => {
          return { width: Math.min(width * 0.8, 250), height: Math.min(height * 0.4, 100) };
        },
        aspectRatio: 1.777778,
      };

      this.html5Qrcode
        .start(
          { facingMode: 'environment' },
          config,
          (decodedText: string) => {
            this.toastService.showToast(`Đã quét mã vạch: ${decodedText}`, 'success');
            this.modalRef.close(decodedText);
          },
          () => {
            // Ignore scan errors while seeking barcode
          }
        )
        .then(() => {
          this.isLoading.set(false);
        })
        .catch((err: any) => {
          console.error('Không khởi động được camera:', err);
          this.error.set('Không thể truy cập camera. Vui lòng cấp quyền camera cho trình duyệt.');
          this.isLoading.set(false);
        });
    } catch (e: any) {
      console.error('Lỗi khởi tạo quét:', e);
      this.error.set('Có lỗi xảy ra: ' + e.message);
      this.isLoading.set(false);
    }
  }

  public onBarcodeFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.isLoading.set(true);
    this.error.set('');

    const runFileScan = async (fileToScan: File) => {
      try {
        if (this.html5Qrcode && this.html5Qrcode.isScanning) {
          await this.html5Qrcode.stop();
        }

        if (!this.html5Qrcode) {
          this.html5Qrcode = new Html5Qrcode('barcode-scanner-reader', {
            formatsToSupport: [
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.QR_CODE,
            ],
            verbose: false,
          });
        }

        const decodedText = await this.html5Qrcode.scanFile(fileToScan, false);
        this.toastService.showToast(`Đã nhận diện mã vạch từ ảnh: ${decodedText}`, 'success');
        this.modalRef.close(decodedText);
      } catch (err: any) {
        console.error('Lỗi quét file ảnh:', err);
        this.error.set('Không tìm thấy mã vạch hợp lệ trong ảnh này. Vui lòng chụp rõ nét hơn!');
        this.isLoading.set(false);
      }
    };

    // Draw Quiet Zone surrounding barcode image
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const padding = 40;
          canvas.width = img.width + padding * 2;
          canvas.height = img.height + padding * 2;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Không thể khởi tạo Canvas 2D Context');
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, padding, padding);

          canvas.toBlob((blob) => {
            if (blob) {
              const processedFile = new File([blob], file.name, {
                type: file.type || 'image/jpeg',
                lastModified: Date.now(),
              });
              runFileScan(processedFile);
            } else {
              runFileScan(file);
            }
          }, file.type || 'image/jpeg');
        } catch (canvasErr) {
          console.error('Lỗi xử lý canvas Quiet Zone:', canvasErr);
          runFileScan(file);
        }
      };
      img.onerror = () => runFileScan(file);
      img.src = e.target.result;
    };
    reader.onerror = () => runFileScan(file);
    reader.readAsDataURL(file);
  }

  private cleanupScanner() {
    if (this.html5Qrcode) {
      if (this.html5Qrcode.isScanning) {
        this.html5Qrcode.stop().catch((err: any) => console.error('Lỗi tắt camera:', err));
      }
      this.html5Qrcode = null;
    }
  }

  public onCancel() {
    this.modalRef.close(null);
  }
}
