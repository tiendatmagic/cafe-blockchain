import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '@core/services/state.service';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maintenance.component.html',
  styles: [`
    :host { display: block; }
  `]
})
export class MaintenanceComponent {
  private readonly stateService = inject(StateService);

  public retryConnection() {
    this.stateService.isMaintenance.set(false);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
}
