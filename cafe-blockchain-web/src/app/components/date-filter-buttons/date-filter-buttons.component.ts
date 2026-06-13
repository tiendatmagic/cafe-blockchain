import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

export interface DatePresetOption {
  value: string;
  label: string;
}

export const DEFAULT_DATE_PRESETS: DatePresetOption[] = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'yesterday', label: 'Hôm qua' },
  { value: '7days', label: '7 ngày qua' },
  { value: 'thisMonth', label: 'Tháng này' },
  { value: 'lastMonth', label: 'Tháng trước' },
  { value: 'custom', label: 'Tự chọn' },
];

export const DASHBOARD_DATE_PRESETS: DatePresetOption[] = [
  { value: 'today', label: 'Hôm nay' },
  { value: '7days', label: '7 ngày qua' },
  { value: '30days', label: '30 ngày qua' },
  { value: 'thisMonth', label: 'Tháng này' },
  { value: 'custom', label: 'Tự chọn ngày' },
];

@Component({
  selector: 'app-date-filter-buttons',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './date-filter-buttons.component.html'
})
export class DateFilterButtonsComponent {
  /** Danh sách preset tùy chỉnh. Mặc định là DEFAULT_DATE_PRESETS */
  @Input() presets: DatePresetOption[] = DEFAULT_DATE_PRESETS;

  /** Giá trị preset đang được chọn */
  @Input() activePreset: string = '';

  /** Emit giá trị khi người dùng chọn một preset */
  @Output() presetChange = new EventEmitter<string>();

  public onSelect(value: string): void {
    this.presetChange.emit(value);
  }
}
