import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '@core/services/state.service';
import { ToastService } from '@core/services/toast.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  public readonly stateService = inject(StateService);
  public readonly toastService = inject(ToastService);

  public get successMessage() {
    return this.toastService.successMessage;
  }

  public get errorMessage() {
    return this.toastService.errorMessage;
  }
}
