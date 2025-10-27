import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiKey, Webhook, WebhookEvent } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-developer-settings',
  standalone: true,
  templateUrl: './developer-settings.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeveloperSettingsComponent {
  apiKeys = input.required<ApiKey[]>();
  webhooks = input.required<Webhook[]>();

  createApiKey = output<ApiKey>();
  revokeApiKey = output<string>();
  saveWebhooks = output<Webhook[]>();

  newApiKeyName = signal('');
  newlyGeneratedKey = signal<ApiKey | null>(null);

  editableWebhooks = signal<Webhook[]>([]);

  allWebhookEvents: WebhookEvent[] = ['ticket.created', 'ticket.updated', 'ticket.resolved', 'contact.created'];

  constructor() {
    // Deep copy for editing
    effect(() => {
        this.editableWebhooks.set(JSON.parse(JSON.stringify(this.webhooks())));
    });
  }

  handleCreateApiKey() {
    if (!this.newApiKeyName().trim()) return;

    const newKey: ApiKey = {
      id: `ak_${Date.now()}`,
      name: this.newApiKeyName(),
      key: `sk_live_${this.generateRandomString(24)}`,
      createdAt: new Date().toISOString(),
    };
    
    this.createApiKey.emit(newKey);
    this.newlyGeneratedKey.set(newKey);
    this.newApiKeyName.set('');
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  addWebhook() {
    this.editableWebhooks.update(hooks => [
      ...hooks,
      {
        id: `wh_${Date.now()}`,
        url: '',
        events: [],
        status: 'active',
        deliveries: []
      }
    ]);
  }

  removeWebhook(id: string) {
    this.editableWebhooks.update(hooks => hooks.filter(h => h.id !== id));
  }

  toggleWebhookEvent(webhook: Webhook, event: WebhookEvent) {
    const isEnabled = webhook.events.includes(event);
    if (isEnabled) {
      webhook.events = webhook.events.filter(e => e !== event);
    } else {
      webhook.events.push(event);
    }
  }

  handleSaveWebhooks() {
    this.saveWebhooks.emit(this.editableWebhooks());
    alert('Webhooks saved!');
  }
  
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  }
}
