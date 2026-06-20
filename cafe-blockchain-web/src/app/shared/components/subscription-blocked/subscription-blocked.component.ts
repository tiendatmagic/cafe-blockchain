import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../core/services/state.service';

@Component({
  selector: 'app-subscription-blocked',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex-1 w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-y-auto">
      <div class="w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl rounded-[15px] p-6 sm:p-8 text-center text-slate-800 dark:text-slate-100 relative">
        <!-- Glow Effect Background -->
        <div class="absolute -top-20 -left-20 w-40 h-40 bg-[var(--dynamic-primary)]/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 -right-20 w-40 h-40 bg-[var(--dynamic-secondary)]/10 rounded-full blur-3xl"></div>

        <!-- SVG Icon -->
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--dynamic-primary)]/10 text-[var(--dynamic-primary)] mb-6 border border-[var(--dynamic-primary)]/20 animate-pulse">
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <!-- Title -->
        <h2 class="text-2xl font-black tracking-tight mb-2 text-slate-900 dark:text-white">
          {{ isSuspended() ? 'Tài Khoản Đã Bị Khóa' : 'Gói Dịch Vụ Đã Hết Hạn' }}
        </h2>

        <!-- Description -->
        <p class="text-slate-500 dark:text-slate-400 text-sm sm:text-base mb-6 leading-relaxed font-medium">
          {{ isSuspended() 
            ? 'Cửa hàng của bạn đã bị tạm dừng hoạt động trên hệ thống do vi phạm điều khoản dịch vụ hoặc vì lý do bảo mật.'
            : 'Thời gian sử dụng gói cước của cửa hàng đã kết thúc. Vui lòng thực hiện gia hạn để tiếp tục quản lý kinh doanh.' 
          }}
        </p>

        <!-- Details Box -->
        <div class="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 rounded-[12px] p-4 mb-6 text-left text-xs sm:text-sm space-y-2.5">
          <div class="flex justify-between items-center">
            <span class="text-slate-400 dark:text-slate-500 font-semibold">Địa chỉ ví của bạn:</span>
            <span class="font-mono text-slate-700 dark:text-slate-350 font-bold">{{ walletAddress() | slice:0:6 }}...{{ walletAddress() | slice:-4 }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-400 dark:text-slate-500 font-semibold">Gói dịch vụ:</span>
            <span class="font-extrabold text-[var(--dynamic-primary)] uppercase">{{ planCode() }}</span>
          </div>
          @if (!isSuspended() && expiresAt()) {
            <div class="flex justify-between items-center">
              <span class="text-slate-400 dark:text-slate-500 font-semibold">Ngày hết hạn:</span>
              <span class="text-rose-550 dark:text-rose-400 font-bold">{{ expiresAt() | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          }
        </div>

        <!-- Instructions -->
        <div class="text-slate-500 dark:text-slate-450 text-xs mb-8 p-3.5 bg-[var(--dynamic-primary)]/5 rounded-[12px] border border-[var(--dynamic-primary)]/10 leading-relaxed text-left">
          <p class="font-extrabold text-[var(--dynamic-primary)] mb-1.5 text-center">Hướng dẫn gia hạn & Hỗ trợ:</p>
          <p class="mb-3 text-center">Bạn có thể tự nâng cấp/gia hạn trực tiếp qua ví Web3 hoặc liên hệ với nhà sáng lập để được hỗ trợ:</p>
          
          @if (systemContacts().length > 0) {
            <div class="space-y-3 mt-3 border-t border-[var(--dynamic-primary)]/15 pt-3">
              @for (contact of systemContacts(); track contact.name) {
                <div class="bg-white dark:bg-slate-900/60 p-3.5 rounded-[12px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
                  <div class="flex items-center justify-between gap-2">
                    <span class="font-bold text-sm text-slate-800 dark:text-slate-200">{{ contact.name }}</span>
                    <a [href]="'tel:' + contact.phone" class="text-[var(--dynamic-primary)] font-black hover:underline flex items-center gap-1 shrink-0 text-sm">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      {{ contact.phone }}
                    </a>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100/50 dark:border-slate-800/40">
                    @if (contact.email) {
                      <div class="flex items-center gap-1.5 min-w-0" [title]="contact.email">
                        <span class="font-semibold text-slate-400 shrink-0">Email:</span>
                        <a [href]="'mailto:' + contact.email" class="hover:underline text-slate-700 dark:text-slate-300 truncate">{{ contact.email }}</a>
                      </div>
                    }
                    @if (contact.zalo) {
                      <div class="flex items-center gap-1.5 min-w-0">
                        <span class="font-semibold text-slate-400 shrink-0">Zalo:</span>
                        <a [href]="'https://zalo.me/' + contact.zalo" target="_blank" class="hover:underline text-slate-700 dark:text-slate-300 truncate">{{ contact.zalo }}</a>
                      </div>
                    }
                    @if (contact.telegram) {
                      <div class="flex items-center gap-1.5 min-w-0">
                        <span class="font-semibold text-slate-400 shrink-0">Tele:</span>
                        <a [href]="'https://t.me/' + contact.telegram" target="_blank" class="hover:underline text-slate-700 dark:text-slate-300 truncate">&#64;{{ contact.telegram }}</a>
                      </div>
                    }
                    @if (contact.facebook) {
                      <div class="flex items-center gap-1.5 min-w-0">
                        <span class="font-semibold text-slate-400 shrink-0">FB:</span>
                        <a [href]="contact.facebook" target="_blank" class="hover:underline text-slate-700 dark:text-slate-300 truncate">Link Profile</a>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button (click)="logout()" class="flex-1 py-3 px-4 rounded-[12px] border border-slate-200 dark:border-slate-700/80 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5">
            Đăng xuất / Đổi Ví
          </button>
          <button (click)="openUpgradeModal()" class="flex-1 py-3 px-4 rounded-[12px] bg-[var(--dynamic-primary)] hover:opacity-90 text-white font-extrabold text-sm transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-[var(--dynamic-primary)]/15">
            Xem danh sách gói cước
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 0%;
      min-height: 0;
    }
  `]
})
export class SubscriptionBlockedComponent {
  private readonly stateService = inject(StateService);

  public isSuspended = computed(() => this.stateService.subscriptionStatus() === 'suspended');
  public planCode = computed(() => this.stateService.subscriptionPlanCode());
  public expiresAt = computed(() => this.stateService.subscriptionExpiresAt());
  public walletAddress = computed(() => this.stateService.web3Service.currentAccount() || '');
  public systemContacts = computed(() => this.stateService.systemContacts());

  public logout() {
    this.stateService.disconnectWalletAndClose();
  }

  public openUpgradeModal() {
    this.stateService.triggerUpgradeModalDirectly('', 'Gia hạn gói dịch vụ');
  }
}
