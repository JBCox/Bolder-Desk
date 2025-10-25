import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket, KnowledgeBaseArticle } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-portal',
  templateUrl: './customer-portal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent, FormsModule],
})
export class CustomerPortalComponent {
  tickets = input.required<Ticket[]>();
  articles = input.required<KnowledgeBaseArticle[]>();

  selectedTicket = signal<Ticket | null>(null);
  activeTab = signal<'tickets' | 'kb'>('tickets');
  
  // Knowledge Base signals
  kbSearchQuery = signal('');
  selectedKbArticle = signal<KnowledgeBaseArticle | null>(null);

  filteredKbArticles = computed(() => {
    const query = this.kbSearchQuery().toLowerCase().trim();
    if (!query) {
      return this.articles();
    }
    return this.articles().filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  viewTicket(ticket: Ticket) {
    this.selectedTicket.set(ticket);
  }

  goBackToList() {
    this.selectedTicket.set(null);
  }

  viewKbArticle(article: KnowledgeBaseArticle) {
    this.selectedKbArticle.set(article);
  }

  goBackToKbList() {
    this.selectedKbArticle.set(null);
  }
}
