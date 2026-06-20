import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './drawer.component.html',
})
export class DrawerComponent {
  @Input() isOpen = false;
  @Input() title = '';

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
