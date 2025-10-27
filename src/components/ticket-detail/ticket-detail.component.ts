// Fix: Replaced invalid file content with a complete and valid Angular component.
import { Component, ChangeDetectionStrategy, input, output, signal, inject, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as models from '../../models';
import { IconComponent } from '../icon/icon.component';
import { GeminiService } from '../../gemini.service';

type AiFeature = 'summary' | 'suggestions' | 'tags' | 'sentiment' | 'kb' | 'predictedCsat';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class TicketDetailComponent {
  ticket = input.required<models.Ticket | null>();
  contact = input.required<models.Contact | undefined>();
  agent = input<models.Agent | undefined>();
  agents = input.required<models.Agent[]>();
  availableTags = input.required<string[]>();
  hasPermission = input.required<(permission: models.Permission) => boolean>();

  addReply = output<{ ticketId: number; content: string; fromAgent: boolean; attachments: string[] }>();
  addNote = output<{ ticketId: number; content: string }>();
  updateTicket = output<Partial<models.Ticket>>();
  openMergeModal = output<models.Ticket>();
  openSplitModal = output<models.Message>();
  openLogTimeModal = output<models.Ticket>();
  openLinkTicketModal = output<models.Ticket>();
  createKbArticle = output<models.Ticket>();
  viewTicket = output<number>();

  private geminiService = inject(GeminiService);
  isApiOnCooldown = this.geminiService.isApiOnCooldown;

  activeTab = signal<'reply' | 'note'>('reply');
  replyContent = signal('');
  noteContent = signal('');
  
  // AI-related state
  summary = signal('');
  suggestions = signal<string[]>([]);
  suggestedTags = signal<string[]>([]);
  sentiment = signal<models.Ticket['sentiment']>('neutral');
  predictedCsat = signal<number | null>(null);
  isLoading = signal<Set<AiFeature>>(new Set());
  isRewritingTone = signal(false);
  aiError = signal<string | null>(null);
  
  isGeneratingKb = signal(false);
  
  private lastRunTicketId = signal<number | null>(null);
  private lastRunMessageCount = signal<number>(0);

  constructor() {
    effect(() => {
      const currentTicket = this.ticket();
      if (currentTicket) {
        const isNewTicket = currentTicket.id !== this.lastRunTicketId();
        // Trigger on new ticket or if a new message has been added
        const hasNewMessage = currentTicket.messages.length > this.lastRunMessageCount();

        if (isNewTicket || hasNewMessage) {
            this.runTicketInsights(currentTicket);
            this.lastRunTicketId.set(currentTicket.id);
            this.lastRunMessageCount.set(currentTicket.messages.length);
        }
      } else {
        // Reset when no ticket is selected
        this.lastRunTicketId.set(null);
        this.lastRunMessageCount.set(0);
      }
    }, { allowSignalWrites: true });
  }

  async handleRewriteTone(tone: 'Formal' | 'Friendly') {
    const currentContent = this.replyContent();
    if (!currentContent.trim()) {
      return;
    }
    
    this.isRewritingTone.set(true);
    try {
      const rewrittenText = await this.geminiService.changeTone(currentContent, tone);
      this.replyContent.set(rewrittenText);
    } catch (error) {
      console.error('Failed to rewrite tone:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      this.aiError.set(errorMessage);
    } finally {
      this.isRewritingTone.set(false);
    }
  }

  async runTicketInsights(ticket: models.Ticket) {
    if (!this.contact()) return;

    this.isLoading.set(new Set(['summary', 'suggestions', 'tags', 'sentiment', 'predictedCsat']));
    this.aiError.set(null);
    this.summary.set('');
    this.suggestions.set([]);
    this.suggestedTags.set([]);
    this.sentiment.set('neutral');
    this.predictedCsat.set(null);

    try {
        const insights = await this.geminiService.getAiTicketInsights(ticket, this.contact()!.name, this.availableTags());
        this.summary.set(insights.summary);
        this.suggestions.set(insights.suggestions);
        this.suggestedTags.set(insights.tags);
        this.sentiment.set(insights.sentiment);
        this.updateTicket.emit({ sentiment: insights.sentiment });
        this.predictedCsat.set(insights.predictedCsat);
        this.updateTicket.emit({ predictedSatisfaction: insights.predictedCsat });
    } catch (e) {
        console.error('Failed to get AI ticket insights', e);
        const errorMessage = e instanceof Error ? e.message : 'Could not load AI insights.';
        this.aiError.set(errorMessage);
    } finally {
        this.isLoading.set(new Set());
    }
  }
  
  forceRefreshInsights() {
    const currentTicket = this.ticket();
    if (currentTicket) {
      this.runTicketInsights(currentTicket);
    }
  }
  
  async handleCreateKbArticle() {
    const ticket = this.ticket();
    if(!ticket || ticket.status !== 'resolved') {
      alert('This ticket must be resolved to create a knowledge base article.');
      return;
    }
    this.isGeneratingKb.set(true);
    try {
        const article = await this.geminiService.generateKbArticle(ticket);
        // In a real app, this would emit an event to create the article
        alert(`KB Article Draft Created:\n\nTitle: ${article.title}\n\nTags: ${article.tags.join(', ')}`);

    } catch(e) {
        alert('Failed to generate knowledge base article.');
        console.error(e);
    } finally {
        this.isGeneratingKb.set(false);
    }
  }
  
  timelineItems = computed(() => {
    const t = this.ticket();
    if (!t) return [];
    
    const items: (models.Message | models.InternalNote | models.Activity)[] = [
        ...t.messages,
        ...t.internalNotes,
        ...t.activities
    ];
    
    return items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  });

  isMessage(item: any): item is models.Message {
    return 'from' in item && 'type' in item && 'content' in item;
  }
  
  isNote(item: any): item is models.InternalNote {
    return 'agentName' in item;
  }
  
  isActivity(item: any): item is models.Activity {
    return 'user' in item && 'details' in item;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
  
  formatSeconds(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  handleReply() {
    if (this.replyContent().trim() && this.ticket()) {
      this.addReply.emit({ ticketId: this.ticket()!.id, content: this.replyContent(), fromAgent: true, attachments: [] });
      this.replyContent.set('');
    }
  }

  handleNote() {
    if (this.noteContent().trim() && this.ticket()) {
      this.addNote.emit({ ticketId: this.ticket()!.id, content: this.noteContent() });
      this.noteContent.set('');
    }
  }

  handleStatusChange(event: Event) {
    const status = (event.target as HTMLSelectElement).value as models.Ticket['status'];
    this.updateTicket.emit({ status });
  }
  
  handlePriorityChange(event: Event) {
    const priority = (event.target as HTMLSelectElement).value as models.Ticket['priority'];
    this.updateTicket.emit({ priority });
  }
  
  handleAssigneeChange(event: Event) {
    const assignedTo = (event.target as HTMLSelectElement).value;
    this.updateTicket.emit({ assignedTo });
  }
  
  addTag(tag: string) {
    if (!this.ticket()) return;
    const newTags = [...new Set([...this.ticket()!.tags, tag])];
    this.updateTicket.emit({ tags: newTags });
  }

  removeTag(tag: string) {
    if (!this.ticket()) return;
    const newTags = this.ticket()!.tags.filter(t => t !== tag);
    this.updateTicket.emit({ tags: newTags });
  }
}