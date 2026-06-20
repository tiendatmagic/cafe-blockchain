import {
  Component,
  inject,
  signal,
  HostListener,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent, IconComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  public readonly stateService = inject(StateService);
  private readonly elementRef = inject(ElementRef);

  public readonly isChainDropdownOpen = signal<boolean>(false);

  public handleTabClick(featureKey: string, name: string, event: Event) {
    if (!this.stateService.hasFeature(featureKey)) {
      event.preventDefault();
      event.stopPropagation();
      this.stateService.isMobileMenuOpen.set(false);
      this.stateService.triggerUpgradeModal(featureKey, name);
    }
  }

  public handleMobileShiftClick() {
    if (this.stateService.currentShift() && this.stateService.currentShift().id) {
      this.stateService.openCloseShiftModal();
    } else {
      this.stateService.openStartShiftModal();
    }
  }

  public get isMobileMenuOpen() {
    return this.stateService.isMobileMenuOpen;
  }

  public get web3Service() {
    return this.stateService.web3Service;
  }

  public get isWalletModalOpen() {
    return this.stateService.isWalletModalOpen;
  }

  public connectWalletAndSign() {
    this.stateService.connectWalletAndSign();
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      !this.elementRef.nativeElement
        .querySelector('#mobile-chain-dropdown-container')
        ?.contains(target)
    ) {
      this.isChainDropdownOpen.set(false);
    }
  }

  // Chuyển đổi mạng (Chain) trên ví Web3 cho mobile/tablet
  public async switchChain(chainId: string) {
    this.isChainDropdownOpen.set(false);
    await this.stateService.switchChain(chainId);
  }

  // Lấy màu class cho chấm tròn chỉ báo của chain
  public getChainColorClass(chainId: string): string {
    switch (chainId) {
      case '1':
      case '11155111':
        return 'bg-blue-500';
      case '56':
      case '97':
        return 'bg-yellow-500';
      case '137':
        return 'bg-purple-500';
      case '42161':
      case '8453':
        return 'bg-sky-500';
      case '10':
      case '43114':
      case '421614':
        return 'bg-red-500';
      default:
        return 'bg-slate-400';
    }
  }
}
