import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { Web3Service } from '@core/services/web3.service';
import { ApiService } from '@core/services/api.service';
import { Router } from '@angular/router';
import { IconComponent } from '@shared/components/icon/icon.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';

@Component({
  selector: 'app-web3-overlays',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './web3-overlays.component.html',
})
export class Web3OverlaysComponent {
  public readonly stateService = inject(StateService);
  public readonly web3Service = inject(Web3Service);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  // Quản lý các bước nâng cấp gói cước
  public readonly plans = signal<any[]>([]);
  public readonly isPlansLoading = signal<boolean>(false);
  public readonly selectedPlan = signal<any>(null);
  public readonly durationMonths = signal<number>(1); // 1, 3, 6, 12
  public readonly isUpgrading = signal<boolean>(false);

  // Quản lý phương thức thanh toán hệ thống
  public readonly systemPaymentMethods = signal<any[]>([]);
  public readonly selectedSystemPayment = signal<any>(null);
  public readonly isSystemPaymentsLoading = signal<boolean>(false);

  /**
   * Kiểm tra gói cước có bị vô hiệu hóa trên giao diện hay không
   */
  public isPlanDisabled(planCode: string): boolean {
    if (planCode === 'free') {
      const currentPlanCode = this.stateService.subscriptionPlanCode();
      const isExpired = this.stateService.isSubscriptionBlocked();
      return currentPlanCode !== 'free' || isExpired;
    }
    return false;
  }

  /**
   * Tải danh sách các gói cước đang hoạt động
   */
  public loadPlans() {
    this.isPlansLoading.set(true);
    this.apiService.getPublicPlans().subscribe({
      next: (data) => {
        this.plans.set(data);
        const currentPlanCode = this.stateService.subscriptionPlanCode();
        const currentPlan = data.find((p) => p.code === currentPlanCode);
        
        if (currentPlan && !this.isPlanDisabled(currentPlan.code)) {
          this.selectedPlan.set(currentPlan);
        } else {
          const availablePlan = data.find((p) => !this.isPlanDisabled(p.code));
          if (availablePlan) {
            this.selectedPlan.set(availablePlan);
          } else if (data.length > 0) {
            this.selectedPlan.set(data[0]);
          }
        }
        this.isPlansLoading.set(false);
      },
      error: (err) => {
        console.error('[Upgrade] Lỗi tải gói cước:', err);
        this.isPlansLoading.set(false);
      },
    });
  }

  /**
   * Tải danh sách phương thức thanh toán của nhà sáng lập (hệ thống)
   */
  public loadSystemPaymentMethods() {
    this.isSystemPaymentsLoading.set(true);
    this.apiService.getSystemPaymentMethods().subscribe({
      next: (data) => {
        const activePayments = (data || []).filter((p) => p.is_active);
        this.systemPaymentMethods.set(activePayments);
        if (activePayments.length > 0) {
          this.selectedSystemPayment.set(activePayments[0]);
        } else {
          this.selectedSystemPayment.set(null);
        }
        this.isSystemPaymentsLoading.set(false);
      },
      error: (err) => {
        console.error('[Upgrade] Lỗi tải phương thức thanh toán hệ thống:', err);
        this.isSystemPaymentsLoading.set(false);
      },
    });
  }

  /**
   * Chuyển sang bước 2 (Modal Pricing) và load danh sách các gói
   */
  public handleUpgradeNowClick() {
    this.stateService.upgradeModalStep.set(2);
    this.loadPlans();
    this.loadSystemPaymentMethods();
  }

  /**
   * Tính tổng tiền VND cần thanh toán
   */
  public getUpgradeVndAmount(): number {
    const plan = this.selectedPlan();
    if (!plan) return 0;
    if (plan.code === 'free') return 0;
    const duration = this.durationMonths();
    if (duration === 12) {
      return Number(plan.price_per_year) || 0;
    }
    return (Number(plan.price_per_month) || 0) * duration;
  }

  /**
   * Lấy link ảnh mã QR code tương ứng của phương thức thanh toán
   */
  public getQrCodeUrl(item: any): string {
    if (!item) return '';
    if (item.type === 'bank') {
      return `https://img.vietqr.io/image/${item.bank_code}-${item.account_number}-compact.jpg?accountName=${encodeURIComponent(item.account_holder)}`;
    } else if (item.type === 'wallet' && item.name.toLowerCase() === 'momo') {
      return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https%3A%2F%2Fnhantien.momo.vn%2F${item.account_number}`;
    } else {
      return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(item.account_number)}`;
    }
  }

  /**
   * Thực hiện thanh toán bằng Tiền mặt và gọi API nâng cấp backend
   */
  public executeUpgradePayment() {
    const plan = this.selectedPlan();
    if (!plan || plan.code === 'free') return;

    const duration = this.durationMonths();
    const fakeTxHash = 'CASH_UPGRADE_' + Date.now();

    this.isUpgrading.set(true);
    this.stateService.showToast('Đang gửi yêu cầu nâng cấp gói cước...', 'success');

    this.apiService
      .updateTenantSubscriptionUpgrade({
        plan_code: plan.code,
        duration_months: duration,
        tx_hash: fakeTxHash,
      })
      .subscribe({
        next: (res) => {
          this.stateService.showToast(
            'Chúc mừng! Gói cước đã được nâng cấp/gia hạn thành công.',
            'success',
          );
          // Cập nhật lại cấu hình và subscription từ backend
          this.stateService.loadSettings();
          this.closeUpgradeModal();
        },
        error: (err) => {
          console.error('[Upgrade] Lỗi nâng cấp gói cước backend:', err);
          this.stateService.showToast(
            err.error?.message ||
              'Không thể nâng cấp gói cước trên hệ thống. Vui lòng liên hệ hỗ trợ!',
            'error',
          );
          this.isUpgrading.set(false);
        },
      });
  }

  /**
   * Reset các trạng thái và đóng modal nâng cấp
   */
  public closeUpgradeModal() {
    this.stateService.isUpgradeModalOpen.set(false);
    this.stateService.upgradeModalStep.set(1);
    this.selectedPlan.set(null);
    this.durationMonths.set(1);
    this.isUpgrading.set(false);
  }

  /**
   * Chuyển hướng tới trang cá nhân và đóng modal ví
   */
  public goToProfile() {
    this.stateService.isWalletModalOpen.set(false);
    this.router.navigate(['/profile']);
  }
}
