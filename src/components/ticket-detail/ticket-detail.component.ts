import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket, CannedResponse, SlaInfo, Macro, CustomFieldDefinition, Message, Agent } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { MergeTicketModalComponent } from '../merge-ticket-modal/merge-ticket-modal.component';
import { LogTimeModalComponent } from '../log-time-modal/log-time-modal.component';
import { SplitTicketModalComponent } from '../split-ticket-modal/split-ticket-modal.component';
import { LinkTicketModalComponent } from '../link-ticket-modal/link-ticket-modal.component';
import { GeminiService } from '../../gemini.service';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent, MergeTicketModalComponent, LogTimeModalComponent, SplitTicketModalComponent, LinkTicketModalComponent],
})
export class TicketDetailComponent {
  ticket = input.required<Ticket>();
  slaInfo = input.required<SlaInfo | null>();
  cannedResponses = input.required<CannedResponse[]>();
  availableTags = input.required<string[]>();
  currentAgent = input.required<Agent | {name: string}>();
  allTickets = input.required<Ticket[]>();
  macros = input.required<Macro[]>();
  customFieldDefinitions = input.required<CustomFieldDefinition[]>();
  allAgents = input.required<Agent[]>();
  customerTicketHistory = input.required<Ticket[]>();

  statusChange = output<{ ticketId: number; newStatus: 'open' | 'in-progress' | 'resolved' | 'closed' }>();
  tagsChange = output<{ ticketId: number; newTags: string[] }>();
  reply = output<{ ticketId: number; content: string; fromAgent: boolean; attachments: string[] }>();
  internalNote = output<{ ticketId: number; content: string; agentName: string }>();
  mergeTicket = output<{ targetTicketId: number; sourceTicketId: number }>();
  logTime = output<{ ticketId: number; durationSeconds: number; agent: string }>();
  applyMacro = output<{ ticketId: number; macro: Macro}>();
  splitTicket = output<{ sourceTicketId: number; message: Message; newSubject: string }>();
  addWatcher = output<number>();
  removeWatcher = output<number>();
  linkTicket = output<number>();

  @ViewChild('replyTextarea') replyTextarea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('statusSelect') statusSelect!: ElementRef<HTMLSelectElement>;

  private geminiService = inject(GeminiService);

  replyText = signal('');
  replyMode = signal<'customer' | 'internal'>('customer');
  showCannedResponses = signal(false);
  cannedResponseFilter = signal('');
  showTagEditor = signal(false);
  showActivity = signal(false);
  selectedTags = signal<string[]>([]);
  attachments = signal<string[]>([]);
  showMergeModal = signal(false);
  showLogTimeModal = signal(false);
  showMacros = signal(false);
  showSplitTicketModal = signal(false);
  messageToSplit = signal<Message | null>(null);
  showAddWatcher = signal(false);
  showLinkModal = signal(false);
  activeTab = signal<'details' | 'customer'>('details');

  // AI Signals
  isSummarizing = signal(false);
  ticketSummary = signal<string | null>(null);
  isSuggestingReplies = signal(false);
  suggestedReplies = signal<string[]>([]);
  
  conversationItems = computed(() => {
    const currentTicket = this.ticket();
    if (!currentTicket) return [];

    const messages = currentTicket.messages.map(m => ({ ...m, itemType: 'message', timestamp: new Date(m.timestamp) }));
    const notes = currentTicket.internalNotes.map(n => ({ ...n, itemType: 'note', timestamp: new Date(n.timestamp) }));
    
    return [...messages, ...notes].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  });

  filteredCannedResponses = computed(() => {
    const filter = this.cannedResponseFilter().toLowerCase();
    if (!filter) {
      return this.cannedResponses();
    }
    return this.cannedResponses().filter(response => 
      response.name.toLowerCase().includes(filter) || 
      response.content.toLowerCase().includes(filter)
    );
  });

  otherViewingAgents = computed(() => {
    return this.ticket()?.viewingAgents?.filter(name => name !== this.currentAgent().name) || [];
  });
  
  totalTimeTrackedFormatted = computed(() => {
      const totalSeconds = this.ticket()?.timeTrackedSeconds || 0;
      if (totalSeconds === 0) return '0h 0m';
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
  });

  watcherAgents = computed(() => {
    const watcherIds = this.ticket().watchers || [];
    const agents = this.allAgents();
    return agents.filter(agent => watcherIds.includes(agent.id));
  });

