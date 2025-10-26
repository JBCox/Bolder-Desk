import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SlaRules } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-sla-management-modal',
  templateUrl: './sla-management-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class SlaManagementModalComponent {
  initialSlaRules = input.required<SlaRules>({ alias: 'slaRules' });
  close = output<void>();
  update = output<SlaRules>();

  // Fix: Initialize with a default object that matches the SlaRules type.
  editableRules = signal<SlaRules>({
    urgent: { responseTime: 0, resolutionTime: 0 },
    high: { responseTime: 0, resolutionTime: 0 },
    medium: { responseTime: 0, resolutionTime: 0 },
    low: { responseTime: 0, resolutionTime: 0 },
  });

  constructor() {
    effect(() => {
      // Deep copy to prevent mutating the original signal
      this.editableRules.set(JSON.parse(JSON.stringify(this.initialSlaRules())));
    });
  }

  handleSave() {
    this.update.emit(this.editableRules());
  }

  updateRule(priority: string, type: 'responseTime' | 'resolutionTime', event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(value)) {
        this.editableRules.update(rules => {
            const newRules = {...rules};
            newRules[priority as keyof SlaRules] = {
                ...newRules[priority as keyof SlaRules],
                [type]: value
            };
            return newRules;
        });
    }
  }
}
