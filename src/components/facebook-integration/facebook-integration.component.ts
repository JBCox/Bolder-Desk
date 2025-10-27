import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacebookThread } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-facebook-integration',
  standalone: true,
  templateUrl: './facebook-integration.component.html',
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacebookIntegrationComponent {
  private app = inject(AppComponent);
  threads = this.app.facebookThreads;

  selectedThread = signal<FacebookThread | null>(null);

  selectThread(thread: FacebookThread) {
    this.selectedThread.set(thread);
  }

  createTicket(thread: FacebookThread) {
    this.app.handleSocialToTicket({ source: 'facebook', thread });
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