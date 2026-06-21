import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '@core/services/state.service';
import { CardComponent } from '@shared/components/card/card.component';
import { CustomSwitchComponent } from '@shared/components/custom-switch/custom-switch.component';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CustomSwitchComponent,
    Web3ConnectPromptComponent
  ],
  templateUrl: './profile-settings.component.html'
})
export class ProfileSettingsComponent {
  public readonly stateService = inject(StateService);

  public onSlidingEffectChange(enabled: boolean) {
    this.stateService.setSlidingEffect(enabled);
    this.stateService.showToast(
      enabled
        ? 'Đã bật hiệu ứng trượt background menu!'
        : 'Đã tắt hiệu ứng trượt background menu!',
      'success'
    );
  }
}
