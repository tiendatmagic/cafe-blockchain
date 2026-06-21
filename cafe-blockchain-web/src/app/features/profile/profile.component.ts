import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TabGroupComponent, TabOption } from '@shared/components/tab-group/tab-group.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { IconComponent } from '@shared/components/icon/icon.component';
import { StateService } from '@core/services/state.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TabGroupComponent,
    PageHeaderComponent,
    IconComponent
  ],
  template: `
    <div class="max-w-[1530px] mx-auto w-full p-4 sm:p-6 space-y-6">
      <app-page-header
        title="Hồ sơ cá nhân"
        description="Quản lý thông tin cá nhân và cấu hình ứng dụng của bạn"
      >
        <app-icon name="user" icon class="h-6.5 w-6.5 text-purple-600 dark:text-purple-400" />
      </app-page-header>

      <!-- Tab Group để chuyển đổi giữa Info và Settings -->
      <div class="flex justify-start">
        <app-tab-group
          [options]="profileTabOptions"
          [activeValue]="activeTab()"
          (valueChange)="onTabChange($event)"
          containerClass="bg-slate-200/40 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 h-10 w-full sm:w-auto"
        ></app-tab-group>
      </div>

      <!-- Khung hiển thị Route con -->
      <div class="relative min-h-[400px]">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private readonly router = inject(Router);
  public readonly stateService = inject(StateService);

  public readonly profileTabOptions: TabOption[] = [
    { value: 'info', label: 'Thông tin cá nhân' },
    { value: 'settings', label: 'Cấu hình' }
  ];

  public activeTab() {
    const url = this.router.url;
    if (url.includes('/profile/settings')) {
      return 'settings';
    }
    return 'info';
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Logic xử lý khi chuyển route con nếu cần
    });
  }

  public onTabChange(tabValue: any) {
    if (tabValue === 'settings') {
      this.router.navigate(['/profile/settings']);
    } else {
      this.router.navigate(['/profile/info']);
    }
  }
}
