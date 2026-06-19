import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';

@Component({
  selector: 'app-subscription-blocked',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl">
      <div class="w-full max-w-lg overflow-hidden border border-purple-500/20 bg-slate-900/90 shadow-2xl rounded-2xl p-6 sm:p-8 text-center text-white relative">
        <!-- Glow Effect Background -->
        <div class="absolute -top-20 -left-20 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-600/30 rounded-full blur-3xl"></div>

        <!-- SVG Icon -->
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 mb-6 border border-purple-500/20">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <!-- Title -->
        <h2 class="text-2xl font-bold tracking-tight mb-2">
          {{ isSuspended() ? 'Tài Khoản Đã Bị Khóa' : 'Gói Dịch Vụ Đã Hết Hạn' }}
        </h2>

        <!-- Description -->
        <p class="text-slate-400 text-sm sm:text-base mb-6 leading-relaxed">
          {{ isSuspended() 
            ? 'Cửa hàng của bạn đã bị tạm dừng hoạt động trên hệ thống do vi phạm điều khoản dịch vụ hoặc vì lý do bảo mật.'
            : 'Thời gian sử dụng gói cước của cửa hàng đã kết thúc. Vui lòng thực hiện gia hạn để tiếp tục quản lý kinh doanh.' 
          }}
        </p>

        <!-- Details Box -->
        <div class="bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-6 text-left text-xs sm:text-sm space-y-2.5">
          <div class="flex justify-between">
            <span class="text-slate-500">Địa chỉ ví của bạn:</span>
            <span class="font-mono text-purple-300 font-medium">{{ walletAddress() | slice:0:6 }}...{{ walletAddress() | slice:-4 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Gói dịch vụ:</span>
            <span class="font-semibold text-purple-400 uppercase">{{ planCode() }}</span>
          </div>
          @if (!isSuspended() && expiresAt()) {
            <div class="flex justify-between">
              <span class="text-slate-500">Ngày hết hạn:</span>
              <span class="text-pink-400 font-medium">{{ expiresAt() | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          }
        </div>

        <!-- Instructions -->
        <div class="text-slate-400 text-xs mb-8 p-3.5 bg-purple-500/5 rounded-xl border border-purple-500/10">
          <p class="font-medium text-purple-300 mb-1">Hướng dẫn gia hạn & Hỗ trợ:</p>
          Để tiếp tục sử dụng, vui lòng liên hệ với nhà sáng lập qua Zalo/Telegram hoặc chuyển khoản gia hạn gói cước Pro/Ultra.
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button (click)="logout()" class="w-full py-3 px-4 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-900 transition font-medium text-sm text-slate-300">
            Đăng xuất / Đổi Ví
          </button>
          <a href="mailto:founder@cafe-blockchain.io?subject=Yeu%20cau%20gia%20han%20SaaS" class="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 transition font-extrabold text-sm text-white flex items-center justify-center shadow-lg shadow-purple-600/20">
            Liên hệ Hỗ trợ
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SubscriptionBlockedComponent {
  private readonly stateService = inject(StateService);

  public isSuspended = computed(() => this.stateService.subscriptionStatus() === 'suspended');
  public planCode = computed(() => this.stateService.subscriptionPlanCode());
  public expiresAt = computed(() => this.stateService.subscriptionExpiresAt());
  public walletAddress = computed(() => this.stateService.web3Service.currentAccount() || '');

  public logout() {
    this.stateService.disconnectWalletAndClose();
  }
}
