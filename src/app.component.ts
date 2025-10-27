import { Component, ChangeDetectionStrategy, signal, computed, effect, HostListener, Injectable, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';

import * as models from './models';
import * as D from './mock-data';

import { IconComponent } from './components/icon/icon.component';
import { NewTicketModalComponent } from './components/new-ticket-modal/new-ticket-modal.component';
import { MergeTicketModalComponent } from './components/merge-ticket-modal/merge-ticket-modal.component';
import { SplitTicketModalComponent } from './components/split-ticket-modal/split-ticket-modal.component';
import { LogTimeModalComponent } from './components/log-time-modal/log-time-modal.component';
import { LinkTicketModalComponent } from './components/link-ticket-modal/link-ticket-modal.component';
import { CsatModalComponent } from './components/csat-modal/csat-modal.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { KeyboardShortcutsModalComponent } from './components/keyboard-shortcuts-modal/keyboard-shortcuts-modal.component';
import { CommandPaletteComponent } from './components/command-palette/command-palette.component';
import { ChatWidgetComponent } from './components/chat-widget/chat-widget.component';
import { NewKanbanBoardModalComponent } from './components/new-kanban-board-modal/new-kanban-board-modal.component';

type ModalType = 'newTicket' | 'mergeTicket' | 'splitTicket' | 'logTime' | 'linkTicket' | 'csat' | 'settings' | 'shortcuts' | 'command' | 'saveView' | 'newKanbanBoard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    IconComponent,
    NewTicketModalComponent,
    MergeTicketModalComponent,
    SplitTicketModalComponent,
    LogTimeModalComponent,
    LinkTicketModalComponent,
    CsatModalComponent,
    SettingsModalComponent,
    KeyboardShortcutsModalComponent,
    CommandPaletteComponent,
    ChatWidgetComponent,
    NewKanbanBoardModalComponent,
  ],
})
export class AppComponent {
  // === GLOBAL APP STATE (SIGNALS) ===

  // Core Data
  tickets = signal<models.Ticket[]>(D.mockTickets);
  contacts = signal<models.Contact[]>(D.mockContacts);
  organizations = signal<models.Organization[]>(D.mockOrganizations);
  agents = signal<models.Agent[]>(D.mockAgents);
  groups = signal<models.Group[]>(D.mockGroups);
  customFieldDefs = signal<models.CustomFieldDefinition[]>(D.mockCustomFieldDefinitions);
  slaRules = signal<models.SlaRules>(D.mockSlaRules);
  automationRules = signal<models.AutomationRule[]>(D.mockAutomationRules);
  kbArticles = signal<models.KnowledgeBaseArticle[]>(D.mockKnowledgeBaseArticles);
  kbCategories = signal<models.KnowledgeBaseCategory[]>(D.mockKnowledgeBaseCategories);
  formTemplates = signal<models.FormTemplate[]>(D.mockFormTemplates);
  analyticsData = signal<models.AnalyticsData>(D.mockAnalyticsData);
  emails = signal<models.MockEmail[]>(D.mockEmails);
  chatSessions = signal<models.ChatSession[]>(D.mockChatSessions);
  slackMessages = signal<models.SlackMessage[]>(D.mockSlackMessages);
  slackSettings = signal<models.SlackSettings>(D.mockSlackSettings);
  wallboardData = signal<models.WallboardData>(D.mockWallboardData);
  qaRubrics = signal<models.QARubric[]>(D.mockQARubrics);
  qaReviews = signal<models.QAReview[]>(D.mockQAReviews);
  roles = signal<models.Role[]>(D.mockRoles);
  allPermissions = signal<models.Permission[]>(D.mockPermissions);
  ssoSettings = signal<models.SsoSettings>(D.mockSsoSettings);
  auditLog = signal<models.AuditLogEntry[]>(D.mockAuditLog);
  facebookThreads = signal<models.FacebookThread[]>(D.mockFacebookThreads);
  twitterThreads = signal<models.TwitterThread[]>(D.mockTwitterThreads);
  whatsAppThreads = signal<models.WhatsAppThread[]>(D.mockWhatsAppThreads);
  apiKeys = signal<models.ApiKey[]>(D.mockApiKeys);
  webhooks = signal<models.Webhook[]>(D.mockWebhooks);
  salesforceSettings = signal<models.SalesforceSettings>(D.mockSalesforceSettings);
  jiraSettings = signal<models.JiraSettings>(D.mockJiraSettings);
  kanbanWorkspaces = signal<models.KanbanWorkspace[]>(D.mockKanbanWorkspaces);
  kanbanBoards = signal<models.KanbanBoard[]>(D.mockKanbanBoards);
  kanbanLists = signal<models.KanbanList[]>(D.mockKanbanLists);
  kanbanCards = signal<models.KanbanCard[]>(D.mockKanbanCards);
  ticketViews = signal<models.TicketView[]>(D.mockTicketViews);
  notifications = signal<models.Notification[]>(D.mockNotifications);
  toasts = signal<models.Toast[]>([]);
  availableTags = signal<string[]>(['login', 'billing', 'bug', 'feature-request', 'tech-support', 'api', 'shipping']);

