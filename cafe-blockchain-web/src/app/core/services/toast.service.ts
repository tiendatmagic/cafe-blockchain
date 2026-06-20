import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  msg: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public readonly successMessage = signal<ToastMessage | null>(null);
  public readonly errorMessage = signal<ToastMessage | null>(null);

  private _successTimer: ReturnType<typeof setTimeout> | null = null;
  private _errorTimer: ReturnType<typeof setTimeout> | null = null;

  public showToast(msg: string, type: 'success' | 'error' = 'success') {
    if (type === 'success') {
      // Clear timer cũ nếu có (tránh tắt toast mới sớm)
      if (this._successTimer) clearTimeout(this._successTimer);
      // Reset về null trước để force Angular unmount DOM → restart animation
      this.successMessage.set(null);
      setTimeout(() => {
        this.successMessage.set({ msg, id: Date.now() });
        this._successTimer = setTimeout(() => this.successMessage.set(null), 3000);
      }, 0);
    } else {
      if (this._errorTimer) clearTimeout(this._errorTimer);
      this.errorMessage.set(null);
      setTimeout(() => {
        this.errorMessage.set({ msg, id: Date.now() });
        this._errorTimer = setTimeout(() => this.errorMessage.set(null), 4000);
      }, 0);
    }
  }
}
