import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '@core/services/state.service';
import { Web3Service } from '@core/services/web3.service';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { CardComponent } from '@shared/components/card/card.component';

@Component({
  selector: 'app-desktop-header',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent, CardComponent],
  templateUrl: './desktop-header.component.html'
})
export class DesktopHeaderComponent {
  public readonly stateService = inject(StateService);
  public readonly web3Service = inject(Web3Service);
  private readonly elementRef = inject(ElementRef);

  public readonly isPriceDropdownOpen = signal<boolean>(false);
  public readonly isChainDropdownOpen = signal<boolean>(false);
  public readonly isShiftDropdownOpen = signal<boolean>(false);

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.querySelector('#price-dropdown-container')?.contains(target)) {
      this.isPriceDropdownOpen.set(false);
    }
    if (!this.elementRef.nativeElement.querySelector('#chain-dropdown-container')?.contains(target)) {
      this.isChainDropdownOpen.set(false);
    }
    if (!this.elementRef.nativeElement.querySelector('#shift-dropdown-container')?.contains(target)) {
      this.isShiftDropdownOpen.set(false);
    }
  }

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

  public formatShiftTime(isoStr: string): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }

  public openStartShiftModal() {
    this.isShiftDropdownOpen.set(false);
    this.stateService.openStartShiftModal();
  }

  public openCloseShiftModal() {
    this.isShiftDropdownOpen.set(false);
    this.stateService.openCloseShiftModal();
  }
}