  // UI State
  isSidebarCollapsed = signal(false);
  isDarkMode = signal(false);
  openModal = signal<ModalType | null>(null);
  modalContext = signal<any>(null); // For passing data to modals
  searchQuery = signal('');
  showCommandPalette = signal(false);
  showLanguageMenu = signal(false);
  showNotifications = signal(false);
  currentLanguage = signal<'en' | 'es' | 'fr'>('en');
  
  // Ticket View State
  defaultViewId = signal(localStorage.getItem('bolddesk_default_view') || 'all');
  activeViewId = signal(this.defaultViewId());
  activeFilters = signal<models.TicketFilters>([]);
  selectedTicketId = signal<number | null>(null);
  selectedTicketIds = signal<number[]>([]);

  // User/Session State
  currentAgent = signal<models.Agent>(D.mockAgents[0]);
  currentCustomer = signal<models.Contact>(D.mockContacts[0]);
  
  // Derived State (Computed Signals)
  activeView = computed(() => this.ticketViews().find(v => v.id === this.activeViewId()) || this.ticketViews()[0]);
  unreadNotifications = computed(() => this.notifications().filter(n => !n.read));
  unreadNotificationsCount = computed(() => this.unreadNotifications().length);
  pinnedViews = computed(() => this.ticketViews().filter(v => v.isPinned));
  selectedTicketForModal = computed(() => this.modalContext()?.ticket as models.Ticket | undefined);
  selectedMessageForModal = computed(() => this.modalContext()?.message as models.Message | undefined);
  
  // For portal view
  customerPortalTickets = computed(() => {
    const customer = this.currentCustomer();
    return this.tickets().filter(t => t.contactId === customer.id);
  });
  
  // Router state
  currentRoute = signal('');
  ticketsRouteOptions = { exact: false };

