import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

export interface MiniButtonOption {
  value: any;
  label: string;
}

export const DATE_FILTER_OPTIONS: MiniButtonOption[] = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'yesterday', label: 'Hôm qua' },
  { value: '7days', label: '7 ngày qua' },
  { value: 'thisMonth', label: 'Tháng này' },
  { value: 'lastMonth', label: 'Tháng trước' },
  { value: 'custom', label: 'Tự chọn' },
];

export const DASHBOARD_DATE_OPTIONS: MiniButtonOption[] = [
  { value: 'today', label: 'Hôm nay' },
  { value: '7days', label: '7 ngày qua' },
  { value: '30days', label: '30 ngày qua' },
  { value: 'thisMonth', label: 'Tháng này' },
  { value: 'custom', label: 'Tự chọn ngày' },
];

@Component({
  selector: 'app-mini-buttons',
  standalone: true,
  imports: [CommonModule, NgClass],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './mini-buttons.component.html',
})
export class MiniButtonsComponent {
  /** Danh sách các nút lựa chọn */
  @Input() options: MiniButtonOption[] = [];

  /** Giá trị đang được chọn (Active) */
  @Input() activeValue: any = null;

  /** Chế độ cuộn ngang (scrollable). Nếu true sẽ có scrollbar ngang không xuống dòng. */
  @Input() scrollable: boolean = false;

  /** Hiển thị chấm tròn nhỏ trước nhãn của nút (phù hợp cho phong cách menu/danh mục) */
  @Input() showDot: boolean = false;

  /** Các class tùy chỉnh cho thẻ bao ngoài (container) */
  @Input() containerClass: string = '';

  /** Các class tùy chỉnh cho nút bấm */
  @Input() buttonClass: string = '';

  /** Các class tùy chỉnh khi nút ở trạng thái Active */
  @Input() activeClass: string = '';

  /** Các class tùy chỉnh khi nút ở trạng thái Inactive */
  @Input() inactiveClass: string = '';

  /** Phát ra sự kiện khi một nút được bấm */
  @Output() valueChange = new EventEmitter<any>();

  public onSelect(value: any): void {
    this.valueChange.emit(value);
  }
}
