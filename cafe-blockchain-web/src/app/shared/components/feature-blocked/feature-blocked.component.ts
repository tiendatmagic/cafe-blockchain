import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '@core/services/state.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-feature-blocked',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './feature-blocked.component.html'
})
export class FeatureBlockedComponent {
  public readonly stateService = inject(StateService);

  @Input() featureKey: string = '';
  @Input() featureName: string = '';

  get currentPlanName(): string {
    const code = this.stateService.subscriptionPlanCode() || 'free';
    if (code === 'free') return 'Free';
    if (code === 'pro') return 'Pro';
    if (code === 'ultra') return 'Ultra';
    return code.toUpperCase();
  }

  upgradeNow(): void {
    if (this.featureKey && this.featureName) {
      this.stateService.triggerUpgradeModalDirectly(this.featureKey, this.featureName);
    }
  }
}
