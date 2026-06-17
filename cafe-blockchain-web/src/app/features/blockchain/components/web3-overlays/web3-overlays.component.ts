import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { Web3Service } from '@core/services/web3.service';
import { IconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-web3-overlays',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './web3-overlays.component.html'
})
export class Web3OverlaysComponent {
  public readonly stateService = inject(StateService);
  public readonly web3Service = inject(Web3Service);
}
