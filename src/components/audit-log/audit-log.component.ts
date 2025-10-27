import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogEntry } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  template: `
    <div class="p-4">
      <h3 class="text-lg font-medium text-slate-800 dark:text-slate-100 mb-4">Audit Log</h3>
      <div class="max-h-[400px] overflow-y-auto pr-2">
        <ul class="space-y-4">
          @for (entry of log(); track entry.id) {
            <li class="flex items-start space-x-3">
              <div class="bg-slate-100 dark:bg-slate-700 rounded-full p-2 mt-0.5">
                <app-icon [name]="entry.icon" class="w-4 h-4 text-slate-500 dark:text-slate-400"></app-icon>
              </div>
              <div class="flex-1 text-sm">
                <p class="text-slate-800 dark:text-slate-200">
                  <span class="font-semibold">{{ entry.user }}</span> {{ entry.action }}
                </p>
                @if (entry.details) {
                  <p class="text-slate-600 dark:text-slate-400 mt-0.5" [title]="entry.details">
                    {{ entry.details }}
                  </p>
                }
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ formatDate(entry.timestamp) }}</p>
              </div>
            </li>
          } @empty {
            <p class="text-center text-slate-500 dark:text-slate-400 py-8">No audit log entries yet.</p>
          }
        </ul>
      </div>
    </div>
  `,
  imports: [CommonModule, IconComponent],
})
export class AuditLogComponent {
  log = input.required<AuditLogEntry[]>();

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}