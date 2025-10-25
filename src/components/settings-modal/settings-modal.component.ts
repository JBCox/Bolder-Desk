import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Agent, Role, Group } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class SettingsModalComponent {
  agents = input.required<Agent[]>();
  roles = input.required<Role[]>();
  groups = input.required<Group[]>();
  close = output<void>();

  activeTab = signal<'agents' | 'roles' | 'groups'>('agents');

  getRoleName(roleId: number): string {
    return this.roles().find(r => r.id === roleId)?.name || 'N/A';
  }

  getGroupNames(groupIds: number[]): string {
    return groupIds.map(id => this.groups().find(g => g.id === id)?.name).filter(Boolean).join(', ');
  }

  getGroupMembers(groupId: number): string {
    return this.agents()
      .filter(a => a.groupIds.includes(groupId))
      .map(a => a.name)
      .join(', ');
  }
}