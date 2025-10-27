import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockEmail } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-inbox',
  standalone: true,
  templateUrl: './inbox.component.html',
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxComponent {
  private app = inject(AppComponent);
  emails = this.app.emails;

  selectedEmail = signal<MockEmail | null>(null);

  selectEmail(email: MockEmail) {
    this.selectedEmail.set(email);
  }
  
  convertToTicket(email: MockEmail) {
    this.app.handleConvertToTicket(email);
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