import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label
      class="flex items-start gap-3 cursor-pointer select-none"
      [class.opacity-50]="disabled"
      [class.pointer-events-none]="disabled"
    >
      <div
        class="relative mt-0.5 shrink-0 flex items-center justify-center h-4.5 w-4.5 rounded border transition-all duration-200"
        [ngClass]="
          checked()
            ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-sm shadow-[var(--color-primary)]/20'
            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
        "
      >
        @if (checked()) {
          <svg
            class="h-3 w-3 text-white stroke-[3px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        }
      </div>
      <input
        type="checkbox"
        [checked]="checked()"
        (change)="onToggle($event)"
        [disabled]="disabled"
        class="sr-only"
      />

      @if (label || description) {
        <div class="text-xs sm:text-sm">
          @if (label) {
            <p class="font-extrabold text-slate-800 dark:text-slate-250 leading-tight">
              {{ label }}
            </p>
          }
          @if (description) {
            <p class="text-2xs text-slate-400 mt-0.5 leading-normal">{{ description }}</p>
          }
        </div>
      } @else {
        <ng-content></ng-content>
      }
    </label>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomCheckboxComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class CustomCheckboxComponent implements ControlValueAccessor {
  public readonly checked = signal<boolean>(false);

  @Input() label: string = '';
  @Input() description: string = '';
  @Input() disabled: boolean = false;

  @Input('checked') set setChecked(value: boolean) {
    this.checked.set(!!value);
  }

  @Output() checkedChange = new EventEmitter<boolean>();

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  public onToggle(event: Event): void {
    if (this.disabled) return;
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checked.set(isChecked);
    this.checkedChange.emit(isChecked);
    this.onChange(isChecked);
    this.onTouched();
  }

  // ControlValueAccessor
  public writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
