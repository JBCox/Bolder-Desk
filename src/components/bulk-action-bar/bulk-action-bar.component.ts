
import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agent } from '../../models';

@Component({
  selector: 'app-bulk-action-bar',
  templateUrl: './bulk-action-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class BulkActionBarComponent {
  selectedCount = input.required<number>();
  agents = input.required<Agent[]>();
  availableTags = input.required<string[]>();
  action = output<{ action: string; value: any }>();
  cancel = output<void>();

  showMenu = signal<string | null>(null);

  onAction(actionType: string, value: any) {
    this.action.emit({ action: actionType, value });
    this.showMenu.set(null);
  }
}