  // i18n
  translationsMap = {
    en: { newTicket: 'New Ticket', myInbox: 'My Inbox', tickets: 'Tickets', analytics: 'Analytics', knowledgeBase: 'Knowledge Base', customers: 'Customers', reports: 'Reports', qualityAssurance: 'Quality Assurance', wallboard: 'Wallboard', kanban: 'Kanban', channels: 'Channels', inbox: 'Inbox', liveChat: 'Live Chat', slack: 'Slack', facebook: 'Facebook', twitter: 'Twitter', whatsapp: 'WhatsApp', integrations: 'Integrations', salesforce: 'Salesforce', jira: 'Jira', customerPortal: 'Customer Portal', devPlan: 'Dev Plan' },
    es: { newTicket: 'Nuevo Ticket', myInbox: 'Mi Bandeja', tickets: 'Tickets', analytics: 'Analítica', knowledgeBase: 'Base de Conocimiento', customers: 'Clientes', reports: 'Informes', qualityAssurance: 'Control de Calidad', wallboard: 'Wallboard', kanban: 'Kanban', channels: 'Canales', inbox: 'Bandeja de Entrada', liveChat: 'Chat en Vivo', slack: 'Slack', facebook: 'Facebook', twitter: 'Twitter', whatsapp: 'WhatsApp', integrations: 'Integraciones', salesforce: 'Salesforce', jira: 'Jira', customerPortal: 'Portal del Cliente', devPlan: 'Plan de Desarrollo' },
    fr: { newTicket: 'Nouveau Ticket', myInbox: 'Ma Réception', tickets: 'Tickets', analytics: 'Analytique', knowledgeBase: 'Base de Connaissances', customers: 'Clients', reports: 'Rapports', qualityAssurance: 'Assurance Qualité', wallboard: 'Wallboard', kanban: 'Kanban', channels: 'Canaux', inbox: 'Boîte de Réception', liveChat: 'Chat en Direct', slack: 'Slack', facebook: 'Facebook', twitter: 'Twitter', whatsapp: 'WhatsApp', integrations: 'Intégrations', salesforce: 'Salesforce', jira: 'Jira', customerPortal: 'Portail Client', devPlan: 'Plan de Dév' },
  };
  translations = computed(() => this.translationsMap[this.currentLanguage()]);

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute.set(event.urlAfterRedirects);
      }
    });

    effect(() => {
        const view = this.activeView();
        this.activeFilters.set(view.filters);
    });
  }

  // === EVENT HANDLERS / ACTIONS ===

  // --- App Shell ---
  toggleSidebar = () => this.isSidebarCollapsed.update(v => !v);
  toggleDarkMode = () => {
    this.isDarkMode.update(v => !v);
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  @HostListener('document:keydown.meta.k', ['$event'])
  @HostListener('document:keydown.control.k', ['$event'])
  openCommandPalette(event: KeyboardEvent) {
    event.preventDefault();
    this.showCommandPalette.set(true);
  }

  // --- Toast Notifications ---
  addToast(message: string, type: models.Toast['type'], duration: number = 3000) {
    const id = Date.now();
    const iconMap = { success: 'check-circle', info: 'alert-circle', error: 'x-circle' };
    const newToast: models.Toast = { id, message, type, icon: iconMap[type] };
    this.toasts.update(toasts => [...toasts, newToast]);
    setTimeout(() => this.removeToast(id), duration);
  }
  removeToast = (id: number) => this.toasts.update(toasts => toasts.filter(t => t.id !== id));

  // --- Modal Management ---
  closeModal = () => {
    this.openModal.set(null);
    this.modalContext.set(null);
  };
  
  openModalWithTicket(modal: ModalType, ticket: models.Ticket) {
    this.modalContext.set({ ticket });
    this.openModal.set(modal);
  }
  
  openSplitModalWithMessage(message: models.Message) {
    this.modalContext.set({ message });
    this.openModal.set('splitTicket');
  }

  handleCommandPaletteAction(item: any) {
    switch(item.type) {
      case 'action':
        if(item.action === 'newTicket') this.openModal.set('newTicket');
        if(item.action === 'toggleDarkMode') this.toggleDarkMode();
        break;
      case 'navigation':
        this.router.navigate([item.view]);
        break;
      case 'ticket':
        this.selectTicket(item.id);
        break;
      case 'contact':
        this.router.navigate(['/customers']);
        break;
      case 'kb':
        this.router.navigate(['/kb']);
        break;
    }
    this.showCommandPalette.set(false);
  }

  handleNotificationClick(notification: models.Notification) {
    this.notifications.update(n => n.map(notif => notif.id === notification.id ? {...notif, read: true} : notif));
    if (notification.ticketId) {
      this.selectTicket(notification.ticketId);
    }
    this.showNotifications.set(false);
  }
  
  // --- Ticket Management ---
  selectTicket = (ticketId: number | null) => {
    this.selectedTicketId.set(ticketId);
    this.router.navigate(['/tickets', ticketId]);
  };
  
  handleUpdateTicket = (update: Partial<models.Ticket>) => {
    const ticketId = this.selectedTicketId();
    if (!ticketId) return;
    this.tickets.update(tickets => tickets.map(t => t.id === ticketId ? {...t, ...update} : t));
    this.addToast('Ticket updated', 'success');
  };

  handleAddReply = (data: { ticketId: number, content: string, fromAgent: boolean, attachments: string[] }) => {
    const from = data.fromAgent ? this.currentAgent().name : this.getContact(this.tickets().find(t => t.id === data.ticketId)?.contactId || 0)?.name || 'Customer';
    const type = data.fromAgent ? 'agent' : 'customer';

    const newMessage: models.Message = {
        from, type, content: data.content, timestamp: new Date().toISOString(), attachments: data.attachments,
    };

    this.tickets.update(tickets => 
        tickets.map(t => t.id === data.ticketId ? { ...t, messages: [...t.messages, newMessage] } : t)
    );
  };

  handleAddNote = (data: { ticketId: number, content: string }) => {
    const newNote: models.InternalNote = {
        agentName: this.currentAgent().name, content: data.content, timestamp: new Date().toISOString(),
    };
    this.tickets.update(tickets => 
        tickets.map(t => t.id === data.ticketId ? { ...t, internalNotes: [...t.internalNotes, newNote] } : t)
    );
  };
  
  handleCreateProblemTicket(suggestion: models.ProblemSuggestion) {
      const newProblemTicket: models.Ticket = {
          id: Date.now(), subject: `[Problem] ${suggestion.suggestedTitle}`, contactId: this.currentAgent().id, assignedTo: this.currentAgent().name,
          created: new Date().toISOString(), status: 'open', priority: 'high', tags: ['problem'],
          messages: [{ from: 'System', type: 'agent', content: `Problem ticket created to track incidents: ${suggestion.incidentTicketIds.join(', ')}`, timestamp: new Date().toISOString(), attachments: [] }],
          internalNotes: [], activities: [], timeTrackedSeconds: 0, childTicketIds: suggestion.incidentTicketIds, source: 'api'
      };
      this.tickets.update(tickets => [newProblemTicket, ...tickets]);
      this.tickets.update(tickets => tickets.map(t => suggestion.incidentTicketIds.includes(t.id) ? {...t, parentId: newProblemTicket.id } : t));
      this.addToast('Problem ticket created', 'success');
  }
  
  handleAnalyticsFilter(conditions: any[]) {
      const filters: models.TicketFilters = [{
          id: `g_${Date.now()}`, matchType: 'all', conditions: conditions.map(c => ({...c, id: `c_${Date.now()}`}))
      }];
      this.activeFilters.set(filters);
      this.activeViewId.set('custom');
      this.router.navigate(['/tickets']);
  }
  
  handleConvertToTicket(email: models.MockEmail) {
    const contact = this.contacts().find(c => c.email.toLowerCase() === email.from.toLowerCase());
    const newTicket: models.Ticket = {
      id: Date.now(), subject: email.subject, contactId: contact?.id || 1, created: new Date().toISOString(), status: 'open', priority: 'medium', tags: ['email-support'],
      messages: [{ from: email.from, type: 'customer', content: email.body, timestamp: email.receivedAt, attachments: [] }],
      internalNotes: [], activities: [], timeTrackedSeconds: 0, source: 'email'
    };
    this.tickets.update(t => [newTicket, ...t]);
    this.emails.update(emails => emails.map(e => e.id === email.id ? {...e, status: 'ticket_created', ticketId: newTicket.id} : e));
    this.addToast(`Ticket #${newTicket.id} created from email.`, 'success');
    this.selectTicket(newTicket.id);
  }

  // --- View Management ---
  selectView(view: models.TicketView) {
    this.activeViewId.set(view.id);
    this.activeFilters.set(view.filters);
  }
  
  togglePinView(viewId: string) {
    this.ticketViews.update(views => views.map(v => v.id === viewId ? {...v, isPinned: !v.isPinned} : v));
  }

  // --- Modal Handlers ---
  handleCreateTicket(data: Partial<models.Ticket> & { formValues?: any }) {
    const newTicket: models.Ticket = {
      id: Date.now(), subject: data.subject || 'No Subject', contactId: data.contactId!, created: new Date().toISOString(), status: 'open',
      priority: data.priority || 'medium', tags: data.tags || [], messages: data.messages || [], internalNotes: [],
      activities: [{ type: 'created', user: this.getContact(data.contactId!)?.name || 'Customer', timestamp: new Date().toISOString(), details: 'Ticket created.' }],
      timeTrackedSeconds: 0, source: 'portal', formValues: data.formValues,
    };
    this.tickets.update(t => [newTicket, ...t]);
    this.addToast(`Ticket #${newTicket.id} created`, 'success');
    this.closeModal();
    this.selectTicket(newTicket.id);
  }

  handleMergeTickets(targetTicketId: number) {
    const sourceTicket = this.selectedTicketForModal();
    if (!sourceTicket) return;

    this.tickets.update(tickets => {
      const targetTicket = tickets.find(t => t.id === targetTicketId);
      if (!targetTicket) return tickets;
      
      const mergedMessages = [...targetTicket.messages, ...sourceTicket.messages].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      return tickets
        .map(t => t.id === targetTicketId ? { ...t, messages: mergedMessages } : t)
        .map(t => t.id === sourceTicket.id ? { ...t, status: 'closed' as 'closed', tags: [...t.tags, 'merged'] } : t);
    });
    this.addToast(`Ticket #${sourceTicket.id} merged into #${targetTicketId}.`, 'success');
    this.closeModal();
    this.selectTicket(targetTicketId);
  }

  handleSplitTicket(newSubject: string) {
    const message = this.selectedMessageForModal();
    const sourceTicket = this.selectedTicketForModal();
    if (!message || !sourceTicket) return;

    const newTicket: models.Ticket = {
      id: Date.now(), subject: newSubject, contactId: sourceTicket.contactId, created: new Date().toISOString(), status: 'open', priority: 'medium', tags: [],
      messages: [message], internalNotes: [], activities: [], timeTrackedSeconds: 0, source: sourceTicket.source
    };
    
    this.tickets.update(t => [newTicket, ...t]);
    this.tickets.update(tickets => tickets.map(t => t.id === sourceTicket.id ? { ...t, messages: t.messages.filter(m => m.timestamp !== message.timestamp) } : t));
    
    this.addToast(`Ticket #${newTicket.id} created from split.`, 'success');
    this.closeModal();
    this.selectTicket(newTicket.id);
  }

  handleLogTime(seconds: number) {
    const ticket = this.selectedTicketForModal();
    if (!ticket) return;
    this.tickets.update(tickets => tickets.map(t => t.id === ticket.id ? { ...t, timeTrackedSeconds: t.timeTrackedSeconds + seconds } : t));
    this.addToast('Time logged successfully.', 'success');
    this.closeModal();
  }

  handleLinkTicket(childTicketId: number) {
    const parentTicket = this.selectedTicketForModal();
    if (!parentTicket) return;
    this.tickets.update(tickets => tickets.map(t => t.id === parentTicket.id ? { ...t, childTicketIds: [...(t.childTicketIds || []), childTicketId] } : t));
    this.tickets.update(tickets => tickets.map(t => t.id === childTicketId ? { ...t, parentId: parentTicket.id } : t));
    this.addToast(`Ticket #${childTicketId} linked as child.`, 'success');
    this.closeModal();
  }

  handleCsatSubmit(data: { rating: number; comment: string }) {
    const ticket = this.selectedTicketForModal();
    if (!ticket) return;
    this.tickets.update(tickets => tickets.map(t => t.id === ticket.id ? { ...t, satisfactionRating: data.rating, satisfactionComment: data.comment } : t));
    this.addToast('Thank you for your feedback!', 'success');
    this.closeModal();
  }

  handleSaveRoles(roles: models.Role[]) { this.roles.set(roles); this.addToast('Roles saved', 'success'); }
  handleSaveSsoSettings(settings: models.SsoSettings) { this.ssoSettings.set(settings); this.addToast('SSO settings saved', 'success'); }
  handleSaveAutomationRules(rules: models.AutomationRule[]) { this.automationRules.set(rules); this.addToast('Automation rules saved', 'success'); }
  handleSaveSlaRules(rules: models.SlaRules) { this.slaRules.set(rules); this.addToast('SLA rules saved', 'success'); }
  handleSaveFormTemplates(templates: models.FormTemplate[]) { this.formTemplates.set(templates); this.addToast('Form templates saved', 'success'); }
  handleCreateApiKey(key: models.ApiKey) { this.apiKeys.update(k => [...k, key]); }
  handleRevokeApiKey(keyId: string) { this.apiKeys.update(k => k.filter(key => key.id !== keyId)); this.addToast('API Key revoked', 'success');}
  handleSaveWebhooks(hooks: models.Webhook[]) { this.webhooks.set(hooks); this.addToast('Webhooks saved', 'success'); }
  handleCreateKanbanBoard(data: { title: string; workspaceId: string }) {
    const newBoard: models.KanbanBoard = {
      id: `board_${Date.now()}`, title: data.title, workspaceId: data.workspaceId, lists: []
    };
    this.kanbanBoards.update(boards => [...boards, newBoard]);
    this.addToast(`Board "${data.title}" created.`, 'success');
    this.closeModal();
  }

  // --- Getters & Helpers ---
  getContact = (id: number) => this.contacts().find(c => c.id === id);
  getOrganization = (id: number) => this.organizations().find(o => o.id === id);
  hasPermission = (permission: models.Permission) => {
    const roleId = this.currentAgent().roleId;
    const role = this.roles().find(r => r.id === roleId);
    return role?.permissions.includes(permission) || false;
  };

  getStatusDotClass(status: models.Ticket['status']): string {
    return {
      open: 'bg-blue-500',
      pending: 'bg-yellow-500',
      resolved: 'bg-green-500',
      closed: 'bg-slate-500'
    }[status] || 'bg-slate-500';
  }

  getAvatarBgClass(name: string): string {
    const colors = ['bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300', 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300', 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300', 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', 'bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-300'];
    const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  }

  getInitials(name: string): string {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
  }

  getLatestMessageSnippet(ticket: models.Ticket): { from: string; snippet: string } {
    if (!ticket.messages || ticket.messages.length === 0) {
      return { from: 'System', snippet: 'Ticket created.'};
    }
    const lastMessage = ticket.messages[ticket.messages.length-1];
    return { from: lastMessage.from, snippet: lastMessage.content };
  }
  
  // --- Customer Portal Actions ---
  handleKbFeedback = (feedback: models.KbFeedback) => {
    this.kbArticles.update(articles => articles.map(a => {
      if (a.id === feedback.articleId) {
        return {
          ...a,
          upvotes: feedback.vote === 'up' ? a.upvotes + 1 : a.upvotes,
          downvotes: feedback.vote === 'down' ? a.downvotes + 1 : a.downvotes,
        };
      }
      return a;
    }));
    this.addToast('Thanks for your feedback!', 'success');
  }
  
  // --- Chat Actions ---
  handleAcceptChat(chatId: string) {
    this.chatSessions.update(sessions => sessions.map(s => s.id === chatId ? {...s, status: 'active', agentId: this.currentAgent().id} : s));
  }
  
  handleSendChatMessage(data: { chatId: string, content: string, from: 'agent' | 'customer'}) {
    this.chatSessions.update(sessions => sessions.map(s => {
      if (s.id === data.chatId) {
        const name = data.from === 'agent' ? this.currentAgent().name : s.customerName;
        const newTranscript = [...s.transcript, { sender: data.from, name, content: data.content, timestamp: new Date().toISOString() }];
        return {...s, transcript: newTranscript};
      }
      return s;
    }));
  }
  
  handleChatConvertToTicket(chat: models.ChatSession) {
    const contact = this.contacts().find(c => c.email === chat.customerEmail);
    if (!contact) {
      this.addToast('Could not find a matching contact to create ticket.', 'error');
      return;
    }

    const transcript = chat.transcript.map(t => `${t.name}: ${t.content}`).join('\n');
    const newTicket: models.Ticket = {
      id: Date.now(), subject: `Chat with ${chat.customerName}`, contactId: contact.id, assignedTo: this.agents().find(a => a.id === chat.agentId)?.name,
      created: chat.createdAt, status: 'open', priority: 'medium', tags: ['chat-support'],
      messages: [{ from: chat.customerName, type: 'customer', content: transcript, timestamp: chat.createdAt, attachments: [] }],
      internalNotes: [], activities: [], timeTrackedSeconds: 0, source: 'chat',
    };
    this.tickets.update(t => [newTicket, ...t]);
    this.chatSessions.update(sessions => sessions.map(s => s.id === chat.id ? {...s, status: 'ended'} : s));
    this.addToast(`Ticket #${newTicket.id} created from chat.`, 'success');
  }
  
  // --- Social Media Actions ---
  handleSocialToTicket(data: { source: 'facebook' | 'twitter' | 'whatsapp', thread: any }) {
    const contactName = data.thread.customerName;
    const contact = this.contacts().find(c => c.name === contactName);
    if (!contact) {
        this.addToast(`Contact "${contactName}" not found.`, 'error');
        return;
    }

    const newTicket: models.Ticket = {
        id: Date.now(), subject: `${data.source.charAt(0).toUpperCase() + data.source.slice(1)} conversation with ${contactName}`,
        contactId: contact.id, created: data.thread.updatedAt, status: 'open', priority: 'medium', tags: [data.source],
        messages: data.thread.messages.map((m: any) => ({
            from: m.sender === 'customer' ? contactName : 'Agent', type: m.sender, content: m.content, timestamp: m.timestamp, attachments: [],
        })),
        internalNotes: [], activities: [], timeTrackedSeconds: 0, source: data.source,
    };
    this.tickets.update(t => [newTicket, ...t]);
    
    const updateSignal = (signal: WritableSignal<any[]>) => {
        signal.update(threads => threads.map(th => th.id === data.thread.id ? {...th, status: 'ticket_created', linkedTicketId: newTicket.id} : th));
    }

    if (data.source === 'facebook') updateSignal(this.facebookThreads);
    if (data.source === 'twitter') updateSignal(this.twitterThreads);
    if (data.source === 'whatsapp') updateSignal(this.whatsAppThreads);
    
    this.addToast(`Ticket #${newTicket.id} created from ${data.source}.`, 'success');
  }
  
  // --- Slack Actions ---
  handleSlackAction(data: { message: models.SlackMessage, action: 'createTicket' | 'addReply' }) {
    if (data.action === 'createTicket') {
        const contact = this.contacts().find(c => c.name === data.message.user);
        if(!contact) {
            this.addToast('Cannot create ticket: Slack user not found in contacts.', 'error');
            return;
        }
        const newTicket: models.Ticket = {
            id: Date.now(), subject: `Slack request from #${data.message.channel}`, contactId: contact.id,
            created: new Date(parseInt(data.message.timestamp.split('.')[0]) * 1000).toISOString(), status: 'open', priority: 'medium', tags: ['slack'],
            messages: [{ from: data.message.user, type: 'customer', content: data.message.text, timestamp: new Date(parseInt(data.message.timestamp.split('.')[0]) * 1000).toISOString(), attachments: [] }],
            internalNotes: [], activities: [], timeTrackedSeconds: 0, source: 'slack',
        };
        this.tickets.update(t => [newTicket, ...t]);
        this.slackMessages.update(msgs => msgs.map(m => m.id === data.message.id ? {...m, status: 'ticket_created', linkedTicketId: newTicket.id} : m));
        this.addToast(`Ticket #${newTicket.id} created from Slack.`, 'success');
    }
  }

  // --- Settings ---
  handleSaveSalesforceSettings(settings: models.SalesforceSettings) {
    this.salesforceSettings.set(settings);
  }

  handleSaveJiraSettings(settings: models.JiraSettings) {
    this.jiraSettings.set(settings);
  }
}