import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-split-ticket-modal',
  standalone: true,
  templateUrl: './split-ticket-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class SplitTicketModalComponent {
  messageToSplit = input.required<Message>();
  close = output<void>();
  split = output<string>();

  newSubject = signal('');

  handleSplit() {
    if (this.newSubject().trim()) {
      this.split.emit(this.newSubject());
    }
  }
}