import { Component, Input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-restricted',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './access-restricted.component.html'
})
export class AccessRestrictedComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  @Input() title: string = 'Truy cập bị hạn chế';
  @Input() description: string = 'Tài khoản nhân viên của bạn chưa được cấp quyền để truy cập module này. Vui lòng liên hệ với quản lý hoặc chủ cửa hàng để được hỗ trợ.';

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
