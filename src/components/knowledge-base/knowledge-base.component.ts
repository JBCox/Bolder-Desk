import { Component, ChangeDetectionStrategy, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KnowledgeBaseArticle, KnowledgeBaseCategory, KbFeedback } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  templateUrl: './knowledge-base.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class KnowledgeBaseComponent {
  private app = inject(AppComponent);
  articles = this.app.kbArticles;
  categories = this.app.kbCategories;

  selectedCategory = signal<string | 'all'>('all');
  searchQuery = signal('');
  selectedArticle = signal<KnowledgeBaseArticle | null>(null);
  feedbackGiven = signal<{[articleId: number]: 'up' | 'down'}>({});

  filteredArticles = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const category = this.selectedCategory();
    
    return this.articles().filter(article => {
      const categoryMatch = category === 'all' || article.category === category;
      const searchMatch = query === '' || 
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query));
      return categoryMatch && searchMatch;
    });
  });

  selectArticle(article: KnowledgeBaseArticle) {
    this.selectedArticle.set(article);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getCategoryName(categoryId: string): string {
    return this.categories().find(c => c.id === categoryId)?.name || '';
  }

  handleVote(articleId: number, vote: 'up' | 'down') {
    this.app.handleKbFeedback({ articleId, vote });
    this.feedbackGiven.update(given => ({...given, [articleId]: vote }));
  }
}