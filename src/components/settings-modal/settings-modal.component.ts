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
import { AuditLogComponent } from '../audit-log/audit-log.component';
import { DeveloperSettingsComponent } from '../developer-settings/developer-settings.component';

type SettingsTab = 'profile' | 'roles' | 'automations' | 'slas' | 'forms' | 'authentication' | 'audit' | 'developer';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
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
    SsoSettingsComponent,
    AuditLogComponent,
    DeveloperSettingsComponent,
  ],
})
export class SettingsModalComponent {
  close = output<void>();
  saveRoles = output<models.Role[]>();
  saveSsoSettings = output<models.SsoSettings>();
  saveAutomationRules = output<models.AutomationRule[]>();
  saveSlaRules = output<models.SlaRules>();
  saveFormTemplates = output<models.FormTemplate[]>();
  createApiKey = output<models.ApiKey>();
  revokeApiKey = output<string>();
  saveWebhooks = output<models.Webhook[]>();

  roles = input.required<models.Role[]>();
  allPermissions = input.required<models.Permission[]>();
  automationRules = input.required<models.AutomationRule[]>();
  groups = input.required<models.Group[]>();
  slaRules = input.required<models.SlaRules>();
  formTemplates = input.required<models.FormTemplate[]>();
  currentAgent = input.required<models.Agent>();
  ssoSettings = input.required<models.SsoSettings>();
  auditLog = input.required<models.AuditLogEntry[]>();
  apiKeys = input.required<models.ApiKey[]>();
  webhooks = input.required<models.Webhook[]>();
  ticketViews = input.required<models.TicketView[]>();
  
  activeTab = signal<SettingsTab>('profile');

  getTabClass(tab: SettingsTab) {
    const base = 'flex items-center w-full text-left p-2 rounded-md text-sm';
    if (this.activeTab() === tab) {
      return base + ' bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300';
    }
    return base + ' text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700';
  }
}