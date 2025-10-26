// Fix: Implement SettingsModalComponent to replace placeholder content.
import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-settings-modal',
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="text-2xl font-bold">Settings</h2>
          <button (click)="close.emit()" class="text-gray-500 hover:text-gray-800">
            <app-icon name="x"></app-icon>
          </button>
        </div>
        <div class="p-6">
          <p>Settings placeholder. Real settings would go here.</p>
        </div>
        <div class="p-6 bg-gray-50 text-right">
          <button type="button" (click)="close.emit()" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class SettingsModalComponent {
  close = output<void>();
}
