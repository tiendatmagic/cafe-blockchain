import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  inject,
  signal,
  computed,
  OnDestroy,
  forwardRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './custom-select.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class CustomSelectComponent implements ControlValueAccessor, OnDestroy {
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
  public readonly dropdownStyle = signal<{ [key: string]: string }>({});

  private scrollListener: (() => void) | null = null;

  // Lắng nghe sự kiện click ngoài vùng component để đóng menu dropdown
  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.removeScrollListeners();
    }
  }

  // Tính toán hướng mở thông minh tránh bị che khuất và cập nhật vị trí fixed
  public updateDropdownPosition(): void {
    const trigger = this.elementRef.nativeElement.querySelector('button');
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Chiều cao ước lượng tối đa của dropdown menu là 280px
    const dropdownHeight = 280;

    let placement: 'top' | 'bottom' = 'bottom';
    if (this.placement === 'auto') {
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        placement = 'top';
      } else {
        placement = 'bottom';
      }
    } else {
      placement = this.placement as 'top' | 'bottom';
    }

    const viewportWidth = window.innerWidth;
    const dropdownMinWidth = Math.max(160, rect.width);
    let left = rect.left;

    // Neu dropdown bi tran mep phai man hinh, can lui left lai
    if (left + dropdownMinWidth > viewportWidth - 16) {
      left = Math.max(16, viewportWidth - dropdownMinWidth - 16);
    }

    const styles: { [key: string]: string } = {
      position: 'fixed',
      left: `${left}px`,
      minWidth: `${dropdownMinWidth}px`,
      width: 'max-content',
      maxWidth: '320px',
      zIndex: '9999',
    };

    if (placement === 'bottom') {
      styles['top'] = `${rect.bottom + 6}px`;
      styles['max-height'] = `${Math.min(dropdownHeight, spaceBelow - 16)}px`;
    } else {
      styles['bottom'] = `${viewportHeight - rect.top + 6}px`;
      styles['max-height'] = `${Math.min(dropdownHeight, spaceAbove - 16)}px`;
    }

    this.dropdownStyle.set(styles);
    this.dynamicPlacement.set(placement);
  }

  private addScrollListeners(): void {
    this.removeScrollListeners(); // Tránh trùng lặp listeners

    const updatePos = () => {
      if (this.isOpen()) {
        this.updateDropdownPosition();
      }
    };

    // Lắng nghe ở capture mode (tham số thứ 3 là true) để bắt sự kiện scroll của mọi container con (như modal body)
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos, true);

    this.scrollListener = updatePos;
  }

  private removeScrollListeners(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener, true);
      window.removeEventListener('resize', this.scrollListener, true);
      this.scrollListener = null;
    }
  }

  public toggleOpen(): void {
    if (this.disabled) return;
    const nextState = !this.isOpen();
    if (nextState) {
      this.searchQuery.set('');
      // Tính toán vị trí ngay lập tức trước khi dropdown hiển thị để tránh hiện tượng giật/lệch layout
      this.updateDropdownPosition();
      this.isOpen.set(nextState);
      this.addScrollListeners();
    } else {
      this.isOpen.set(nextState);
      this.removeScrollListeners();
    }
  }

  // ControlValueAccessor implementation
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public selectOption(option: any): void {
    const val = this.getOptionValue(option);
    this.value = val;
    this.valueChange.emit(val);
    this.onChange(val);
    this.onTouched();
    this.isOpen.set(false);
    this.removeScrollListeners();
  }

  // Lấy nhãn của tùy chọn hiện tại để hiển thị lên nút kích hoạt
  public get selectedLabel(): string {
    const selected = this.options.find((opt) => {
      const optVal = this.getOptionValue(opt);
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
    return opts.filter((opt) => {
      const label = String(this.getOptionLabel(opt)).toLowerCase();
      return label.includes(query);
    });
  });

  ngOnDestroy(): void {
    this.removeScrollListeners();
  }
}
