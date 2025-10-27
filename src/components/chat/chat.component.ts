import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatSession, Agent } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
})
export class ChatComponent {
  private app = inject(AppComponent);
  chatSessions = this.app.chatSessions;
  currentAgent = this.app.currentAgent;

  selectedChat = signal<ChatSession | null>(null);
  replyText = signal('');

  pendingChats = computed(() => this.chatSessions().filter(c => c.status === 'pending'));
  activeChats = computed(() => this.chatSessions().filter(c => c.status === 'active' && c.agentId === (this.currentAgent() as Agent).id));

  selectChat(chat: ChatSession) {
    this.selectedChat.set(chat);
  }

  acceptChat(chatId: string) {
    this.app.handleAcceptChat(chatId);
  }

  sendMessage(chatId: string, content: string) {
    this.app.handleSendChatMessage({ chatId, content, from: 'agent' });
  }

  convertToTicket(chat: ChatSession) {
    this.app.handleChatConvertToTicket(chat);
  }

  handleSendMessage() {
    if (this.replyText().trim() && this.selectedChat()) {
      this.sendMessage(this.selectedChat()!.id, this.replyText());
      this.replyText.set('');
    }
  }
  
  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}