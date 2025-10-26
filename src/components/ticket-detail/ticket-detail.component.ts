import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket, CannedResponse, Macro, CustomFieldDefinition, Message, Agent, ServiceRequestType, Contact, Organization, Activity, InternalNote, KnowledgeBaseArticle } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { MergeTicketModalComponent } from '../merge-ticket-modal/merge-ticket-modal.component';
import { LogTimeModalComponent } from '../log-time-modal/log-time-modal.component';
import { SplitTicketModalComponent } from '../split-ticket-modal/split-ticket-modal.component';
import { LinkTicketModalComponent } from '../link-ticket-modal/link-ticket-modal.component';
import { GeminiService } from '../../gemini.service';

type TimelineEvent = (Message & { itemType: 'message' }) | (InternalNote & { itemType: 'note' }) | (Activity & { itemType: 'activity' });

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    MergeTicketModalComponent,
    LogTimeModalComponent,
    SplitTicketModalComponent,
    LinkTicketModalComponent,
  ],
})
export class TicketDetailComponent {
  ticket = input.required<Ticket>();
  cannedResponses = input.required<CannedResponse[]>();
  macros = input.required<Macro[]>();
  allTickets = input.required<Ticket[]>();
  contacts = input.required<Contact[]>();
  organizations = input.required<Organization[]>();
  currentAgent = input.required<Agent | Contact>();
  customFieldDefinitions = input.required<CustomFieldDefinition[]>();
  availableTags = input.required<string[]>();
  allAgents = input.required<Agent[]>({ alias: 'agents' });
  knowledgeBaseArticles = input.required<KnowledgeBaseArticle[]>();

  statusChange = output<{ ticketId: number; newStatus: 'open' | 'in-progress' | 'resolved' | 'closed' }>();
  tagsChange = output<{ ticketId: number; newTags: string[] }>();
  reply = output<{ ticketId: number; content: string; fromAgent: boolean; attachments: string[] }>();
  internalNote = output<{ ticketId: number; content: string; agentName: string }>();
  mergeTicket = output<{ targetTicketId: number; sourceTicketId: number }>();
  logTime = output<{ ticketId: number; durationSeconds: number; agent: string }>();
  applyMacro = output<{ ticketId: number; macro: Macro }>();
  splitTicket = output<{ sourceTicketId: number; message: Message; newSubject: string }>();
  addWatcher = output<number>();
  removeWatcher = output<number>();
  linkTicket = output<number>();
  newKbArticle = output<{ title: string, content: string, tags: string[] }>();
  close = output<void>();
  selectTicket = output<number>();

  private geminiService = inject(GeminiService);

  activeTab360 = signal<'contact' | 'organization' | 'timeline'>('contact');
  replyMode = signal<'customer' | 'internal'>('customer');
  replyText = signal('');
  
  cannedResponseFilter = signal('');
  showCannedResponses = signal(false);
  showMacros = signal(false);
  showTagEditor = signal(false);
  
  showMergeModal = signal(false);
  showLogTimeModal = signal(false);
  showSplitTicketModal = signal(false);
  messageToSplit = signal<Message | null>(null);
  showLinkModal = signal(false);
  showAddWatcher = signal(false);
  
  selectedTags = signal<string[]>([]);
  
  ticketSummary = signal<string | null>(null);
  isSummarizing = signal(false);
  suggestedReplies = signal<string[]>([]);
  isSuggestingReplies = signal(false);
  isChangingTone = signal(false);
  isGeneratingKb = signal(false);
  isAnsweringFromKb = signal(false);
  kbAnswer = signal<{ answer: string, sources: KnowledgeBaseArticle[] } | null>(null);

  @ViewChild('replyTextarea') replyTextarea?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('statusSelect') statusSelect?: ElementRef<HTMLSelectElement>;

  isAgent = computed(() => 'roleId' in this.currentAgent());

