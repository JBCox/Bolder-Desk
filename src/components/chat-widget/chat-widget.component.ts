import { Component, ChangeDetectionStrategy, input, output, signal, viewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatSession } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  templateUrl: './chat-widget.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
})
export class ChatWidgetComponent {
  customer = input.required<{name: string, email: string}>();
  session = input.required<ChatSession | null>();
  startChat = output<{ initialMessage: string, pageUrl: string, browserInfo: string }>();
  sendMessage = output<{ chatId: string, content: string }>();

  isOpen = signal(false);
  messageText = signal('');
  
  chatBody = viewChild<ElementRef>('chatBody');

  constructor() {
    effect(() => {
        // When a new message comes in, scroll to the bottom
        if (this.session() && this.chatBody()) {
            setTimeout(() => {
                this.chatBody()!.nativeElement.scrollTop = this.chatBody()!.nativeElement.scrollHeight;
            }, 0);
        }
    });
  }

  toggleChat() {
    this.isOpen.update(open => !open);
  }

  handleSendMessage() {
    if (this.messageText().trim()) {
      if (this.session()) {
        this.sendMessage.emit({ chatId: this.session()!.id, content: this.messageText() });
      } else {
        this.startChat.emit({ 
            initialMessage: this.messageText(),
            pageUrl: window.location.pathname,
            browserInfo: navigator.userAgent
        });
      }
      this.messageText.set('');
    }
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
