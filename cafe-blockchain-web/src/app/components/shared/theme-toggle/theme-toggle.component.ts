import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (size === 'md') {
      <div
        class="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 px-3 py-1.5 rounded-2xl h-[42px] shrink-0 select-none shadow-sm transition-colors duration-300"
        title="Đổi giao diện Sáng / Tối / Tự động"
      >
        <button
          (click)="toggleTheme()"
          class="relative inline-flex h-6.5 w-[4.75rem] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none"
          [class]="
            themeMode() === 'light'
              ? 'bg-slate-200/80 dark:bg-slate-700/80'
              : themeMode() === 'auto'
                ? 'bg-amber-400/70 dark:bg-amber-600/50'
                : 'bg-purple-650 dark:bg-purple-600'
          "
        >
          <span class="absolute inset-0 flex items-center justify-around px-1 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5 transition-opacity duration-200 stroke-slate-800 dark:stroke-white"
              [class]="themeMode() === 'light' ? 'opacity-0' : 'opacity-50'"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
            >
              <circle cx="12" cy="12" r="4" />
              <path
                stroke-linecap="round"
                d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5 transition-opacity duration-200 stroke-slate-800 dark:stroke-white"
              [class]="themeMode() === 'auto' ? 'opacity-0' : 'opacity-50'"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
            >
              <circle cx="12" cy="12" r="9" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5 transition-opacity duration-200 stroke-slate-800 dark:stroke-white"
              [class]="themeMode() === 'dark' ? 'opacity-0' : 'opacity-50'"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              />
            </svg>
          </span>
          <span
            class="pointer-events-none absolute top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md ring-0 transition-all duration-300 ease-in-out"
            [class]="
              themeMode() === 'light'
                ? 'left-0.5'
                : themeMode() === 'auto'
                  ? 'left-[1.5rem]'
                  : 'left-[2.85rem]'
            "
          >
            @if (themeMode() === 'light') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <circle cx="12" cy="12" r="4" />
                <path
                  stroke-linecap="round"
                  d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                />
              </svg>
            } @else if (themeMode() === 'auto') {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <circle cx="12" cy="12" r="9" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3" />
              </svg>
            } @else {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5 text-purple-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            }
          </span>
        </button>
      </div>
    } @else {
      <button
        (click)="toggleTheme()"
        class="relative inline-flex h-6 w-[4.5rem] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none shadow-sm"
        [class]="
          themeMode() === 'light'
            ? 'bg-slate-200 dark:bg-slate-700'
            : themeMode() === 'auto'
              ? 'bg-amber-400/70 dark:bg-amber-600/50'
              : 'bg-[var(--color-primary)]'
        "
      >
        <span class="absolute inset-0 flex items-center justify-around px-1 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3 transition-opacity duration-200 stroke-slate-800 dark:stroke-white"
            [class]="themeMode() === 'light' ? 'opacity-0' : 'opacity-50'"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
          >
            <circle cx="12" cy="12" r="4" />
            <path
              stroke-linecap="round"
              d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3 transition-opacity duration-200 stroke-slate-800 dark:stroke-white"
            [class]="themeMode() === 'auto' ? 'opacity-0' : 'opacity-50'"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
          >
            <circle cx="12" cy="12" r="9" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3" />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3 transition-opacity duration-200 stroke-slate-800 dark:stroke-white"
            [class]="themeMode() === 'dark' ? 'opacity-0' : 'opacity-50'"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            />
          </svg>
        </span>
        <span
          class="pointer-events-none absolute top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md ring-0 transition-all duration-300 ease-in-out"
          [class]="
            themeMode() === 'light'
              ? 'left-0.5'
              : themeMode() === 'auto'
                ? 'left-[1.375rem]'
                : 'left-[2.75rem]'
          "
        >
          @if (themeMode() === 'light') {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <circle cx="12" cy="12" r="4" />
              <path
                stroke-linecap="round"
                d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              />
            </svg>
          } @else if (themeMode() === 'auto') {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <circle cx="12" cy="12" r="9" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3" />
            </svg>
          } @else {
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3 text-purple-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          }
        </span>
      </button>
    }
  `
})
export class ThemeToggleComponent {
  private readonly stateService = inject(StateService);

  @Input() size: 'sm' | 'md' = 'md';

  public get themeMode() {
    return this.stateService.themeMode;
  }

  public toggleTheme() {
    this.stateService.toggleTheme();
  }
}
