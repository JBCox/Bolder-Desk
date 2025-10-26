import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as models from '../../models';
import { IconComponent } from '../icon/icon.component';
import { SlaManagementModalComponent } from '../sla-management-modal/sla-management-modal.component';
import { AutomationModalComponent } from '../automation-modal/automation-modal.component';
import { FormBuilderComponent } from '../form-builder/form-builder.component';
import { RolesPermissionsComponent } from '../roles-permissions/roles-permissions.component';
import { SsoSettingsComponent } from '../sso-settings/sso-settings.component';

type SettingsTab = 'profile' | 'roles' | 'automations' | 'slas' | 'forms' | 'authentication';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, 
    FormsModule, 
    IconComponent, 
    SlaManagementModalComponent, 
    AutomationModalComponent, 
    FormBuilderComponent,
    RolesPermissionsComponent,
    SsoSettingsComponent
  ],
})
export class SettingsModalComponent {
  close = output<void>();
  saveRoles = output<models.Role[]>();
  saveSsoSettings = output<models.SsoSettings>();

  roles = input.required<models.Role[]>();
  allPermissions = input.required<models.Permission[]>();
  automationRules = input.required<models.AutomationRule[]>();
  groups = input.required<models.Group[]>();
  slaRules = input.required<models.SlaRules>();
  formTemplates = input.required<models.FormTemplate[]>();
  currentAgent = input.required<models.Agent>();
  ssoSettings = input.required<models.SsoSettings>();
  
  activeTab = signal<SettingsTab>('profile');

  getTabClass(tab: SettingsTab) {
    const base = 'flex items-center w-full text-left p-2 rounded-md text-sm';
    if (this.activeTab() === tab) {
      return base + ' bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300';
    }
    return base + ' hover:bg-slate-100 dark:hover:bg-slate-700';
  }

  noop() {
    // Placeholder for child component outputs that are not fully implemented
  }
}
