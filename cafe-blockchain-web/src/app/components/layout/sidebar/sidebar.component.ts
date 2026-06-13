import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StateService } from '../../../services/state.service';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  public readonly stateService = inject(StateService);

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
}
