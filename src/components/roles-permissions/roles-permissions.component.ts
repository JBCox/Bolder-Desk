import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Role, Permission } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesPermissionsComponent {
  initialRoles = input.required<Role[]>({ alias: 'roles' });
  allPermissions = input.required<Permission[]>();
  save = output<Role[]>();
  
  editableRoles = signal<Role[]>([]);
  selectedRole = signal<Role | null>(null);

  constructor() {
    effect(() => {
      // Deep copy for editing
      const roles = this.initialRoles();
      this.editableRoles.set(JSON.parse(JSON.stringify(roles)));
      if (roles.length > 0) {
        this.selectedRole.set(this.editableRoles()[0]);
      }
    });
  }

  selectRole(role: Role) {
    this.selectedRole.set(role);
  }

  hasPermission(role: Role, permission: Permission): boolean {
    return role.permissions.includes(permission);
  }

  togglePermission(role: Role, permission: Permission) {
    this.editableRoles.update(roles => 
      roles.map(r => {
        if (r.id === role.id) {
          const newPermissions = r.permissions.includes(permission)
            ? r.permissions.filter(p => p !== permission)
            : [...r.permissions, permission];
          return { ...r, permissions: newPermissions };
        }
        return r;
      })
    );
    // update selected role as well to reflect changes immediately in the UI
     this.selectedRole.update(r => {
        if (!r || r.id !== role.id) return r;
         const newPermissions = r.permissions.includes(permission)
            ? r.permissions.filter(p => p !== permission)
            : [...r.permissions, permission];
        return { ...r, permissions: newPermissions };
     });
  }
  
  formatPermission(permission: string): string {
    return permission.replace(/[:_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  handleSave() {
    this.save.emit(this.editableRoles());
  }
}