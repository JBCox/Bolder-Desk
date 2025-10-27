import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SlackMessage, SlackSettings } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-slack-integration',
  standalone: true,
  templateUrl: './slack-integration.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlackIntegrationComponent {
  private app = inject(AppComponent);
  messages = this.app.slackMessages;
  settings = this.app.slackSettings;
  
  slackAction(data: { message: SlackMessage, action: 'createTicket' | 'addReply'}) {
    this.app.handleSlackAction(data);
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  handleViewTicket(ticketId: number) {
      if (ticketId) {
          this.app.selectTicket(ticketId);
      }
  }
}