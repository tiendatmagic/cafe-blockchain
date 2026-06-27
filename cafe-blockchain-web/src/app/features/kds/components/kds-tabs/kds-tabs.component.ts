import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
  HostListener,
  ViewChild,
  signal,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kds-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kds-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class KdsTabsComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() orders: any[] = [];
  @Input() activeFilter: 'all' | 'pending' | 'preparing' | 'ready' = 'all';
  @Output() filterChange = new EventEmitter<'all' | 'pending' | 'preparing' | 'ready'>();

  @ViewChild('containerEl') containerEl!: ElementRef<HTMLDivElement>;
  @ViewChildren('tabBtn') tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  private resizeObserver?: ResizeObserver;

  /** Trạng thái vị trí và kích thước của gạch chân */
  public readonly sliderStyle = signal<{ left: string; width: string }>({
    left: '0px',
    width: '0px',
  });

  public get activeIndex(): number {
    const statusMap = ['all', 'pending', 'preparing', 'ready'];
    return statusMap.indexOf(this.activeFilter);
  }

  ngAfterViewInit(): void {
    // Đợi render ban đầu hoàn tất để đo đạc kích thước chính xác
    setTimeout(() => this.updateSliderPosition(), 50);

    if (typeof ResizeObserver !== 'undefined' && this.containerEl) {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateSliderPosition();
      });
      this.resizeObserver.observe(this.containerEl.nativeElement);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeFilter'] || changes['orders']) {
      // Cập nhật vị trí slider khi đổi filter hoặc đổi danh sách đơn
      setTimeout(() => this.updateSliderPosition(), 0);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateSliderPosition();
  }

  public setFilter(status: 'all' | 'pending' | 'preparing' | 'ready') {
    if (status !== this.activeFilter) {
      this.filterChange.emit(status);
      this.activeFilter = status;
      this.updateSliderPosition();
    }
  }

  public getPendingCount(): number {
    return this.orders.filter(o => o.status === 'pending').length;
  }

  public getPreparingCount(): number {
    return this.orders.filter(o => o.status === 'preparing').length;
  }

  public getReadyCount(): number {
    return this.orders.filter(o => o.status === 'ready').length;
  }

  /**
   * Tính toán vị trí offsetLeft và chiều rộng offsetWidth của nút tab đang active
   * để gán kiểu dáng di chuyển động cho slider.
   */
  public updateSliderPosition(): void {
    if (!this.tabButtons || !this.containerEl) return;

    const buttons = this.tabButtons.toArray();
    const activeIdx = this.activeIndex;

    if (activeIdx !== -1 && buttons[activeIdx]) {
      const activeEl = buttons[activeIdx].nativeElement;
      const nextLeft = `${activeEl.offsetLeft}px`;
      const nextWidth = `${activeEl.offsetWidth}px`;

      const current = this.sliderStyle();
      if (current.left !== nextLeft || current.width !== nextWidth) {
        this.sliderStyle.set({
          left: nextLeft,
          width: nextWidth,
        });
      }

      // Tự động cuộn container để hiển thị tab active nếu bị che khuất
      const container = this.containerEl.nativeElement;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const buttonLeft = activeEl.offsetLeft;
      const buttonWidth = activeEl.offsetWidth;

      if (buttonLeft < scrollLeft) {
        container.scrollTo({ left: buttonLeft - 8, behavior: 'smooth' });
      } else if (buttonLeft + buttonWidth > scrollLeft + containerWidth) {
        container.scrollTo({
          left: buttonLeft + buttonWidth - containerWidth + 8,
          behavior: 'smooth',
        });
      }
    } else {
      const current = this.sliderStyle();
      if (current.left !== '0px' || current.width !== '0px') {
        this.sliderStyle.set({
          left: '0px',
          width: '0px',
        });
      }
    }
  }
}
