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

  public getConicGradient(): string {
    const data = this.dashboardData();
    if (!data || !data.payment_methods_chart) {
      return 'conic-gradient(#e2e8f0 0% 100%)';
    }

    const chart = data.payment_methods_chart;
    const totalAmount = chart.reduce((sum: number, item: any) => sum + item.amount, 0);

    if (totalAmount === 0) {
      return 'conic-gradient(#e2e8f0 0% 100%)';
    }

    const cashAmount = chart.find((c: any) => c.method === 'cash')?.amount || 0;
    const bankAmount = chart.find((c: any) => c.method === 'bank_transfer')?.amount || 0;
    const cryptoAmount = chart.find((c: any) => c.method === 'crypto')?.amount || 0;
    const eWalletAmount = chart.find((c: any) => c.method === 'e_wallet')?.amount || 0;

    const cashPct = (cashAmount / totalAmount) * 100;
    const bankPct = (bankAmount / totalAmount) * 100;
    const cryptoPct = (cryptoAmount / totalAmount) * 100;
    const eWalletPct = (eWalletAmount / totalAmount) * 100;

    // Màu sắc: Crypto (#7c3aed), Bank Transfer (#10b981), E-wallet (#ec4899), Cash (#f59e0b)
    const endCrypto = cryptoPct;
    const endBank = cryptoPct + bankPct;
    const endEWallet = cryptoPct + bankPct + eWalletPct;

    return `conic-gradient(#7c3aed 0% ${endCrypto}%, #10b981 ${endCrypto}% ${endBank}%, #ec4899 ${endBank}% ${endEWallet}%, #f59e0b ${endEWallet}% 100%)`;
  }

  public getPaymentMethodPercentage(method: string): number {
    const data = this.dashboardData();
    if (!data || !data.payment_methods_chart) return 0;
    const chart = data.payment_methods_chart;
    const totalAmount = chart.reduce((sum: number, item: any) => sum + item.amount, 0);
    if (totalAmount === 0) return 0;
    const amount = chart.find((c: any) => c.method === method)?.amount || 0;
    return Math.round((amount / totalAmount) * 100);
  }

  public getPaymentMethodAmount(method: string): number {
    const data = this.dashboardData();
    if (!data || !data.payment_methods_chart) return 0;
    const chart = data.payment_methods_chart;
    return chart.find((c: any) => c.method === method)?.amount || 0;
  }

  public getPaymentMethodCount(method: string): number {
    const data = this.dashboardData();
    if (!data || !data.payment_methods_chart) return 0;
    const chart = data.payment_methods_chart;
    return chart.find((c: any) => c.method === method)?.count || 0;
  }

  public getTotalRevenue(): number {
    const data = this.dashboardData();
    if (!data || !data.payment_methods_chart) return 0;
    return data.payment_methods_chart.reduce((sum: number, item: any) => sum + item.amount, 0);
  }

  public getTotalPaymentOrders(): number {
    const data = this.dashboardData();
    if (!data || !data.payment_methods_chart) return 0;
    return data.payment_methods_chart.reduce((sum: number, item: any) => sum + item.count, 0);
  }
}
