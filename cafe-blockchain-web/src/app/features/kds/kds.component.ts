import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { StateService } from '@core/services/state.service';
import { ToastService } from '@core/services/toast.service';
import { IconComponent } from '@shared/components/icon/icon.component';
import { BadgeComponent } from '@shared/components/badge/badge.component';

@Component({
  selector: 'app-kds',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, BadgeComponent],
  templateUrl: './kds.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class KdsComponent implements OnInit, OnDestroy {
  private readonly apiService = inject(ApiService);
  public readonly stateService = inject(StateService);
  private readonly toastService = inject(ToastService);

  public readonly orders = signal<any[]>([]);
  public readonly loading = signal<boolean>(true);
  public readonly filterStatus = signal<'all' | 'pending' | 'preparing' | 'ready'>('all');
  public readonly isUpdatingStatus = signal<string | null>(null);
  public readonly currentTime = signal<number>(Date.now());

  private pollingSubscription?: Subscription;
  private timerSubscription?: Subscription;

  // Lọc danh sách đơn hàng theo tab được chọn
  public readonly filteredOrders = computed(() => {
    const status = this.filterStatus();
    const list = this.orders();
    if (status === 'all') {
      return list;
    }
    return list.filter((o) => o.status === status);
  });

  // Đếm số lượng đơn đang chờ chế biến (pending + preparing)
  public readonly queueCount = computed(() => {
    return this.orders().filter((o) => o.status === 'pending' || o.status === 'preparing').length;
  });

  ngOnInit() {
    this.loadKdsOrders(true);

    // Polling lấy dữ liệu đơn hàng KDS mỗi 5 giây
    this.pollingSubscription = interval(5000)
      .pipe(
        switchMap(() => this.apiService.getOrders('kds', 'all', 1, 50))
      )
      .subscribe({
        next: (res) => {
          if (res && res.data) {
            this.checkNewOrders(res.data);
            this.orders.set(res.data);
          }
        },
        error: (err) => {
          console.error('KDS Polling Error:', err);
        }
      });

    // Cập nhật bộ đếm thời gian trôi qua mỗi phút
    this.timerSubscription = interval(60000).subscribe(() => {
      this.currentTime.set(Date.now());
    });
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  // Tải danh sách đơn hàng ban đầu
  public loadKdsOrders(isInitial = false) {
    if (isInitial) {
      this.loading.set(true);
    }
    this.apiService.getOrders('kds', 'all', 1, 50).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.orders.set(res.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load KDS orders:', err);
        this.loading.set(false);
        this.toastService.showToast('Không thể kết nối máy chủ để tải đơn hàng!', 'error');
      }
    });
  }

  // Thay đổi bộ lọc hiển thị
  public setFilter(status: 'all' | 'pending' | 'preparing' | 'ready') {
    this.filterStatus.set(status);
  }

  // Cập nhật trạng thái đơn hàng
  public updateStatus(orderId: number, nextStatus: string) {
    if (this.isUpdatingStatus()) return;
    this.isUpdatingStatus.set(orderId.toString());

    this.apiService.updateOrderStatus(orderId, nextStatus).subscribe({
      next: (res) => {
        this.isUpdatingStatus.set(null);
        let statusText = '';
        if (nextStatus === 'preparing') statusText = 'đang pha chế';
        if (nextStatus === 'ready') statusText = 'đã pha xong';
        if (nextStatus === 'completed') statusText = 'đã phục vụ hoàn tất';

        this.toastService.showToast(`Đơn hàng #${orderId} ${statusText}!`, 'success');

        // Cập nhật local state tức thời tránh đợi polling
        if (nextStatus === 'completed' || nextStatus === 'cancelled') {
          this.orders.set(this.orders().filter((o) => o.id !== orderId));
        } else {
          this.orders.set(
            this.orders().map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
          );
        }
      },
      error: (err) => {
        this.isUpdatingStatus.set(null);
        console.error('Failed to update status:', err);
        this.toastService.showToast(err?.error?.message || 'Không thể cập nhật trạng thái đơn hàng!', 'error');
      }
    });
  }

  // Tính số phút đã trôi qua kể từ khi đơn hàng được tạo
  public getMinutesElapsed(createdAt: string): number {
    this.currentTime(); // Đọc signal để tự động re-evaluate computed khi phút nhảy
    if (!createdAt) return 0;
    const createdTime = new Date(createdAt).getTime();
    const diffMs = Date.now() - createdTime;
    return Math.floor(diffMs / 60000);
  }

  // So sánh kiểm tra xem có đơn hàng mới (pending) xuất hiện hay không để phát chuông báo
  private checkNewOrders(newOrders: any[]) {
    if (this.orders().length === 0) return;

    const currentIds = new Set(this.orders().map((o) => o.id));
    const hasNew = newOrders.some((o) => !currentIds.has(o.id) && o.status === 'pending');

    if (hasNew) {
      this.playNewOrderSound();
      this.toastService.showToast('Có đơn hàng mới chờ pha chế!', 'success');
    }
  }

  // Phát âm thanh chuông báo bằng Web Audio API không cần file vật lý
  private playNewOrderSound() {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // Âm D5 trong trẻo
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

      oscillator.start();
      
      // Hiệu ứng ngân vang tắt dần sau 0.5s
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn('Web Audio API not allowed or supported:', e);
    }
  }
}
