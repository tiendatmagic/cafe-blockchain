import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ElementRef, HostListener, inject, signal, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-date-picker.component.html'
})
export class CustomDatePickerComponent implements OnInit, OnChanges, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  @Input() selectedDate: string = ''; // Format: YYYY-MM-DD
  @Output() selectedDateChange = new EventEmitter<string>();
  
  @Input() label: string = '';
  @Input() placeholder: string = 'Chọn ngày';
  @Input() minDate: string = '';
  @Input() maxDate: string = '';
  @Input() disabled: boolean = false;

  public readonly isOpen = signal<boolean>(false);
  public readonly currentYear = signal<number>(new Date().getFullYear());
  public readonly currentMonth = signal<number>(new Date().getMonth()); // 0-11
  public readonly daysArray = signal<any[]>([]);
  public readonly dropdownStyle = signal<{[key: string]: string}>({});

  public readonly daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  private scrollListener: (() => void) | null = null;

  // Nhãn hiển thị tháng năm tiếng Việt
  public get monthLabel(): string {
    const m = this.currentMonth() + 1;
    return `Tháng ${m < 10 ? '0' + m : m}, ${this.currentYear()}`;
  }

  // Định dạng ngày hiển thị DD/MM/YYYY dưới dạng hàm thông thường để luôn cập nhật chính xác
  public displayValue(): string {
    const val = this.selectedDate;
    if (!val) return '';
    const parts = val.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return val;
  }

  public ngOnInit(): void {
    this.initCalendarFromValue();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate']) {
      this.initCalendarFromValue();
    }
  }

  // Khởi tạo lịch từ giá trị ngày đang chọn
  private initCalendarFromValue(): void {
    if (this.selectedDate) {
      const parts = this.selectedDate.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1; // 0-11
        if (!isNaN(y) && !isNaN(m) && m >= 0 && m <= 11) {
          this.currentYear.set(y);
          this.currentMonth.set(m);
        }
      }
    }
    this.generateCalendar();
  }

  // Hàm tạo lưới lịch 42 ô
  public generateCalendar(): void {
    const year = this.currentYear();
    const month = this.currentMonth();

    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    // Tính số ngày trống của tháng trước cần điền (tuần bắt đầu từ Thứ Hai)
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const totalDays = new Date(year, month + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const days: any[] = [];

    // 1. Điền các ngày của tháng trước (mờ)
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const d = totalDaysInPrevMonth - i;
      const dateStr = this.formatDateStr(year, month - 1, d);
      days.push({
        day: d,
        dateStr,
        isCurrentMonth: false,
        isToday: this.checkIsToday(year, month - 1, d),
        disabled: this.checkIsDisabled(dateStr)
      });
    }

    // 2. Điền các ngày của tháng hiện tại (rõ)
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = this.formatDateStr(year, month, i);
      days.push({
        day: i,
        dateStr,
        isCurrentMonth: true,
        isToday: this.checkIsToday(year, month, i),
        disabled: this.checkIsDisabled(dateStr)
      });
    }

    // 3. Điền nốt các ngày của tháng sau (mờ) cho đủ 42 ô (6 hàng x 7 cột)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const dateStr = this.formatDateStr(year, month + 1, i);
      days.push({
        day: i,
        dateStr,
        isCurrentMonth: false,
        isToday: this.checkIsToday(year, month + 1, i),
        disabled: this.checkIsDisabled(dateStr)
      });
    }

    this.daysArray.set(days);
  }

  // Định dạng ngày thành chuỗi YYYY-MM-DD
  private formatDateStr(year: number, month: number, day: number): string {
    const d = new Date(year, month, day);
    const yStr = d.getFullYear();
    const m = d.getMonth() + 1;
    const mStr = m < 10 ? '0' + m : m;
    const dVal = d.getDate();
    const dStr = dVal < 10 ? '0' + dVal : dVal;
    return `${yStr}-${mStr}-${dStr}`;
  }

  private checkIsToday(year: number, month: number, day: number): boolean {
    const today = new Date();
    const target = new Date(year, month, day);
    return today.getDate() === target.getDate() &&
           today.getMonth() === target.getMonth() &&
           today.getFullYear() === target.getFullYear();
  }

  private checkIsDisabled(dateStr: string): boolean {
    if (this.minDate && dateStr < this.minDate) return true;
    if (this.maxDate && dateStr > this.maxDate) return true;
    return false;
  }

  // Chuyển sang tháng trước
  public prevMonth(event: MouseEvent): void {
    event.stopPropagation();
    let m = this.currentMonth() - 1;
    if (m < 0) {
      m = 11;
      this.currentYear.update(y => y - 1);
    }
    this.currentMonth.set(m);
    this.generateCalendar();
  }

  // Chuyển sang tháng sau
  public nextMonth(event: MouseEvent): void {
    event.stopPropagation();
    let m = this.currentMonth() + 1;
    if (m > 11) {
      m = 0;
      this.currentYear.update(y => y + 1);
    }
    this.currentMonth.set(m);
    this.generateCalendar();
  }

  // Cập nhật vị trí fixed của popup lịch
  public updateDropdownPosition(): void {
    const trigger = this.elementRef.nativeElement.querySelector('.cursor-pointer');
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // Chiều cao popup lịch là khoảng 310px
    const popupHeight = 310;
    
    let placement: 'top' | 'bottom' = 'bottom';
    if (spaceBelow < popupHeight && spaceAbove > spaceBelow) {
      placement = 'top';
    } else {
      placement = 'bottom';
    }

    const styles: {[key: string]: string} = {
      position: 'fixed',
      left: `${rect.left}px`,
      width: '288px', // w-72
      zIndex: '9999',
    };

    if (placement === 'bottom') {
      styles['top'] = `${rect.bottom + 6}px`;
    } else {
      styles['bottom'] = `${viewportHeight - rect.top + 6}px`;
    }

    this.dropdownStyle.set(styles);
  }

  private addScrollListeners(): void {
    this.removeScrollListeners();

    const updatePos = () => {
      if (this.isOpen()) {
        this.updateDropdownPosition();
      }
    };

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

  // Chọn ngày
  public selectDate(dateStr: string, isDisabled: boolean, event: MouseEvent): void {
    event.stopPropagation();
    if (isDisabled || this.disabled) return;
    this.selectedDate = dateStr;
    this.selectedDateChange.emit(dateStr);
    this.generateCalendar();
    this.isOpen.set(false);
    this.removeScrollListeners();
    this.cdr.detectChanges(); // Ép chạy change detection ngay lập tức
  }

  // Toggle lịch
  public toggleOpen(event: MouseEvent): void {
    event.stopPropagation();
    if (this.disabled) return;
    this.isOpen.update(val => !val);
    if (this.isOpen()) {
      setTimeout(() => {
        this.updateDropdownPosition();
        this.addScrollListeners();
      }, 0);
    } else {
      this.removeScrollListeners();
    }
  }

  // Lắng nghe sự kiện click ra ngoài để đóng lịch
  @HostListener('document:click', ['$event'])
  public onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.removeScrollListeners();
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.removeScrollListeners();
  }
}
