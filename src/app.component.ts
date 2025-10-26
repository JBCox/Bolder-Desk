import { Component, ChangeDetectionStrategy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MOCK_DATA } from './mock-data';
import * as models from './models';
import { IconComponent } from './components/icon/icon.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { NewTicketModalComponent } from './components/new-ticket-modal/new-ticket-modal.component';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { KnowledgeBaseComponent } from './components/knowledge-base/knowledge-base.component';
import { MergeTicketModalComponent } from './components/merge-ticket-modal/merge-ticket-modal.component';
import { SplitTicketModalComponent } from './components/split-ticket-modal/split-ticket-modal.component';
import { CsatModalComponent } from './components/csat-modal/csat-modal.component';
import { BulkActionBarComponent } from './components/bulk-action-bar/bulk-action-bar.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { LogTimeModalComponent } from './components/log-time-modal/log-time-modal.component';
import { LinkTicketModalComponent } from './components/link-ticket-modal/link-ticket-modal.component';
import { CustomerPortalComponent } from './components/customer-portal/customer-portal.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatWidgetComponent } from './components/chat-widget/chat-widget.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SlackIntegrationComponent } from './components/slack-integration/slack-integration.component';
import { WallboardComponent } from './components/wallboard/wallboard.component';
import { CustomersComponent } from './components/customers/customers.component';
import { QualityAssuranceComponent } from './components/quality-assurance/quality-assurance.component';
import { KeyboardShortcutsModalComponent } from './components/keyboard-shortcuts-modal/keyboard-shortcuts-modal.component';
import { DevPlanComponent } from './components/dev-plan/dev-plan.component';
import { SsoSettingsComponent } from './components/sso-settings/sso-settings.component';
import { GeminiService } from './gemini.service';


type View = 'tickets' | 'analytics' | 'kb' | 'customers' | 'inbox' | 'chat' | 'reports' | 'slack' | 'qa' | 'wallboard' | 'devplan' | 'portal';
type Modal = 'newTicket' | 'mergeTicket' | 'splitTicket' | 'csat' | 'settings' | 'logTime' | 'linkTicket' | 'shortcuts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    TicketDetailComponent,
    NewTicketModalComponent,
    AnalyticsDashboardComponent,
    KnowledgeBaseComponent,
    MergeTicketModalComponent,
    SplitTicketModalComponent,
    CsatModalComponent,
    BulkActionBarComponent,
    SettingsModalComponent,
    LogTimeModalComponent,
    LinkTicketModalComponent,
    CustomerPortalComponent,
    InboxComponent,
    ChatComponent,
    ChatWidgetComponent,
    ReportsComponent,
    SlackIntegrationComponent,
    WallboardComponent,
    CustomersComponent,
    QualityAssuranceComponent,
    KeyboardShortcutsModalComponent,
    DevPlanComponent,
    SsoSettingsComponent,
  ],
})
export class AppComponent {
  private geminiService = inject(GeminiService);

  // === STATE SIGNALS ===
  currentView = signal<View>('tickets');
  openModal = signal<Modal | null>(null);
  
  // Data signals
  tickets = signal<models.Ticket[]>(MOCK_DATA.tickets);
  contacts = signal<models.Contact[]>(MOCK_DATA.contacts);
  organizations = signal<models.Organization[]>(MOCK_DATA.organizations);
  agents = signal<models.Agent[]>(MOCK_DATA.agents);
  groups = signal<models.Group[]>(MOCK_DATA.groups);
  customFieldDefs = signal<models.CustomFieldDefinition[]>(MOCK_DATA.customFieldDefinitions);
  slaRules = signal<models.SlaRules>(MOCK_DATA.slaRules);
  automationRules = signal<models.AutomationRule[]>(MOCK_DATA.automationRules);
  kbArticles = signal<models.KnowledgeBaseArticle[]>(MOCK_DATA.knowledgeBaseArticles);
  kbCategories = signal<models.KnowledgeBaseCategory[]>(MOCK_DATA.knowledgeBaseCategories);
  formTemplates = signal<models.FormTemplate[]>(MOCK_DATA.formTemplates);
  emails = signal<models.MockEmail[]>(MOCK_DATA.emails);
  chatSessions = signal<models.ChatSession[]>(MOCK_DATA.chatSessions);
  slackMessages = signal<models.SlackMessage[]>(MOCK_DATA.slackMessages);
  slackSettings = signal<models.SlackSettings>(MOCK_DATA.slackSettings);
  qaRubrics = signal<models.QARubric[]>(MOCK_DATA.qaRubrics);
  qaReviews = signal<models.QAReview[]>(MOCK_DATA.qaReviews);
  roles = signal<models.Role[]>(MOCK_DATA.roles);
  ssoSettings = signal<models.SsoSettings>(MOCK_DATA.ssoSettings);
  allPermissions = signal<models.Permission[]>(['ticket:merge', 'view:tickets', 'edit:tickets', 'delete:tickets', 'view:customers', 'edit:customers', 'view:reports', 'view:settings', 'manage:agents', 'manage:billing']);
  
