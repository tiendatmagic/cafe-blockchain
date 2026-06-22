import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '@core/services/state.service';

import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './maintenance.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class MaintenanceComponent {
  private readonly stateService = inject(StateService);

  public retryConnection() {
    this.stateService.isMaintenance.set(false);
    this.stateService.maintenanceType.set(null);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
}
