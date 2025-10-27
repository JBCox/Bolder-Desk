import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwitterThread } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-twitter-integration',
  standalone: true,
  templateUrl: './twitter-integration.component.html',
  imports: [CommonModule, IconComponent],
})
export class TwitterIntegrationComponent {
  private app = inject(AppComponent);
  threads = this.app.twitterThreads;

  selectedThread = signal<TwitterThread | null>(null);

  selectThread(thread: TwitterThread) {
    this.selectedThread.set(thread);
  }

  createTicket(thread: TwitterThread) {
    this.app.handleSocialToTicket({ source: 'twitter', thread });
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