  availableAgentsToAdd = computed(() => {
    const watcherIds = this.ticket().watchers || [];
    const agents = this.allAgents();
    return agents.filter(agent => !watcherIds.includes(agent.id));
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

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Let AppComponent handle global shortcuts like 'n' or '?'
    if (event.key === 'n' || event.key === '?') return;

    // Handle component-specific shortcuts
    const target = event.target as HTMLElement;
    const isEditingText = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
    
    if (isEditingText && target !== this.replyTextarea.nativeElement) return;
    
    switch (event.key) {
      case 'r':
        if(!isEditingText) {
            event.preventDefault();
            this.replyMode.set('customer');
            this.replyTextarea.nativeElement.focus();
        }
        break;
      case 'i':
        if(!isEditingText) {
            event.preventDefault();
            this.replyMode.set('internal');
            this.replyTextarea.nativeElement.focus();
        }
        break;
      case 's':
        if(!isEditingText) {
            event.preventDefault();
            this.statusSelect.nativeElement.focus();
        }
        break;
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0] ? parts[0][0].toUpperCase() : '';
  }

  handleReply() {
    if (this.replyText().trim()) {
      if (this.replyMode() === 'customer') {
        this.reply.emit({ ticketId: this.ticket().id, content: this.replyText(), fromAgent: true, attachments: this.attachments() });
      } else {
        this.internalNote.emit({ ticketId: this.ticket().id, content: this.replyText(), agentName: this.currentAgent().name });
      }
      this.replyText.set('');
      this.attachments.set([]);
    }
  }

  handleCannedResponse(content: string) {
    this.replyText.update(current => current ? `${current.trim()} ${content}` : content);
    this.showCannedResponses.set(false);
    this.cannedResponseFilter.set('');
  }

  handleTagSave() {
    this.tagsChange.emit({ ticketId: this.ticket().id, newTags: this.selectedTags() });
    this.showTagEditor.set(false);
  }

  toggleTag(tag: string) {
    this.selectedTags.update(tags => {
      if (tags.includes(tag)) {
        return tags.filter(t => t !== tag);
      }
      return [...tags, tag];
    });
  }

  openTagEditor() {
    this.selectedTags.set([...this.ticket().tags]);
    this.showTagEditor.set(true);
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }
  
  formatTimeLeft(milliseconds: number): string {
    if (milliseconds < 0) return 'Breached';
    const hours = Math.floor(milliseconds / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  onStatusChange(event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value as 'open' | 'in-progress' | 'resolved' | 'closed';
    this.statusChange.emit({ticketId: this.ticket().id, newStatus});
  }

  handleMerge(sourceTicketId: number) {
      this.mergeTicket.emit({targetTicketId: this.ticket().id, sourceTicketId});
      this.showMergeModal.set(false);
  }

  handleLogTime(durationSeconds: number) {
      this.logTime.emit({ ticketId: this.ticket().id, durationSeconds, agent: this.currentAgent().name });
      this.showLogTimeModal.set(false);
  }
  
  handleMacro(macro: Macro) {
    this.applyMacro.emit({ ticketId: this.ticket().id, macro });
    this.showMacros.set(false);
  }

  openSplitTicketModal(message: Message) {
    this.messageToSplit.set(message);
    this.showSplitTicketModal.set(true);
  }

  handleSplitTicket(newSubject: string) {
    if (this.messageToSplit()) {
      this.splitTicket.emit({
        sourceTicketId: this.ticket().id,
        message: this.messageToSplit()!,
        newSubject: newSubject
      });
    }
    this.showSplitTicketModal.set(false);
    this.messageToSplit.set(null);
  }

  onAddWatcher(agentId: number) {
    this.addWatcher.emit(agentId);
    this.showAddWatcher.set(false);
  }

  onRemoveWatcher(agentId: number) {
    this.removeWatcher.emit(agentId);
  }

  handleLink(childTicketId: number) {
    this.linkTicket.emit(childTicketId);
    this.showLinkModal.set(false);
  }

  // AI Methods
  summarize() {
    this.isSummarizing.set(true);
    this.ticketSummary.set(null);
    this.geminiService.summarizeTicket(this.ticket()).then(summary => {
      this.ticketSummary.set(summary);
      this.isSummarizing.set(false);
    });
  }

  suggestReplies() {
    this.isSuggestingReplies.set(true);
    this.suggestedReplies.set([]);
    this.geminiService.generateReplySuggestions(this.ticket()).then(replies => {
      this.suggestedReplies.set(replies);
      this.isSuggestingReplies.set(false);
    });
  }

  useSuggestedReply(reply: string) {
    this.replyText.set(reply);
    this.suggestedReplies.set([]);
  }
}