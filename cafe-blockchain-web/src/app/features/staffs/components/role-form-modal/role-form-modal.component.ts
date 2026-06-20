import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MODAL_DATA, ModalRef } from '@core/services/modal-ref';
import { ApiService } from '@core/services/api.service';
import { StateService } from '@core/services/state.service';
import { CustomCheckboxComponent } from '@shared/components/custom-checkbox/custom-checkbox.component';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-role-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomCheckboxComponent,
    ButtonComponent,
  ],
  templateUrl: './role-form-modal.component.html',
})
export class RoleFormModalComponent {
  private readonly apiService = inject(ApiService);
  public readonly stateService = inject(StateService);
  private readonly fb = inject(FormBuilder);

  public roleForm!: FormGroup;
  public readonly editingRole = signal<any | null>(null);
  public readonly isSavingRole = signal<boolean>(false);
  public readonly modules: any[] = [];

  constructor(
    @Inject(MODAL_DATA) public data: any,
    public modalRef: ModalRef<boolean>
  ) {
    if (data) {
      this.editingRole.set(data.editingRole || null);
      this.modules = data.modules || [];
    }
    this.initRoleForm();
  }

  private initRoleForm() {
    // Tạo group permissions động cho checkbox
    const permissionsGroup: any = {};
    const role = this.editingRole();
    const perms = role?.permissions || {};

    this.modules.forEach((mod) => {
      permissionsGroup[mod.key] = [!!perms[mod.key]];
    });

    this.roleForm = this.fb.group({
      name: [role?.name || '', [Validators.required, Validators.maxLength(255)]],
      permissions: this.fb.group(permissionsGroup),
    });
  }

  public saveRole() {
    if (this.isSavingRole()) return;

    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.isSavingRole.set(true);
    const data = this.roleForm.value;
    const roleId = this.editingRole()?.id;

    const request = roleId
      ? this.apiService.updateRole(roleId, data)
      : this.apiService.createRole(data);

    request.subscribe({
      next: (res) => {
        this.stateService.showToast(
          roleId ? 'Cập nhật vai trò thành công!' : 'Thêm vai trò mới thành công!',
          'success',
        );
        this.isSavingRole.set(false);
        this.modalRef.close(true);
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
        this.stateService.showToast(errorMsg, 'error');
        this.isSavingRole.set(false);
      },
    });
  }
}
