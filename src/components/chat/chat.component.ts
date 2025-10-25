import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatSession, Agent } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
})
export class ChatComponent {
  chatSessions = input.required<ChatSession[]>();
  currentAgent = input.required<Agent | { name: string }>();
  acceptChat = output<string>();
  sendMessage = output<{ chatId: string; content: string }>();
  convertToTicket = output<ChatSession>();

  selectedChat = signal<ChatSession | null>(null);
  replyText = signal('');

  pendingChats = computed(() => this.chatSessions().filter(c => c.status === 'pending'));
  activeChats = computed(() => this.chatSessions().filter(c => c.status === 'active' && c.agentId === (this.currentAgent() as Agent).id));

  selectChat(chat: ChatSession) {
    this.selectedChat.set(chat);
  }

  handleSendMessage() {
    if (this.replyText().trim() && this.selectedChat()) {
      this.sendMessage.emit({ chatId: this.selectedChat()!.id, content: this.replyText() });
      this.replyText.set('');
    }
  }
  
  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
