import { Component, Input, Output, EventEmitter, ElementRef, HostListener, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-select.component.html'
})
export class CustomSelectComponent {
  private readonly elementRef = inject(ElementRef);

  @Input() value: any = null;
  @Output() valueChange = new EventEmitter<any>();

  @Input() options: any[] = [];
  @Input() valueKey: string = '';
  @Input() labelKey: string = '';
  @Input() placeholder: string = 'Chọn...';
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() placement: 'bottom' | 'top' | 'auto' = 'auto';
  @Input() showSearch: boolean = false;
  @Input() containerClass: string = 'w-full';
  @Input() triggerClass: string = 'w-full form-input';

  public readonly isOpen = signal<boolean>(false);
  public readonly searchQuery = signal<string>('');
  public readonly dynamicPlacement = signal<'bottom' | 'top'>('bottom');

  // Lắng nghe sự kiện click ngoài vùng component để đóng menu dropdown
  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  // Tính toán hướng mở thông minh tránh bị che khuất
  private calculatePlacement(): void {
    if (this.placement !== 'auto') {
      this.dynamicPlacement.set(this.placement);
      return;
    }

    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // Chiều cao ước lượng tối đa của dropdown menu là 280px
    const dropdownHeight = 280;
    
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      this.dynamicPlacement.set('top');
    } else {
      this.dynamicPlacement.set('bottom');
    }
  }

  public toggleOpen(): void {
    if (this.disabled) return;
    this.isOpen.update(val => !val);
    if (this.isOpen()) {
      this.searchQuery.set('');
      this.calculatePlacement();
    }
  }

  public selectOption(option: any): void {
    const val = this.getOptionValue(option);
    this.value = val;
    this.valueChange.emit(val);
    this.isOpen.set(false);
  }

  // Lấy nhãn của tùy chọn hiện tại để hiển thị lên nút kích hoạt
  public get selectedLabel(): string {
    const selected = this.options.find(opt => {
      const optVal = this.getOptionValue(opt);
      // Chuyển cả hai về dạng string để so sánh nếu cần thiết
      return String(optVal) === String(this.value);
    });
    if (selected !== undefined) {
      return this.getOptionLabel(selected);
    }
    return '';
  }

  // Lấy giá trị thực của tùy chọn
  public getOptionValue(option: any): any {
    if (option && typeof option === 'object' && this.valueKey) {
      return option[this.valueKey];
    }
    return option;
  }

  // Lấy nhãn hiển thị của tùy chọn
  public getOptionLabel(option: any): string {
    if (option && typeof option === 'object' && this.labelKey) {
      return option[this.labelKey];
    }
    return option;
  }

  // So sánh hai giá trị (chuyển đổi về chuỗi để kiểm tra chính xác)
  public compareValues(val1: any, val2: any): boolean {
    if (val1 === null || val1 === undefined) return val2 === null || val2 === undefined;
    if (val2 === null || val2 === undefined) return false;
    return String(val1) === String(val2);
  }

  // Lọc danh sách tùy chọn dựa trên ô tìm kiếm
  public readonly filteredOptions = computed(() => {
    const opts = this.options || [];
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return opts;
    }
    return opts.filter(opt => {
      const label = String(this.getOptionLabel(opt)).toLowerCase();
      return label.includes(query);
    });
  });
}