  // UI State
  selectedTicketId = signal<number | null>(null);
  selectedTicketForModal = signal<models.Ticket | null>(null);
  selectedMessageForModal = signal<models.Message | null>(null);
  selectedTicketIds = signal<number[]>([]);
  searchQuery = signal('');
  sidebarCollapsed = signal(false);
  isDarkMode = signal(false);
  
  // Hardcoded current user/customer for portal/widget views
  currentAgent = signal(this.agents()[0]);
  currentCustomer = signal(this.contacts()[0]);
  currentChatSession = computed(() => this.chatSessions().find(c => c.customerEmail === this.currentCustomer().email && c.status !== 'ended') || null);

  // === COMPUTED SIGNALS ===
  selectedTicket = computed(() => {
    const id = this.selectedTicketId();
    return id ? this.tickets().find(t => t.id === id) ?? null : null;
  });

  selectedContact = computed(() => {
    const ticket = this.selectedTicket();
    if (!ticket) {
      return undefined;
    }
    return this.contacts().find(c => c.id === ticket.contactId);
  });

  filteredTickets = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.tickets().filter(ticket =>
      ticket.subject.toLowerCase().includes(query) ||
      ticket.id.toString().includes(query) ||
      this.getContact(ticket.contactId)?.name.toLowerCase().includes(query)
    );
  });
  
  analyticsData = computed<models.AnalyticsData>(() => {
     // Basic analytics calculation for demo
    const resolvedTickets = this.tickets().filter(t => t.status === 'resolved');
    const totalResolutionTime = resolvedTickets.reduce((acc, t) => {
        if (t.resolvedAt) {
            return acc + (new Date(t.resolvedAt).getTime() - new Date(t.created).getTime());
        }
        return acc;
    }, 0);
    const satisfactionScores = resolvedTickets.map(t => t.satisfactionRating).filter(r => r !== undefined) as number[];
    
    return {
        ticketsCreated: this.tickets().length,
        ticketsResolved: resolvedTickets.length,
        avgFirstResponseTime: 15, // Mock
        avgResolutionTime: resolvedTickets.length > 0 ? (totalResolutionTime / resolvedTickets.length) / (1000 * 60 * 60) : 0,
        satisfactionScore: satisfactionScores.length > 0 ? (satisfactionScores.reduce((a,b) => a+b, 0) / satisfactionScores.length) * 20 : 95,
        topPerformingAgent: 'Alex Ray' // Mock
    };
  });
  
  wallboardData = computed<models.WallboardData>(() => {
    const openTickets = this.tickets().filter(t => t.status === 'open' || t.status === 'pending');
    const today = new Date().toDateString();
    const todaysResolved = this.tickets().filter(t => t.resolvedAt && new Date(t.resolvedAt).toDateString() === today).length;
    return {
      openTickets: openTickets.length,
      todaysResolved: todaysResolved,
      slaBreachRisks: openTickets.filter(t => t.sla?.status === 'risk').length,
      agentStatus: this.agents().map(a => ({
        name: a.name,
        status: a.onlineStatus,
        tickets: this.tickets().filter(t => t.assignedTo === a.name && t.status === 'open').length,
      })),
      customerSatisfaction: { score: this.analyticsData().satisfactionScore, trend: 'up' },
    }
  });

  availableTags = computed(() => [...new Set(this.tickets().flatMap(t => t.tags))]);

  customerPortalTickets = computed(() => {
    const customer = this.currentCustomer();
    if (!customer) return [];
    return this.tickets().filter(t => t.contactId === customer.id);
  });

  hasPermission = computed(() => (permission: models.Permission) => {
    const agent = this.currentAgent();
    const role = this.roles().find(r => r.id === agent.roleId);
    return role?.permissions.includes(permission) ?? false;
  });

  // === METHODS ===
  
  toggleDarkMode() {
    this.isDarkMode.update(v => !v);
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  getRoleName(roleId: string): string {
    return this.roles().find(r => r.id === roleId)?.name ?? 'Unknown Role';
  }

  getContact(id: number): models.Contact | undefined {
    return this.contacts().find(c => c.id === id);
  }

  getAgent(name: string): models.Agent | undefined {
    return this.agents().find(a => a.name === name);
  }

  selectTicket(id: number | null) {
    this.selectedTicketId.set(id);
    this.currentView.set('tickets'); // Switch to ticket view if not already
  }

  toggleTicketSelection(ticketId: number) {
    this.selectedTicketIds.update(ids =>
      ids.includes(ticketId) ? ids.filter(id => id !== ticketId) : [...ids, ticketId]
    );
  }

  selectAllTickets() {
    this.selectedTicketIds.set(this.filteredTickets().map(t => t.id));
  }

  // Event handlers from child components

  handleCreateTicket(ticketData: Partial<models.Ticket> & { formValues?: any }) {
    const newTicket: models.Ticket = {
      id: Math.max(...this.tickets().map(t => t.id)) + 1,
      subject: ticketData.subject || 'New Ticket',
      contactId: ticketData.contactId!,
      created: new Date().toISOString(),
      status: 'open',
      priority: 'medium',
      tags: [],
      messages: ticketData.messages || [],
      internalNotes: [],
      activities: [{ type: 'created', user: 'System', timestamp: new Date().toISOString(), details: 'Ticket created' }],
      timeTrackedSeconds: 0,
      formValues: ticketData.formValues,
    };
    this.tickets.update(t => [newTicket, ...t]);
    this.openModal.set(null);
    this.selectTicket(newTicket.id);
    
    // Asynchronously route the ticket using AI
    this.routeTicketWithAI(newTicket.id);
  }
  
  private async routeTicketWithAI(ticketId: number) {
    const ticket = this.tickets().find(t => t.id === ticketId);
    if (!ticket) return;

    const suggestedAgent = await this.geminiService.suggestAgentForTicket(ticket, this.agents());

    if (suggestedAgent) {
      this.tickets.update(tickets => tickets.map(t => {
        if (t.id === ticketId) {
          const assignmentActivity: models.Activity = {
            type: 'ai_assignment',
            user: 'AI Assistant',
            timestamp: new Date().toISOString(),
            details: `Assigned to ${suggestedAgent.name}.`
          };
          return {
            ...t,
            assignedTo: suggestedAgent.name,
            activities: [...t.activities, assignmentActivity]
          };
        }
        return t;
      }));
    }
  }
  
  handleAddReply(event: { ticketId: number; content: string; fromAgent: boolean, attachments: string[] }) {
    this.tickets.update(tickets => tickets.map(t => {
      if (t.id === event.ticketId) {
        const newMessage: models.Message = {
          from: event.fromAgent ? this.currentAgent().name : this.getContact(t.contactId)!.name,
          type: event.fromAgent ? 'agent' : 'customer',
          content: event.content,
          timestamp: new Date().toISOString(),
          attachments: event.attachments
        };
        const newTicket = { ...t, messages: [...t.messages, newMessage] };
        if (event.fromAgent) newTicket.status = 'pending';
        return newTicket;
      }
      return t;
    }));
  }

  handleAddNote(event: { ticketId: number; content: string }) {
    this.tickets.update(tickets => tickets.map(t => {
      if (t.id === event.ticketId) {
        const newNote: models.InternalNote = {
          agentName: this.currentAgent().name,
          content: event.content,
          timestamp: new Date().toISOString()
        };
        return { ...t, internalNotes: [...t.internalNotes, newNote] };
      }
      return t;
    }));
  }

  handleUpdateTicket(update: Partial<models.Ticket>) {
    this.tickets.update(tickets => tickets.map(t => 
        t.id === this.selectedTicketId() ? { ...t, ...update } : t
    ));
  }
  
  handleMergeTickets(targetTicketId: number) {
    const sourceTicket = this.selectedTicketForModal();
    if (!sourceTicket) return;

    this.tickets.update(tickets => {
        let sourceMessages: models.Message[] = [];
        const updatedTickets = tickets.map(t => {
            if (t.id === sourceTicket.id) {
                sourceMessages = t.messages;
                return { ...t, status: 'closed' as 'closed', subject: `[MERGED] ${t.subject}` };
            }
            if (t.id === targetTicketId) {
                return { ...t, messages: [...t.messages, ...sourceMessages] };
            }
            return t;
        });
        return updatedTickets;
    });

    this.openModal.set(null);
    this.selectTicket(targetTicketId);
  }
  
  handleSplitTicket(newSubject: string) {
    const sourceMessage = this.selectedMessageForModal();
    const sourceTicket = this.selectedTicket();
    if (!sourceMessage || !sourceTicket) return;

    const newTicket: models.Ticket = {
      id: Math.max(...this.tickets().map(t => t.id)) + 1,
      subject: newSubject,
      contactId: sourceTicket.contactId,
      created: new Date().toISOString(),
      status: 'open',
      priority: sourceTicket.priority,
      tags: [...sourceTicket.tags],
      messages: [sourceMessage],
      internalNotes: [],
      activities: [],
      timeTrackedSeconds: 0,
      parentId: sourceTicket.id
    };
    
    this.tickets.update(t => [newTicket, ...t]);
    this.openModal.set(null);
    this.selectTicket(newTicket.id);
  }

  handleCsatSubmit(event: { rating: number; comment: string }) {
    const ticket = this.selectedTicketForModal();
    if (!ticket) return;

    this.tickets.update(tickets => tickets.map(t => 
        t.id === ticket.id ? { ...t, satisfactionRating: event.rating, satisfactionComment: event.comment } : t
    ));
    this.openModal.set(null);
  }
  
  handleBulkAction(event: { action: string, value: any }) {
    const ids = this.selectedTicketIds();
    this.tickets.update(tickets => tickets.map(t => {
      if (!ids.includes(t.id)) return t;
      
      switch (event.action) {
        case 'status': return { ...t, status: event.value };
        case 'assign': return { ...t, assignedTo: event.value };
        case 'tag': return { ...t, tags: [...new Set([...t.tags, event.value])] };
        case 'delete': return { ...t, status: 'closed' }; // Soft delete
        default: return t;
      }
    }));
    this.selectedTicketIds.set([]);
  }

  handleLogTime(seconds: number) {
    const ticket = this.selectedTicketForModal();
    if (!ticket) return;
    this.tickets.update(tickets => tickets.map(t => 
        t.id === ticket.id ? { ...t, timeTrackedSeconds: t.timeTrackedSeconds + seconds } : t
    ));
    this.openModal.set(null);
  }
  
  handleKbFeedback(feedback: models.KbFeedback) {
    this.kbArticles.update(articles => articles.map(a => {
      if (a.id === feedback.articleId) {
        if(feedback.vote === 'up') return {...a, upvotes: a.upvotes + 1};
        if(feedback.vote === 'down') return {...a, downvotes: a.downvotes + 1};
      }
      return a;
    }))
  }

  handleCreateKbArticle(ticket: models.Ticket) {
    const newArticle: models.KnowledgeBaseArticle = {
      id: this.kbArticles().length + 1,
      title: `How to: ${ticket.subject}`,
      content: `This article is based on ticket #${ticket.id}. Solution: ...`,
      category: 'solutions',
      tags: ticket.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'AI Assistant',
      views: 0,
      upvotes: 0,
      downvotes: 0,
    };
    this.kbArticles.update(articles => [...articles, newArticle]);
    alert('KB Article draft created!');
  }

  handleSaveRoles(updatedRoles: models.Role[]) {
    this.roles.set(updatedRoles);
    alert('Roles and permissions saved!');
  }

  handleSaveSsoSettings(settings: models.SsoSettings) {
    this.ssoSettings.set(settings);
    alert('SSO settings saved!');
  }

  // Modal Openers
  openModalWithTicket(modal: Modal, ticket: models.Ticket) {
    this.selectedTicketForModal.set(ticket);
    this.openModal.set(modal);
  }
  
  openSplitModalWithMessage(message: models.Message) {
    this.selectedMessageForModal.set(message);
    this.openModal.set('splitTicket');
  }
}