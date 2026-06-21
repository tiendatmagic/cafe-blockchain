import {
  Component,
  inject,
  signal,
  HostListener,
  ElementRef,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { ShiftService } from '@core/services/shift.service';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent, IconComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements AfterViewInit, OnDestroy {
  public readonly stateService = inject(StateService);
  public readonly shiftService = inject(ShiftService);
  private readonly elementRef = inject(ElementRef);
  private readonly router = inject(Router);

  @ViewChild('navEl') navEl!: ElementRef<HTMLElement>;

  public readonly sliderTop = signal<string>('0px');
  public readonly sliderHeight = signal<string>('0px');
  public readonly sliderOpacity = signal<number>(0);

  public readonly isChainDropdownOpen = signal<boolean>(false);
  public readonly isWalletDropdownOpen = signal<boolean>(false);
  private routerSub?: Subscription;

  // Thiết lập hiệu ứng trượt toàn cục từ StateService
  public readonly useSlidingEffect = this.stateService.useSlidingEffect;

  ngAfterViewInit() {
    setTimeout(() => this.updateSliderPosition(), 150);

    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => this.updateSliderPosition(), 100);
      });

    // Lắng nghe thay đổi hiệu ứng để vẽ lại slider
    effect(() => {
      this.useSlidingEffect();
      setTimeout(() => this.updateSliderPosition(), 50);
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  @HostListener('window:resize')
  public onWindowResize() {
    this.updateSliderPosition();
  }

  public updateSliderPosition() {
    if (!this.navEl) return;
    if (!this.useSlidingEffect()) {
      this.sliderOpacity.set(0);
      return;
    }
    const activeEl = this.navEl.nativeElement.querySelector('.sidebar-active-item') as HTMLElement;
    if (activeEl) {
      this.sliderTop.set(`${activeEl.offsetTop}px`);
      this.sliderHeight.set(`${activeEl.offsetHeight}px`);
      this.sliderOpacity.set(1);
    } else {
      this.sliderOpacity.set(0);
    }
  }


  public handleTabClick(featureKey: string, name: string, event: Event) {
    if (!this.stateService.hasFeature(featureKey)) {
      event.preventDefault();
      event.stopPropagation();
      this.stateService.isMobileMenuOpen.set(false);
      this.stateService.triggerUpgradeModal(featureKey, name);
    }
  }

  public handleMobileShiftClick() {
    if (this.shiftService.currentShift() && this.shiftService.currentShift().id) {
      this.shiftService.openCloseShiftModal();
    } else {
      this.shiftService.openStartShiftModal();
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
    if (
      !this.elementRef.nativeElement
        .querySelector('#wallet-dropdown-container')
        ?.contains(target)
    ) {
      this.isWalletDropdownOpen.set(false);
    }
  }

  public goToProfile() {
    this.isWalletDropdownOpen.set(false);
    this.isMobileMenuOpen.set(false);
    this.router.navigate(['/profile']);
  }

  public copyWalletAddress() {
    this.isWalletDropdownOpen.set(false);
    this.stateService.copyAddress();
  }

  public openWalletModal() {
    this.isWalletDropdownOpen.set(false);
    this.stateService.isWalletModalOpen.set(true);
  }

  public disconnectWallet() {
    this.isWalletDropdownOpen.set(false);
    this.stateService.disconnectWalletAndClose();
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
