import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  public readonly stateService = inject(StateService);

  public get dashboardData() {
    return this.stateService.dashboardData;
  }

  public get isDashboardLoading() {
    return this.stateService.isDashboardLoading;
  }

  public get nativeTokenPriceVND() {
    return this.stateService.nativeTokenPriceVND;
  }

  public get web3Service() {
    return this.stateService.web3Service;
  }

  public get settings() {
    return this.stateService.settings;
  }

  public loadAllData() {
    this.stateService.loadAllData();
  }

  public getTxExplorerLink(txHash: string | null | undefined, chainId: string | number | null | undefined): string {
    return this.web3Service.getTxExplorerLink(txHash, chainId);
  }

  public mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}
