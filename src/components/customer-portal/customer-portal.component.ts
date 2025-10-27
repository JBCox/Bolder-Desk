import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket, KnowledgeBaseArticle, Contact, KbFeedback } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../gemini.service';

@Component({
  selector: 'app-customer-portal',
  templateUrl: './customer-portal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, FormsModule],
})
export class CustomerPortalComponent {
  tickets = input.required<Ticket[]>();
  articles = input.required<KnowledgeBaseArticle[]>();
  currentContact = input.required<Contact | { name: string }>();
  addReply = output<{ ticketId: number; content: string; fromAgent: boolean; attachments: string[] }>();
  kbFeedback = output<KbFeedback>();

  private geminiService = inject(GeminiService);
  isApiOnCooldown = this.geminiService.isApiOnCooldown;

  selectedTicket = signal<Ticket | null>(null);
  activeTab = signal<'tickets' | 'kb'>('tickets');
  replyText = signal('');
  
  // Knowledge Base signals
  kbSearchQuery = signal('');
  submittedKbSearchQuery = signal('');
  selectedKbArticle = signal<KnowledgeBaseArticle | null>(null);
  feedbackGiven = signal<{[articleId: number]: 'up' | 'down'}>({});
  isSearchingKb = signal(false);
  kbAnswer = signal<{ answer: string, sources: KnowledgeBaseArticle[] } | null>(null);

  filteredKbArticles = computed(() => {
    const query = this.submittedKbSearchQuery().toLowerCase().trim();
    if (!query) {
      return this.articles();
    }
    return this.articles().filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  async handleKbSearch() {
    const query = this.kbSearchQuery();
    this.submittedKbSearchQuery.set(query);
    this.kbAnswer.set(null);
    if (!query.trim()) {
        return;
    }

    this.isSearchingKb.set(true);
    try {
        const result = await this.geminiService.answerFromKb(query, this.articles());
        const sourceArticles = this.articles().filter(a => result.sourceIds.includes(a.id));
        this.kbAnswer.set({ answer: result.answer, sources: sourceArticles });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Could not perform AI search.';
        this.kbAnswer.set({ answer: `Error: ${message}`, sources: [] });
    } finally {
        this.isSearchingKb.set(false);
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  viewTicket(ticket: Ticket) {
    this.selectedTicket.set(ticket);
  }

  goBackToList() {
    this.selectedTicket.set(null);
    this.replyText.set('');
  }

  viewKbArticle(article: KnowledgeBaseArticle) {
    this.selectedKbArticle.set(article);
    this.kbAnswer.set(null);
    this.submittedKbSearchQuery.set('');
    this.kbSearchQuery.set('');
  }

  goBackToKbList() {
    this.selectedKbArticle.set(null);
  }

  handleReply() {
    const ticket = this.selectedTicket();
    if (ticket && this.replyText().trim()) {
      this.addReply.emit({
        ticketId: ticket.id,
        content: this.replyText(),
        fromAgent: false,
        attachments: []
      });
      this.replyText.set('');
    }
  }

  handleKbVote(articleId: number, vote: 'up' | 'down') {
    this.kbFeedback.emit({ articleId, vote });
    this.feedbackGiven.update(given => ({...given, [articleId]: vote }));
  }
}