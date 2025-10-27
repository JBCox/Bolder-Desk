import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-keyboard-shortcuts-modal',
  standalone: true,
  templateUrl: './keyboard-shortcuts-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class KeyboardShortcutsModalComponent {
  close = output<void>();
}