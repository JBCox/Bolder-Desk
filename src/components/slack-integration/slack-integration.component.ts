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
  slackAction = output<{ message: SlackMessage, action: 'createTicket' | 'addReply'}>();
  viewTicket = output<number>();

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  handleViewTicket(ticketId: number) {
      if (ticketId) {
          this.viewTicket.emit(ticketId);
      }
  }
}