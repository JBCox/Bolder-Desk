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

  editableRules = signal<SlaRules>({});

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
            newRules[priority] = {
                ...newRules[priority],
                [type]: value
            };
            return newRules;
        });
    }
  }
}