import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SlackMessage, SlackSettings } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-slack-integration',
  templateUrl: './slack-integration.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
})
export class SlackIntegrationComponent {
  messages = input.required<SlackMessage[]>();
  settings = input.required<SlackSettings>();
  createTicket = output<string>();
  viewTicket = output<number>();

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  handleCreateTicket() {
    const subject = prompt('Enter the subject for the new ticket:');
    if (subject) {
      this.createTicket.emit(subject);
    }
  }

  handleViewTicket(link: string) {
      const ticketId = parseInt(link.split('/').pop() || '0', 10);
      if (ticketId) {
          this.viewTicket.emit(ticketId);
      }
  }
}