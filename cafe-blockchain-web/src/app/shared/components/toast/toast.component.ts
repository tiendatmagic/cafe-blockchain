import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '@core/services/state.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './toast.component.html'
})
export class ToastComponent {
  public readonly stateService = inject(StateService);

  public get successMessage() {
    return this.stateService.successMessage;
  }

  public get errorMessage() {
    return this.stateService.errorMessage;
  }
}