  conversationItems = computed(() => {
    const messages = this.ticket().messages.map(m => ({ ...m, itemType: 'message', timestamp: new Date(m.timestamp) }));
    const notes = this.ticket().internalNotes.map(n => ({ ...n, itemType: 'note', timestamp: new Date(n.timestamp) }));
    return [...messages, ...notes].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  });
  
  contact = computed(() => this.contacts().find(c => c.id === this.ticket().contactId));
  organization = computed(() => this.organizations().find(o => o.id === this.ticket().organizationId));
  
  timelineEvents = computed(() => {
    const contact = this.contact();
    if (!contact) return [];
    
    const contactTickets = this.allTickets().filter(t => t.contactId === contact.id);
    let events: any[] = [];
    
    for (const ticket of contactTickets) {
      events.push({ 
        itemType: 'activity', 
        type: 'created',
        ticketId: ticket.id, 
        subject: ticket.subject, 
        timestamp: new Date(ticket.created), 
        user: contact.name,
        details: `Ticket #${ticket.id} created: "${ticket.subject}"`
      });
      
      for (const message of ticket.messages) {
        events.push({ ...message, itemType: 'message', ticketId: ticket.id, timestamp: new Date(message.timestamp) });
      }
      
      for (const note of ticket.internalNotes) {
        events.push({ ...note, itemType: 'note', ticketId: ticket.id, timestamp: new Date(note.timestamp) });
      }
    }
    
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  otherViewingAgents = computed(() => {
    const ticket = this.ticket();
    const currentUser = this.currentAgent();
    return (ticket.viewingAgents || []).filter(name => name !== currentUser.name);
  });
  
  watcherAgents = computed(() => {
    const watcherIds = this.ticket().watchers || [];
    return this.allAgents().filter(a => watcherIds.includes(a.id));
  });

  availableAgentsToAdd = computed(() => {
      const watcherIds = this.ticket().watchers || [];
      return this.allAgents().filter(a => !watcherIds.includes(a.id));
  });
  
  parentTicket = computed(() => {
      const parentId = this.ticket().parentId;
      if (!parentId) return null;
      return this.allTickets().find(t => t.id === parentId);
  });

  childTickets = computed(() => {
      const childIds = this.ticket().childTicketIds || [];
      if (childIds.length === 0) return [];
      return this.allTickets().filter(t => childIds.includes(t.id));
  });

  filteredCannedResponses = computed(() => {
    const filter = this.cannedResponseFilter().toLowerCase();
    if (!filter) return this.cannedResponses();
    return this.cannedResponses().filter(r => 
        r.name.toLowerCase().includes(filter) || 
        r.content.toLowerCase().includes(filter)
    );
  });
  
  constructor() {
    effect(() => {
      // When ticket changes, reset AI features
      const currentTicket = this.ticket();
      this.ticketSummary.set(null);
      this.suggestedReplies.set([]);
      this.selectedTags.set(currentTicket.tags);
      this.kbAnswer.set(null);
    }, { allowSignalWrites: true });
  }

  summarize() {
    const contact = this.contact();
    if (!contact) return;
    this.isSummarizing.set(true);
    this.geminiService.summarizeTicket(this.ticket(), contact.name).then(summary => {
      this.ticketSummary.set(summary);
      this.isSummarizing.set(false);
    });
  }

  suggestReplies() {
    const contact = this.contact();
    if (!contact) return;
    this.isSuggestingReplies.set(true);
    this.geminiService.generateReplySuggestions(this.ticket(), contact.name).then(suggestions => {
      this.suggestedReplies.set(suggestions);
      this.isSuggestingReplies.set(false);
    });
  }

  async changeReplyTone(tone: 'Formal' | 'Friendly') {
    if (!this.replyText().trim()) return;
    this.isChangingTone.set(true);
    const rewrittenText = await this.geminiService.changeTone(this.replyText(), tone);
    this.replyText.set(rewrittenText);
    this.isChangingTone.set(false);
  }

  async generateKb() {
    this.isGeneratingKb.set(true);
    try {
      const article = await this.geminiService.generateKbArticle(this.ticket());
      this.newKbArticle.emit(article);
    } catch (e) {
      console.error(e);
      // You could show an error to the user here
    } finally {
      this.isGeneratingKb.set(false);
    }
  }

  async getAnswerFromKb() {
    const lastCustomerMessage = this.ticket().messages.filter(m => m.type === 'customer').pop();
    if (!lastCustomerMessage) return;

    this.isAnsweringFromKb.set(true);
    try {
      const result = await this.geminiService.answerFromKb(lastCustomerMessage.content, this.knowledgeBaseArticles());
      const sourceArticles = this.knowledgeBaseArticles().filter(a => result.sourceIds.includes(a.id));
      this.kbAnswer.set({ answer: result.answer, sources: sourceArticles });
    } finally {
      this.isAnsweringFromKb.set(false);
    }
  }
  
  useSuggestedReply(suggestion: string) {
    this.replyText.set(suggestion);
    this.replyTextarea?.nativeElement.focus();
    this.suggestedReplies.set([]);
  }
  
  formatDate(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString();
  }

  handleReply() {
    if (this.replyText().trim()) {
      if (this.replyMode() === 'customer') {
        this.reply.emit({
          ticketId: this.ticket().id,
          content: this.replyText(),
          fromAgent: this.isAgent(),
          attachments: [],
        });
      } else {
        this.internalNote.emit({
          ticketId: this.ticket().id,
          content: this.replyText(),
          agentName: this.currentAgent().name,
        });
      }
      this.replyText.set('');
    }
  }

  handleCannedResponse(content: string) {
    this.replyText.update(current => `${current}${content}`);
    this.showCannedResponses.set(false);
    this.replyTextarea?.nativeElement.focus();
  }
  
  handleMacro(macro: Macro) {
    this.applyMacro.emit({ ticketId: this.ticket().id, macro });
    this.showMacros.set(false);
  }

  handleTagSave() {
    this.tagsChange.emit({ ticketId: this.ticket().id, newTags: this.selectedTags() });
    this.showTagEditor.set(false);
  }
  
  toggleTag(tag: string) {
    this.selectedTags.update(tags => 
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  }

  handleMerge(sourceTicketId: number) {
    this.mergeTicket.emit({ targetTicketId: this.ticket().id, sourceTicketId });
    this.showMergeModal.set(false);
  }
  
  handleLogTime(durationSeconds: number) {
    this.logTime.emit({ ticketId: this.ticket().id, durationSeconds, agent: this.currentAgent().name });
    this.showLogTimeModal.set(false);
  }
  
  openSplitTicketModal(message: Message) {
    this.messageToSplit.set(message);
    this.showSplitTicketModal.set(true);
  }

  handleSplitTicket(newSubject: string) {
    if(this.messageToSplit()) {
      this.splitTicket.emit({ sourceTicketId: this.ticket().id, message: this.messageToSplit()!, newSubject });
    }
    this.showSplitTicketModal.set(false);
    this.messageToSplit.set(null);
  }

  handleLink(childTicketId: number) {
    this.linkTicket.emit(childTicketId);
    this.showLinkModal.set(false);
  }

  onStatusChange(event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value as 'open' | 'in-progress' | 'resolved' | 'closed';
    this.statusChange.emit({ ticketId: this.ticket().id, newStatus });
  }
  
  onAddWatcher(agentId: number) {
    this.addWatcher.emit(agentId);
    this.showAddWatcher.set(false);
  }

  onRemoveWatcher(agentId: number) {
    this.removeWatcher.emit(agentId);
  }

  getInitials(name: string): string {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
  }
  
  getCustomFieldDefinition(id: string): CustomFieldDefinition | undefined {
      return this.customFieldDefinitions().find(def => def.id === id);
  }
}