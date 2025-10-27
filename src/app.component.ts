import { Component, ChangeDetectionStrategy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd, RouterLinkActive } from '@angular/router';
import * as models from './models';
import * as mock from './mock-data';
import { IconComponent } from './components/icon/icon.component';
import { NewTicketModalComponent } from './components/new-ticket-modal/new-ticket-modal.component';
import { MergeTicketModalComponent } from './components/merge-ticket-modal/merge-ticket-modal.component';
import { SplitTicketModalComponent } from './components/split-ticket-modal/split-ticket-modal.component';
import { LogTimeModalComponent } from './components/log-time-modal/log-time-modal.component';
import { CsatModalComponent } from './components/csat-modal/csat-modal.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { KeyboardShortcutsModalComponent } from './components/keyboard-shortcuts-modal/keyboard-shortcuts-modal.component';
import { CommandPaletteComponent } from './components/command-palette/command-palette.component';
import { LinkTicketModalComponent } from './components/link-ticket-modal/link-ticket-modal.component';
import { NewKanbanBoardModalComponent } from './components/new-kanban-board-modal/new-kanban-board-modal.component';

const i18n = {
  en: {
    newTicket: 'New Ticket', myInbox: 'My Inbox', tickets: 'Tickets', analytics: 'Analytics',
    knowledgeBase: 'Knowledge Base', customers: 'Customers', reports: 'Reports', qualityAssurance: 'Quality Assurance',
    wallboard: 'Wallboard', kanban: 'Kanban', channels: 'Channels', inbox: 'Inbox', liveChat: 'Live Chat',
    slack: 'Slack', facebook: 'Facebook', twitter: 'Twitter', whatsapp: 'WhatsApp', integrations: 'Integrations',
    salesforce: 'Salesforce', jira: 'Jira', customerPortal: 'Customer Portal', devPlan: 'Dev Plan',
  },
  es: {
    newTicket: 'Nuevo Ticket', myInbox: 'Mi Bandeja', tickets: 'Tickets', analytics: 'Analítica',
    knowledgeBase: 'Base de Conocimiento', customers: 'Clientes', reports: 'Informes', qualityAssurance: 'Calidad',
    wallboard: 'Wallboard', kanban: 'Kanban', channels: 'Canales', inbox: 'Bandeja de Entrada', liveChat: 'Chat en Vivo',
    slack: 'Slack', facebook: 'Facebook', twitter: 'Twitter', whatsapp: 'WhatsApp', integrations: 'Integraciones',
    salesforce: 'Salesforce', jira: 'Jira', customerPortal: 'Portal de Cliente', devPlan: 'Plan de Desarrollo',
  },
  fr: {
    newTicket: 'Nouveau Ticket', myInbox: 'Ma Boîte', tickets: 'Tickets', analytics: 'Analyses',
    knowledgeBase: 'Base de Connaissances', customers: 'Clients', reports: 'Rapports', qualityAssurance: 'Qualité',
    wallboard: 'Wallboard', kanban: 'Kanban', channels: 'Canaux', inbox: 'Boîte de Réception', liveChat: 'Chat en Direct',
    slack: 'Slack', facebook: 'Facebook', twitter: 'Twitter', whatsapp: 'WhatsApp', integrations: 'Intégrations',
    salesforce: 'Salesforce', jira: 'Jira', customerPortal: 'Portail Client', devPlan: 'Plan de Dév',
  }
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent, DatePipe,
    NewTicketModalComponent, MergeTicketModalComponent, SplitTicketModalComponent,
    LogTimeModalComponent, CsatModalComponent, SettingsModalComponent,
    KeyboardShortcutsModalComponent, CommandPaletteComponent, LinkTicketModalComponent,
    NewKanbanBoardModalComponent
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // === STATE SIGNALS ===
  
  // Data
  tickets = signal<models.Ticket[]>(mock.mockTickets);
  contacts = signal<models.Contact[]>(mock.mockContacts);
  organizations = signal<models.Organization[]>(mock.mockOrganizations);
  agents = signal<models.Agent[]>(mock.mockAgents);
  groups = signal<models.Group[]>(mock.mockGroups);
  ticketViews = signal<models.TicketView[]>(mock.mockTicketViews);
  customFieldDefs = signal<models.CustomFieldDefinition[]>(mock.mockCustomFieldDefs);
  analyticsData = signal<models.AnalyticsData>(mock.mockAnalyticsData);
  kbArticles = signal<models.KnowledgeBaseArticle[]>(mock.mockKnowledgeBaseArticles);
  kbCategories = signal<models.KnowledgeBaseCategory[]>(mock.mockKnowledgeBaseCategories);
  formTemplates = signal<models.FormTemplate[]>(mock.mockFormTemplates);
  slaRules = signal<models.SlaRules>(mock.mockSlaRules);
  automationRules = signal<models.AutomationRule[]>(mock.mockAutomationRules);
  emails = signal<models.MockEmail[]>(mock.mockEmails);
  chatSessions = signal<models.ChatSession[]>(mock.mockChatSessions);
  wallboardData = signal<models.WallboardData>(mock.mockWallboardData);
  roles = signal<models.Role[]>(mock.mockRoles);
  allPermissions = signal<models.Permission[]>(mock.allPermissions);
  qaRubrics = signal<models.QARubric[]>(mock.mockQaRubrics);
  qaReviews = signal<models.QAReview[]>(mock.mockQaReviews);
  ssoSettings = signal<models.SsoSettings>(mock.mockSsoSettings);
  auditLog = signal<models.AuditLogEntry[]>(mock.mockAuditLog);
  apiKeys = signal<models.ApiKey[]>(mock.mockApiKeys);
  webhooks = signal<models.Webhook[]>(mock.mockWebhooks);
  slackMessages = signal<models.SlackMessage[]>(mock.mockSlackMessages);
  slackSettings = signal<models.SlackSettings>(mock.mockSlackSettings);
  facebookThreads = signal<models.FacebookThread[]>(mock.mockFacebookThreads);
  twitterThreads = signal<models.TwitterThread[]>(mock.mockTwitterThreads);
  whatsAppThreads = signal<models.WhatsAppThread[]>(mock.mockWhatsAppThreads);
  salesforceSettings = signal<models.SalesforceSettings>(mock.mockSalesforceSettings);
  jiraSettings = signal<models.JiraSettings>(mock.mockJiraSettings);
  kanbanWorkspaces = signal<models.KanbanWorkspace[]>(mock.mockKanbanData.workspaces);
  kanbanBoards = signal<models.KanbanBoard[]>(mock.mockKanbanData.boards);
  kanbanLabels = signal<models.KanbanLabel[]>(mock.mockKanbanLabels);
  kanbanTasks = signal<{[key: string]: models.KanbanTask}>(mock.mockKanbanTasks);
  notifications = signal<models.Notification[]>(mock.mockNotifications);

  // UI State
  isSidebarCollapsed = signal(false);
  isDarkMode = signal(false);
  openModal = signal<string | null>(null);
  selectedTicketForModal = signal<models.Ticket | null>(null);
  selectedMessageForModal = signal<models.Message | null>(null);
  searchQuery = signal('');
  showCommandPalette = signal(false);
  showNotifications = signal(false);
  showLanguageMenu = signal(false);
  
  // Global App State
  currentAgent = signal<models.Agent>(this.agents()[0]);
  currentCustomer = signal<models.Contact>(this.contacts()[0]);
  currentLanguage = signal<'en' | 'es' | 'fr'>('en');
  
  // Ticket list state
  activeViewId = signal<string>('all');
  activeFilters = signal<models.TicketFilters>([]);
  selectedTicketId = signal<number | null>(null);
  selectedTicketIds = signal<number[]>([]);
  
  defaultViewId = signal(localStorage.getItem('bolddesk_default_view') || 'all');
  
  // Toasts
  toasts = signal<{id: number, message: string, type: 'success'|'error'|'info', icon: string}[]>([]);

  // FIX: Explicitly type injected Router to fix "Property 'navigate' does not exist on type 'unknown'" error.
  private router: Router = inject(Router);

  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('dark', this.isDarkMode());
    });
  }
  
  // === COMPUTED SIGNALS ===
  
  translations = computed(() => i18n[this.currentLanguage()]);
  pinnedViews = computed(() => this.ticketViews().filter(v => v.isPinned));
  unreadNotificationsCount = computed(() => this.notifications().filter(n => !n.read).length);
  customerPortalTickets = computed(() => this.tickets().filter(t => t.contactId === this.currentCustomer().id));
  
  // For routerLinkActiveOptions on tickets link to match /tickets and /tickets/:id
  ticketsRouteOptions = {paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'};
  availableTags = computed(() => [...new Set(this.tickets().flatMap(t => t.tags))]);


  // === METHODS ===

  toggleDarkMode = () => this.isDarkMode.update(v => !v);
  
  addToast(message: string, type: 'success'|'error'|'info' = 'info') {
    const id = Date.now();
    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
    this.toasts.update(toasts => [...toasts, {id, message, type, icon}]);
  }
  
  removeToast(id: number) {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
  
  closeModal() {
    this.openModal.set(null);
    this.selectedTicketForModal.set(null);
    this.selectedMessageForModal.set(null);
  }

  openModalWithTicket(modal: string, ticket: models.Ticket) {
    this.selectedTicketForModal.set(ticket);
    this.openModal.set(modal);
  }

  openSplitModalWithMessage(message: models.Message) {
    this.selectedMessageForModal.set(message);
    this.openModal.set('splitTicket');
  }

  selectTicket(id: number | null) {
    this.selectedTicketId.set(id);
    if(id) {
        this.router.navigate(['/tickets', id]);
    } else {
        this.router.navigate(['/tickets']);
    }
  }

  selectView(view: models.TicketView) {
    this.activeViewId.set(view.id);
    this.activeFilters.set(view.filters);
    this.selectedTicketIds.set([]);
    this.router.navigate(['/tickets']);
  }
  
  hasPermission = (permission: models.Permission): boolean => {
    const role = this.roles().find(r => r.name === this.currentAgent().role);
    return role?.permissions.includes(permission) || false;
  }

  getContact = (contactId: number): models.Contact | undefined => this.contacts().find(c => c.id === contactId);
  getInitials = (name: string) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
  getAvatarBgClass = (name: string) => {
    const colors = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
    const charCodeSum = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[charCodeSum % colors.length];
  }
  getLatestMessageSnippet = (ticket: models.Ticket) => {
    if (ticket.messages.length === 0) return { from: '', snippet: 'No messages yet.' };
    const lastMessage = ticket.messages[ticket.messages.length-1];
    return { from: lastMessage.from, snippet: lastMessage.content };
  }
  getStatusDotClass(status: models.TicketStatus) {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-slate-500';
    }
  }
  noop() {}


  // === EVENT HANDLERS ===
  handleCommandPaletteAction(item: any) {
    this.showCommandPalette.set(false);
    switch (item.type) {
      case 'action':
        if (item.action === 'newTicket') this.openModal.set('newTicket');
        if (item.action === 'toggleDarkMode') this.toggleDarkMode();
        break;
      case 'navigation':
        this.router.navigate([`/${item.view}`]);
        break;
      case 'ticket':
        this.selectTicket(item.id);
        break;
    }
  }

  handleCreateTicket(ticketData: Partial<models.Ticket> & { formValues?: any }) {
    const newTicket: models.Ticket = {
      id: Date.now(),
      subject: ticketData.subject || 'New Ticket',
      contactId: ticketData.contactId!,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      status: 'open',
      priority: 'medium',
      tags: [],
      messages: ticketData.messages || [],
      internalNotes: [],
      activities: [],
      sentiment: 'neutral',
      predictedSatisfaction: null,
      source: 'manual',
      timeTrackedSeconds: 0,
      customFields: ticketData.formValues || {}
    };
    this.tickets.update(t => [newTicket, ...t]);
    this.closeModal();
    this.addToast(`Ticket #${newTicket.id} created`, 'success');
  }

  // FIX: Add missing handler for creating problem tickets from analytics.
  handleCreateProblemTicket(suggestion: models.ProblemSuggestion) {
    const newProblemTicket: models.Ticket = {
      id: Date.now(),
      subject: suggestion.suggestedTitle,
      contactId: this.currentCustomer().id, // Assign to a default/system contact
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      status: 'open',
      priority: 'high',
      tags: ['problem'],
      messages: [{ id: Date.now(), from: 'System', type: 'agent', content: `Problem ticket created to track incidents: #${suggestion.incidentTicketIds.join(', #')}`, timestamp: new Date().toISOString(), attachments: [] }],
      internalNotes: [],
      activities: [],
      sentiment: 'neutral',
      predictedSatisfaction: null,
      source: 'system',
      timeTrackedSeconds: 0,
      childTicketIds: suggestion.incidentTicketIds,
    };

    this.tickets.update(ts => {
      const updatedTickets = ts.map(t => {
        if (suggestion.incidentTicketIds.includes(t.id)) {
          return { ...t, parentId: newProblemTicket.id };
        }
        return t;
      });
      return [newProblemTicket, ...updatedTickets];
    });

    this.addToast(`Problem ticket #${newProblemTicket.id} created`, 'success');
  }

  handleMergeTickets(targetTicketId: number) {
    const sourceTicket = this.selectedTicketForModal()!;
    // Logic to merge source into target, then close modal
    this.closeModal();
    this.addToast(`Ticket #${sourceTicket.id} merged into #${targetTicketId}`, 'success');
  }
  
  handleSplitTicket(newSubject: string) {
    const message = this.selectedMessageForModal()!;
     // Logic to create new ticket with this message
    this.closeModal();
    this.addToast(`New ticket created with subject "${newSubject}"`, 'success');
  }

  handleCsatSubmit(data: { rating: number, comment: string }) {
    this.closeModal();
    this.addToast(`Thank you for your feedback!`, 'success');
  }

  handleLogTime(seconds: number) {
    const ticketId = this.selectedTicketForModal()!.id;
    this.tickets.update(ts => ts.map(t => t.id === ticketId ? { ...t, timeTrackedSeconds: t.timeTrackedSeconds + seconds} : t));
    this.closeModal();
    this.addToast(`Time logged successfully.`, 'success');
  }
  
  handleLinkTicket(childTicketId: number) {
    const parentId = this.selectedTicketForModal()!.id;
    this.tickets.update(ts => ts.map(t => {
      if (t.id === parentId) return { ...t, childTicketIds: [...(t.childTicketIds || []), childTicketId]};
      if (t.id === childTicketId) return { ...t, parentId: parentId };
      return t;
    }));
    this.closeModal();
    this.addToast(`#${childTicketId} linked as a child to #${parentId}.`, 'success');
  }

  handleUpdateTicket(update: Partial<models.Ticket>) {
    const ticketId = this.selectedTicketId();
    if (!ticketId) return;
    this.tickets.update(ts => ts.map(t => t.id === ticketId ? { ...t, ...update, updated: new Date().toISOString() } : t));
  }

  handleAddReply(payload: { ticketId: number; content: string; fromAgent: boolean; attachments: string[] }) {
    this.tickets.update(tickets => tickets.map(t => {
      if (t.id === payload.ticketId) {
        const newMessage: models.Message = {
          id: Date.now(),
          content: payload.content,
          from: payload.fromAgent ? this.currentAgent().name : this.getContact(t.contactId)!.name,
          type: payload.fromAgent ? 'agent' : 'customer',
          timestamp: new Date().toISOString(),
          attachments: payload.attachments
        };
        return { ...t, messages: [...t.messages, newMessage], updated: new Date().toISOString(), status: 'open' };
      }
      return t;
    }));
  }
  
  handleAddNote(payload: {ticketId: number, content: string}) {
    this.tickets.update(tickets => tickets.map(t => {
      if (t.id === payload.ticketId) {
        const newNote: models.InternalNote = {
          id: Date.now(),
          agentName: this.currentAgent().name,
          content: payload.content,
          timestamp: new Date().toISOString()
        };
        return { ...t, internalNotes: [...t.internalNotes, newNote], updated: new Date().toISOString() };
      }
      return t;
    }));
  }
  
  togglePinView(viewId: string) {
    this.ticketViews.update(views => views.map(v => v.id === viewId ? { ...v, isPinned: !v.isPinned } : v));
  }
  
  handleNotificationClick(notification: models.Notification) {
    this.notifications.update(ns => ns.map(n => n.id === notification.id ? { ...n, read: true } : n));
    if (notification.ticketId) {
      this.selectTicket(notification.ticketId);
    }
  }

  // Settings Modal Handlers
  handleSaveRoles(roles: models.Role[]) { this.roles.set(roles); this.addToast('Roles saved', 'success'); }
  handleSaveSsoSettings(settings: models.SsoSettings) { this.ssoSettings.set(settings); this.addToast('SSO settings saved', 'success'); }
  handleSaveAutomationRules(rules: models.AutomationRule[]) { this.automationRules.set(rules); this.addToast('Automation rules saved', 'success'); }
  handleSaveSlaRules(rules: models.SlaRules) { this.slaRules.set(rules); this.addToast('SLA rules saved', 'success'); }
  handleSaveFormTemplates(templates: models.FormTemplate[]) { this.formTemplates.set(templates); this.addToast('Form templates saved', 'success'); }
  handleCreateApiKey(key: models.ApiKey) { this.apiKeys.update(keys => [...keys, key]); }
  handleRevokeApiKey(keyId: string) { this.apiKeys.update(keys => keys.filter(k => k.id !== keyId)); this.addToast('API Key revoked', 'success'); }
  handleSaveWebhooks(hooks: models.Webhook[]) { this.webhooks.set(hooks); this.addToast('Webhooks saved', 'success'); }

  // Other component handlers
  handleKbFeedback(feedback: models.KbFeedback) {
    this.kbArticles.update(articles => articles.map(a => {
      if (a.id === feedback.articleId) {
        if (feedback.vote === 'up') return { ...a, upvotes: a.upvotes + 1 };
        return { ...a, downvotes: a.downvotes + 1 };
      }
      return a;
    }));
    this.addToast('Feedback submitted!', 'success');
  }

  // FIX: Add handler to apply filters from the analytics dashboard.
  handleAnalyticsFilter(conditions: { field: string, operator: models.FilterOperator, value: any }[]) {
    const newFilterGroup: models.TicketFilterGroup = {
      id: `g_${Date.now()}`,
      matchType: 'all',
      conditions: conditions.map((c, i) => ({
        id: `c_${Date.now()}_${i}`,
        ...c
      }))
    };
    
    this.activeFilters.set([newFilterGroup]);
    this.activeViewId.set('custom');
    this.router.navigate(['/tickets']);
    this.addToast('Filters applied from analytics dashboard.', 'info');
  }

  handleConvertToTicket(email: models.MockEmail) { /* ... implementation from old component ... */ }
  handleAcceptChat(chatId: string) { /* ... */ }
  handleSendChatMessage(payload: any) { /* ... */ }
  handleChatConvertToTicket(chat: models.ChatSession) { /* ... */ }
  handleSlackAction(data: any) { /* ... */ }
  handleSocialToTicket(data: any) { /* ... */ }
  handleSaveSalesforceSettings(settings: models.SalesforceSettings) { this.salesforceSettings.set(settings); this.addToast('Salesforce settings saved.', 'success'); }
  handleSaveJiraSettings(settings: models.JiraSettings) { this.jiraSettings.set(settings); this.addToast('Jira settings saved.', 'success'); }
  handleCreateKanbanBoard(event: { title: string, workspaceId: string }) {
    const newBoard: models.KanbanBoard = { id: `board_${Date.now()}`, workspaceId: event.workspaceId, title: event.title, columns: [
      {id: 'l1', title: 'To Do', taskIds: []}, {id: 'l2', title: 'In Progress', taskIds: []}, {id: 'l3', title: 'Done', taskIds: []}
    ]};
    this.kanbanBoards.update(b => [...b, newBoard]);
    this.kanbanWorkspaces.update(ws => ws.map(w => w.id === event.workspaceId ? {...w, boardIds: [...w.boardIds, newBoard.id]} : w));
    this.closeModal();
    this.addToast(`Board "${event.title}" created.`, 'success');
  }

  handleKanbanCardUpdate(updatedCard: models.KanbanTask) {
    this.kanbanTasks.update(tasks => ({ ...tasks, [updatedCard.id]: updatedCard }));
    this.addToast(`Card "${updatedCard.title}" updated`, 'success');
  }

  handleKanbanCardComment(payload: { cardId: string, comment: models.KanbanComment }) {
    this.kanbanTasks.update(tasks => {
        const card = tasks[payload.cardId];
        if (card) {
            const newComments = [...(card.comments || []), payload.comment];
            return { ...tasks, [payload.cardId]: { ...card, comments: newComments } };
        }
        return tasks;
    });
  }

  // FIX: Add missing handlers for Kanban drag-and-drop functionality.
  updateKanbanColumnTasks(boardId: string, columnId: string, taskIds: string[]) {
    this.kanbanBoards.update(boards => boards.map(board => {
      if (board.id === boardId) {
        const newColumns = board.columns.map(col => {
          if (col.id === columnId) {
            return { ...col, taskIds };
          }
          return col;
        });
        return { ...board, columns: newColumns };
      }
      return board;
    }));

    this.kanbanTasks.update(tasks => {
        const newTasks = { ...tasks };
        taskIds.forEach((taskId, index) => {
            if (newTasks[taskId]) {
                newTasks[taskId] = { ...newTasks[taskId], order: index };
            }
        });
        return newTasks;
    });
  }

  moveKanbanTask(boardId: string, sourceColumnId: string, targetColumnId: string, sourceTaskIds: string[], targetTaskIds: string[]) {
    this.kanbanBoards.update(boards => boards.map(board => {
      if (board.id === boardId) {
        const newColumns = board.columns.map(col => {
          if (col.id === sourceColumnId) {
            return { ...col, taskIds: sourceTaskIds };
          }
          if (col.id === targetColumnId) {
            return { ...col, taskIds: targetTaskIds };
          }
          return col;
        });
        return { ...board, columns: newColumns };
      }
      return board;
    }));
    
    this.kanbanTasks.update(tasks => {
        const newTasks = { ...tasks };
        sourceTaskIds.forEach((taskId, index) => {
            if (newTasks[taskId]) {
                newTasks[taskId] = { ...newTasks[taskId], order: index };
            }
        });
        targetTaskIds.forEach((taskId, index) => {
            if (newTasks[taskId]) {
                newTasks[taskId] = { ...newTasks[taskId], order: index };
            }
        });
        return newTasks;
    });
  }
}