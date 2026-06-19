import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { Web3Service } from '@core/services/web3.service';
import { ApiService } from '@core/services/api.service';
import { Router } from '@angular/router';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-web3-overlays',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './web3-overlays.component.html'
})
export class Web3OverlaysComponent {
  public readonly stateService = inject(StateService);
  public readonly web3Service = inject(Web3Service);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  // Quản lý các bước nâng cấp gói cước
  public readonly upgradeStep = signal<number>(1); // 1: Modal chặn, 2: Modal pricing/thanh toán
  public readonly plans = signal<any[]>([]);
  public readonly isPlansLoading = signal<boolean>(false);
  public readonly selectedPlan = signal<any>(null);
  public readonly durationMonths = signal<number>(1); // 1, 3, 6, 12
  public readonly isUpgrading = signal<boolean>(false);

  /**
   * Tải danh sách các gói cước đang hoạt động
   */
  public loadPlans() {
    this.isPlansLoading.set(true);
    this.apiService.getPublicPlans().subscribe({
      next: (data) => {
        this.plans.set(data);
        const currentPlanCode = this.stateService.subscriptionPlanCode();
        const currentPlan = data.find(p => p.code === currentPlanCode);
        if (currentPlan) {
          this.selectedPlan.set(currentPlan);
        } else if (data.length > 0) {
          this.selectedPlan.set(data[0]);
        }
        this.isPlansLoading.set(false);
      },
      error: (err) => {
        console.error('[Upgrade] Lỗi tải gói cước:', err);
        this.isPlansLoading.set(false);
      }
    });
  }

  /**
   * Chuyển sang bước 2 (Modal Pricing) và load danh sách các gói
   */
  public handleUpgradeNowClick() {
    this.upgradeStep.set(2);
    this.loadPlans();
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
   * Thực hiện thanh toán bằng Tiền mặt và gọi API nâng cấp backend
   */
  public executeUpgradePayment() {
    const plan = this.selectedPlan();
    if (!plan || plan.code === 'free') return;

    const duration = this.durationMonths();
    const fakeTxHash = 'CASH_UPGRADE_' + Date.now();

    this.isUpgrading.set(true);
    this.stateService.showToast('Đang gửi yêu cầu nâng cấp gói cước...', 'success');

    this.apiService.updateTenantSubscriptionUpgrade({
      plan_code: plan.code,
      duration_months: duration,
      tx_hash: fakeTxHash
    }).subscribe({
      next: (res) => {
        this.stateService.showToast('Chúc mừng! Gói cước đã được nâng cấp/gia hạn thành công.', 'success');
        // Cập nhật lại cấu hình và subscription từ backend
        this.stateService.loadSettings();
        this.closeUpgradeModal();
      },
      error: (err) => {
        console.error('[Upgrade] Lỗi nâng cấp gói cước backend:', err);
        this.stateService.showToast(err.error?.message || 'Không thể nâng cấp gói cước trên hệ thống. Vui lòng liên hệ hỗ trợ!', 'error');
        this.isUpgrading.set(false);
      }
    });
  }

  /**
   * Reset các trạng thái và đóng modal nâng cấp
   */
  public closeUpgradeModal() {
    this.stateService.isUpgradeModalOpen.set(false);
    this.upgradeStep.set(1);
    this.selectedPlan.set(null);
    this.durationMonths.set(1);
    this.isUpgrading.set(false);
  }
}
