import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html'
})
export class SkeletonLoaderComponent {
  @Input() type: 'dashboard' | 'reports' | 'table' | 'card-grid' | 'form' | 'pos' | 'menu' | 'orders' | 'financials' | 'customers' | 'debts' | 'inventory' | 'tables' | 'staffs' | 'shifts' | 'settings' = 'table';
  @Input() rows = 5;
  @Input() cols = 5;
  @Input() cards = 8;

  // Trả về mảng số lượng phần tử để lặp bằng @for
  getArray(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
}
