import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockEmail } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  imports: [CommonModule, IconComponent],
})
export class InboxComponent {
  emails = input.required<MockEmail[]>();
  convertToTicket = output<MockEmail>();

  selectedEmail = signal<MockEmail | null>(null);

  selectEmail(email: MockEmail) {
    this.selectedEmail.set(email);
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  }
}
