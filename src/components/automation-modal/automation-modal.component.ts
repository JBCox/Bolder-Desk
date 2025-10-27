import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutomationRule, Group, TicketView } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-automation-modal',
  standalone: true,
  templateUrl: './automation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, FormsModule],
})
export class AutomationModalComponent {
  initialRules = input.required<AutomationRule[]>({ alias: 'automationRules'});
  groups = input.required<Group[]>();
  ticketViews = input.required<TicketView[]>();
  close = output<void>();
  update = output<AutomationRule[]>();

  rules = signal<AutomationRule[]>([]);

  constructor() {
    effect(() => {
        this.rules.set(JSON.parse(JSON.stringify(this.initialRules())));
    });
  }

  getGroupName(groupId: number): string {
    return this.groups().find(g => g.id === groupId)?.name || 'Unknown Group';
  }
  
  getViewName(viewId: string): string {
    return this.ticketViews().find(v => v.id === viewId)?.name || 'Unknown View';
  }

  toggleRule(ruleId: number) {
    this.rules.update(rules => 
      rules.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r)
    );
  }

  handleSave() {
    this.update.emit(this.rules());
    this.close.emit();
  }
}