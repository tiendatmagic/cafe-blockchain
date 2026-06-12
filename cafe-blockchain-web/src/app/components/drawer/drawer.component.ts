import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drawer.component.html'
})
export class DrawerComponent {
  @Input() isOpen = false;
  @Input() title = '';

  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
