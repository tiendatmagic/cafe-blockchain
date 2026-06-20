import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { StateService } from '@core/services/state.service';
import { Web3Service } from '@core/services/web3.service';
import { SidebarComponent } from '@shared/layout/sidebar/sidebar.component';
import { MaintenanceComponent } from '@shared/components/maintenance/maintenance.component';
import { DesktopHeaderComponent } from '@shared/layout/header/desktop-header.component';
import { Web3OverlaysComponent } from '@features/blockchain/components/web3-overlays/web3-overlays.component';
import { ShiftModalsComponent } from '@features/shifts/components/shift-modals/shift-modals.component';
import { Web3PublicHeaderComponent } from '@features/marketplace/components/web3-public-header/web3-public-header.component';
import { SubscriptionBlockedComponent } from './shared/components/subscription-blocked/subscription-blocked.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { FeatureBlockedComponent } from '@shared/components/feature-blocked/feature-blocked.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    MaintenanceComponent,
    DesktopHeaderComponent,
    Web3OverlaysComponent,
    ShiftModalsComponent,
    Web3PublicHeaderComponent,
    SubscriptionBlockedComponent,
    ToastComponent,
    FeatureBlockedComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  public readonly stateService = inject(StateService);
  public readonly web3Service = inject(Web3Service);
  private readonly router = inject(Router);

  public readonly currentUrl = signal<string>('');

  public get isCustomerWeb3Route(): boolean {
    const isBrowser = typeof window !== 'undefined';
    const path = isBrowser ? window.location.pathname : '';
    const routerUrl = this.router.url;
    const url = routerUrl || path;

    return url.includes('/claim-points') || url.includes('/marketplace');
  }

  public get isPublicLayout(): boolean {
    return this.stateService.isPublicLayout();
  }

  public get containerClass(): string {
    if (this.isPublicLayout) {
      const isBrowser = typeof window !== 'undefined';
      const path = isBrowser ? window.location.pathname : '';
      const routerUrl = this.router.url;
      const url = routerUrl || path;

      if (url.includes('/store/') || url.includes('/blockchain-explorer') || url.includes('/mobile-sign')) {
        return 'h-screen bg-slate-900 overflow-y-auto';
      }
      return 'h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans antialiased overflow-y-auto';
    }
    return 'flex flex-col lg:flex-row h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans antialiased overflow-hidden';
  }

  public get successMessage() { return this.stateService.successMessage; }
  public get errorMessage() { return this.stateService.errorMessage; }

  public get isWrongChain() {
    return this.web3Service.isWrongChain();
  }

  public readonly isExplorerRoute = computed(() => {
    const url = this.currentUrl();
    const isBrowser = typeof window !== 'undefined';
    const path = isBrowser ? window.location.pathname : '';
    return path.includes('/blockchain-explorer') || url.includes('/blockchain-explorer');
  });

  public readonly isMaintenanceMode = computed(() => {
    return this.stateService.isMaintenance() && !this.isExplorerRoute();
  });

  public readonly isSubscriptionBlocked = computed(() => {
    return this.stateService.isSubscriptionBlocked();
  });

  private routerSub?: any;

  ngOnInit() {
    this.currentUrl.set(this.router.url);
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects || event.url);
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
