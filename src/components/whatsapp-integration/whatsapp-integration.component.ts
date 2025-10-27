import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsAppThread } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-whatsapp-integration',
  standalone: true,
  templateUrl: './whatsapp-integration.component.html',
  imports: [CommonModule, IconComponent],
})
export class WhatsAppIntegrationComponent {
  private app = inject(AppComponent);
  threads = this.app.whatsAppThreads;

  selectedThread = signal<WhatsAppThread | null>(null);

  selectThread(thread: WhatsAppThread) {
    this.selectedThread.set(thread);
  }

  createTicket(thread: WhatsAppThread) {
    this.app.handleSocialToTicket({ source: 'whatsapp', thread });
  }

  viewTicket(ticketId: number) {
    this.app.selectTicket(ticketId);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);

    if (diffSeconds < 60) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  }
}