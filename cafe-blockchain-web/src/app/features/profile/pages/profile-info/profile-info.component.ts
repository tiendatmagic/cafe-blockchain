import { Component, inject, signal, OnInit, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '@core/services/state.service';
import { ApiService } from '@core/services/api.service';
import { CardComponent } from '@shared/components/card/card.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { Web3ConnectPromptComponent } from '@shared/components/web3-connect-prompt/web3-connect-prompt.component';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    Web3ConnectPromptComponent
  ],
  templateUrl: './profile-info.component.html'
})
export class ProfileInfoComponent implements OnInit {
  public readonly stateService = inject(StateService);
  private readonly apiService = inject(ApiService);

  public readonly name = signal<string>('');
  public readonly email = signal<string>('');
  public readonly phone = signal<string>('');

  public readonly nameError = signal<string>('');
  public readonly phoneError = signal<string>('');
  public readonly emailError = signal<string>('');
  public readonly isSaving = signal<boolean>(false);

  constructor() {
    // Tự động nạp dữ liệu khi signal của stateService có giá trị mới
    effect(() => {
      const nameVal = this.stateService.currentUserName();
      const emailVal = this.stateService.currentUserEmail();
      const phoneVal = this.stateService.currentUserPhone();
      
      untracked(() => {
        this.name.set(nameVal || '');
        this.email.set(emailVal || '');
        this.phone.set(phoneVal || '');
      });
    });
  }

  ngOnInit() {
    // Fallback load dữ liệu ban đầu
    this.name.set(this.stateService.currentUserName() || '');
    this.email.set(this.stateService.currentUserEmail() || '');
    this.phone.set(this.stateService.currentUserPhone() || '');
  }

  public onNameChange(value: string) {
    this.name.set(value);
    if (!value.trim()) {
      this.nameError.set('Họ và tên là bắt buộc.');
    } else {
      this.nameError.set('');
    }
  }

  public onEmailChange(value: string) {
    this.email.set(value);
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      this.emailError.set('Địa chỉ Email không đúng định dạng.');
    } else {
      this.emailError.set('');
    }
  }

  public onPhoneChange(value: string) {
    this.phone.set(value);
    if (value && !/^[0-9]+$/.test(value)) {
      this.phoneError.set('Số điện thoại chỉ được chứa chữ số (0-9).');
    } else {
      this.phoneError.set('');
    }
  }

  public get isValid(): boolean {
    return !!this.name().trim() && !this.nameError() && !this.phoneError() && !this.emailError();
  }

  public saveProfile() {
    if (!this.isValid) return;

    this.isSaving.set(true);
    const data = {
      name: this.name().trim(),
      email: this.email().trim() || undefined,
      phone: this.phone().trim() || undefined
    };

    this.apiService.updateProfile(data).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        this.stateService.showToast('Cập nhật thông tin cá nhân thành công!', 'success');
        // Đồng bộ dữ liệu
        this.stateService.syncSubscriptionFromBackend();
      },
      error: (err) => {
        this.isSaving.set(false);
        const errMsg = err?.error?.message || 'Cập nhật thông tin thất bại!';
        this.stateService.showToast(errMsg === 'Profile updated successfully.' ? 'Cập nhật thông tin thành công!' : errMsg, 'error');
      }
    });
  }
}
