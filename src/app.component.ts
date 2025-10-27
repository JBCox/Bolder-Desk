import { Component, ChangeDetectionStrategy, signal, computed, effect, inject, HostListener } from '@angular/core';
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
import { FacebookIntegrationComponent } from './components/facebook-integration/facebook-integration.component';
import { TwitterIntegrationComponent } from './components/twitter-integration/twitter-integration.component';
import { WhatsAppIntegrationComponent } from './components/whatsapp-integration/whatsapp-integration.component';
import { DeveloperSettingsComponent } from './components/developer-settings/developer-settings.component';
import { SalesforceIntegrationComponent } from './components/salesforce-integration/salesforce-integration.component';
import { JiraIntegrationComponent } from './components/jira-integration/jira-integration.component';
import { KanbanComponent } from './components/kanban/kanban.component';
import { NewKanbanBoardModalComponent } from './components/new-kanban-board-modal/new-kanban-board-modal.component';
import { MyInboxComponent } from './components/my-inbox/my-inbox.component';
import { CommandPaletteComponent } from './components/command-palette/command-palette.component';
import { GeminiService } from './gemini.service';


type View = 'tickets' | 'analytics' | 'kb' | 'customers' | 'inbox' | 'chat' | 'reports' | 'slack' | 'qa' | 'wallboard' | 'devplan' | 'portal' | 'facebook' | 'twitter' | 'whatsapp' | 'salesforce' | 'jira' | 'kanban' | 'my-inbox';
type Modal = 'newTicket' | 'mergeTicket' | 'splitTicket' | 'csat' | 'settings' | 'logTime' | 'linkTicket' | 'shortcuts' | 'newKanbanBoard' | 'saveView';

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
    FacebookIntegrationComponent,
    TwitterIntegrationComponent,
    WhatsAppIntegrationComponent,
    DeveloperSettingsComponent,
    SalesforceIntegrationComponent,
    JiraIntegrationComponent,
    KanbanComponent,
    NewKanbanBoardModalComponent,
    MyInboxComponent,
    CommandPaletteComponent,
  ],
})
export class AppComponent {
  private geminiService = inject(GeminiService);
  private readonly DEFAULT_VIEW_LS_KEY = 'bolddesk_default_view';
  private readonly PINNED_VIEWS_LS_KEY = 'bolddesk_pinned_views';

  // === STATE SIGNALS ===
  currentView = signal<View>('my-inbox');
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
  facebookThreads = signal<models.FacebookThread[]>(MOCK_DATA.facebookThreads);
  twitterThreads = signal<models.TwitterThread[]>(MOCK_DATA.twitterThreads);
  whatsAppThreads = signal<models.WhatsAppThread[]>(MOCK_DATA.whatsAppThreads);
  qaRubrics = signal<models.QARubric[]>(MOCK_DATA.qaRubrics);
  qaReviews = signal<models.QAReview[]>(MOCK_DATA.qaReviews);
  roles = signal<models.Role[]>(MOCK_DATA.roles);
  ssoSettings = signal<models.SsoSettings>(MOCK_DATA.ssoSettings);
  apiKeys = signal<models.ApiKey[]>(MOCK_DATA.apiKeys);
  webhooks = signal<models.Webhook[]>(MOCK_DATA.webhooks);
  salesforceSettings = signal<models.SalesforceSettings>(MOCK_DATA.salesforceSettings);
  jiraSettings = signal<models.JiraSettings>(MOCK_DATA.jiraSettings);
  kanbanWorkspaces = signal<models.KanbanWorkspace[]>(MOCK_DATA.kanbanWorkspaces);
  kanbanBoards = signal<models.KanbanBoard[]>(MOCK_DATA.kanbanBoards);
  allPermissions = signal<models.Permission[]>(['ticket:merge', 'view:tickets', 'edit:tickets', 'delete:tickets', 'view:customers', 'edit:customers', 'view:reports', 'view:settings', 'manage:agents', 'manage:billing']);
  auditLog = signal<models.AuditLogEntry[]>([]);
  ticketViews = signal<models.TicketView[]>(this.loadViews());
  notifications = signal<models.Notification[]>(MOCK_DATA.notifications || []);
  
  // UI State
  selectedTicketId = signal<number | null>(null);
  selectedTicketForModal = signal<models.Ticket | null>(null);
  selectedMessageForModal = signal<models.Message | null>(null);
  selectedTicketIds = signal<number[]>([]);
  searchQuery = signal('');
  sidebarCollapsed = signal(false);
  isDarkMode = signal(false);
  showLanguageMenu = signal(false);
  currentLanguage = signal<'en' | 'es' | 'fr'>('en');
  toasts = signal<models.Toast[]>([]);
  showNotifications = signal(false);
  showCommandPalette = signal(false);

  // Advanced filter & view state
  showFilterPanel = signal(false);
  activeFilters = signal<models.TicketFilters>([]);
  panelFilters = signal<models.TicketFilters>([]); // Temporary state for the panel
  activeViewId = signal<string>('all');
  newViewName = signal('');
  newViewVisibility = signal<'private' | 'shared'>('private');
  newViewSharedGroups = signal<number[]>([]);
  tempViewOptions = signal<models.TicketView['displayOptions'] | null>(null);
  isEditingView = signal(false);
  showViewsDropdown = signal(false);
  showViewActions = signal(false);
  defaultViewId = signal<string>(localStorage.getItem(this.DEFAULT_VIEW_LS_KEY) || 'all');
  editingCell = signal<{ ticketId: number, columnId: string } | null>(null);
  
  // Hardcoded current user/customer for portal/widget views
  currentAgent = signal(this.agents()[0]);
  currentCustomer = signal(this.contacts()[0]);
  currentChatSession = computed(() => this.chatSessions().find(c => c.customerEmail === this.currentCustomer().email && c.status !== 'ended') || null);

  @HostListener('document:keydown.meta.k', ['$event'])
  onMacCommandK(event: KeyboardEvent) {
    event.preventDefault();
    this.showCommandPalette.update(v => !v);
  }

  @HostListener('document:keydown.control.k', ['$event'])
  onCtrlK(event: KeyboardEvent) {
    event.preventDefault();
    this.showCommandPalette.update(v => !v);
  }

  constructor() {
    this.selectView(this.defaultViewId()); // Load default view on init
  }

  // === COMPUTED SIGNALS ===
  translations = computed(() => {
    const lang = this.currentLanguage();
    const map = {
        en: { tickets: 'Tickets', analytics: 'Analytics', knowledgeBase: 'Knowledge Base', customers: 'Customers', reports: 'Reports', qualityAssurance: 'Quality Assurance', wallboard: 'Wallboard', kanban: 'Kanban', channels: 'Channels', inbox: 'Inbox', liveChat: 'Live Chat', slack: 'Slack', facebook: 'Facebook', twitter: 'Twitter', whatsapp: 'WhatsApp', integrations: 'Integrations', salesforce: 'Salesforce', jira: 'Jira', devPlan: 'Dev Plan', customerPortal: 'Customer Portal', newTicket: 'New Ticket', myInbox: 'My Inbox' },
        es: { tickets: 'Tiquetes', analytics: 'Analítica', knowledgeBase: 'Base de Conocimiento', customers: 'Clientes', reports: 'Informes', qualityAssurance: 'Seguro de Calidad', wallboard: 'Panel de Control', kanban: 'Kanban', channels: 'Canales', inbox: 'Bandeja de entrada', liveChat: 'Chat en Vivo', slack: 'Slack', facebook: 'Facebook', twitter: 'Twitter', whatsapp: 'WhatsApp', integrations: 'Integraciones', salesforce: 'Salesforce', jira: 'Jira', devPlan: 'Plan de Desarrollo', customerPortal: 'Portal del Cliente', newTicket: 'Nuevo Tiquete', myInbox: 'Mi Buzón' },
        fr: { tickets: 'Billets', analytics: 'Analytique', knowledgeBase: 'Base de Connaissances', customers: 'Clients', reports: 'Rapports', qualityAssurance: 'Assurance Qualité', wallboard: 'Tableau de Bord', kanban: 'Kanban', channels: 'Canaux', inbox: 'Boîte de Réception', liveChat: 'Chat en Direct', slack: 'Slack', facebook: 'Facebook', twitter: 'Twitter', whatsapp: 'WhatsApp', integrations: 'Intégrations', salesforce: 'Salesforce', jira: 'Jira', devPlan: 'Plan de Dév', customerPortal: 'Portail Client', newTicket: 'Nouveau Billet', myInbox: 'Ma Boîte' }
    };
    return map[lang];
  });
  
  unreadNotificationsCount = computed(() => this.notifications().filter(n => !n.read).length);

  selectedTicket = computed(() => {
    const id = this.selectedTicketId();
    return id ? this.tickets().find(t => t.id === id) ?? null : null;
  });

  selectedContact = computed(() => {
    const ticket = this.selectedTicket();
    if (!ticket) return undefined;
    return this.contacts().find(c => c.id === ticket.contactId);
  });
  
  // Filter & View Computeds
  privateViews = computed(() => this.ticketViews().filter(v => v.visibility === 'private' && v.ownerId === this.currentAgent().id));
  
  teamViews = computed(() => {
    const agentGroups = this.groups().filter(g => g.memberIds.includes(this.currentAgent().id)).map(g => g.id);
    if (agentGroups.length === 0) return [];
    return this.ticketViews().filter(v => 
      v.visibility === 'shared' && 
      v.sharedWithGroupIds && 
      v.sharedWithGroupIds.length > 0 &&
      v.sharedWithGroupIds.some(gId => agentGroups.includes(gId))
    );
  });
  
  sharedViews = computed(() => this.ticketViews().filter(v => v.visibility === 'shared' && (!v.sharedWithGroupIds || v.sharedWithGroupIds.length === 0)));

  pinnedViews = computed(() => this.ticketViews().filter(v => v.isPinned));

  canEditActiveView = computed(() => {
    const view = this.activeView();
    return view.ownerId === this.currentAgent().id && view.id !== 'all';
  });

  availableFilterFields = computed(() => {
    const standardFields = [
        { id: 'status', name: 'Status', type: 'dropdown', options: ['open', 'pending', 'resolved', 'closed'] },
        { id: 'priority', name: 'Priority', type: 'dropdown', options: ['low', 'medium', 'high', 'urgent'] },
        { id: 'assignedTo', name: 'Assignee', type: 'agent_dropdown' },
        { id: 'tags', name: 'Tags', type: 'text_contains' },
        { id: 'created', name: 'Created Date', type: 'date' },
        { id: 'timeSinceLastUpdate', name: 'Hours Since Last Update', type: 'number' },
        { id: 'slaStatus', name: 'SLA Status', type: 'dropdown', options: ['ok', 'risk', 'breached'] },
        { id: 'source', name: 'Source Channel', type: 'dropdown', options: ['email', 'portal', 'chat', 'api', 'slack'] },
    ];
    const custom = this.customFieldDefs().map(cf => ({
        id: cf.id,
        name: cf.name,
        type: cf.type,
        options: cf.options
    }));
    return [...standardFields, ...custom];
  });

  availableColumns = computed(() => {
      const standard = [
        { id: 'id', name: 'ID' }, { id: 'subject', name: 'Subject'}, { id: 'contact', name: 'Contact' }, { id: 'status', name: 'Status'},
        { id: 'priority', name: 'Priority'}, { id: 'created', name: 'Created'}, { id: 'assignedTo', name: 'Assignee' }
      ];
      const custom = this.customFieldDefs().map(cf => ({ id: cf.id, name: cf.name }));
      return [...standard, ...custom];
  });

  activeView = computed(() => {
    const viewId = this.activeViewId();
    return this.ticketViews().find(v => v.id === viewId) || this.ticketViews()[0];
  });

  filteredTickets = computed(() => {
    const filters = this.activeFilters();
    const allTickets = this.tickets();
    const query = this.searchQuery().toLowerCase();

    const searchFiltered = allTickets.filter(ticket => query === '' ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.id.toString().includes(query) ||
        this.getContact(ticket.contactId)?.name.toLowerCase().includes(query)
    );

    if (filters.length === 0) return searchFiltered;

    return searchFiltered.filter(ticket => {
        return filters.every(group => { // 'every' for AND between groups
            const conditionsInGroup = group.conditions.filter(c => c.field && c.operator);
            if (conditionsInGroup.length === 0) return true;

            const checkCondition = (cond: models.TicketFilterCondition) => {
                let ticketValue: any;
                switch(cond.field) {
                    case 'slaStatus':
                        ticketValue = ticket.sla?.status;
                        break;
                    case 'timeSinceLastUpdate':
                        const lastMessage = ticket.messages[ticket.messages.length - 1];
                        const lastTimestamp = lastMessage ? new Date(lastMessage.timestamp).getTime() : new Date(ticket.created).getTime();
                        ticketValue = (Date.now() - lastTimestamp) / (1000 * 60 * 60); // hours
                        break;
                    case 'assignedTo':
                        ticketValue = ticket.assignedTo || 'unassigned';
                        break;
                    case 'tags':
                        ticketValue = ticket.tags;
                        break;
                    default:
                        ticketValue = cond.field.startsWith('cf_') ? ticket.customFields?.[cond.field] : (ticket as any)[cond.field];
                }
                
                const val = cond.value;

                switch (cond.operator) {
                    case 'is': return ticketValue?.toString().toLowerCase() == val?.toString().toLowerCase();
                    case 'is_not': return ticketValue?.toString().toLowerCase() != val?.toString().toLowerCase();
                    case 'contains': return Array.isArray(ticketValue) ? ticketValue.some(item => item.toLowerCase().includes(val.toLowerCase())) : ticketValue?.toString().toLowerCase().includes(val.toLowerCase());
                    case 'does_not_contain': return Array.isArray(ticketValue) ? !ticketValue.some(item => item.toLowerCase().includes(val.toLowerCase())) : !ticketValue?.toString().toLowerCase().includes(val.toLowerCase());
                    case 'starts_with': return ticketValue?.toString().toLowerCase().startsWith(val.toLowerCase());
                    case 'ends_with': return ticketValue?.toString().toLowerCase().endsWith(val.toLowerCase());
                    case 'is_set': return ticketValue !== undefined && ticketValue !== null && ticketValue !== '';
                    case 'is_not_set': return ticketValue === undefined || ticketValue === null || ticketValue === '';
                    case 'greater_than':
                        if (cond.field === 'timeSinceLastUpdate') return ticketValue > parseFloat(val);
                        return new Date(ticketValue) > new Date(val);
                    case 'less_than':
                        if (cond.field === 'timeSinceLastUpdate') return ticketValue < parseFloat(val);
                        return new Date(ticketValue) < new Date(val);
                    case 'last_x_days':
                        const targetDate = new Date();
                        targetDate.setDate(targetDate.getDate() - parseInt(val, 10));
                        targetDate.setHours(0, 0, 0, 0);
                        return new Date(ticketValue) >= targetDate;
                    case 'is_one_of':
                        const values = val.split(',').map((v: string) => v.trim().toLowerCase());
                        return values.includes(ticketValue?.toString().toLowerCase());
                    default: return true;
                }
            };
            
            return group.matchType === 'all' ? conditionsInGroup.every(checkCondition) : conditionsInGroup.some(checkCondition);
        });
    });
  });

  groupedAndSortedTickets = computed(() => {
    const tickets = this.filteredTickets();
    const { sortBy, sortDirection, groupBy } = this.activeView().displayOptions;

    const sorted = [...tickets].sort((a, b) => {
        let valA = (a as any)[sortBy] ?? (a.customFields as any)?.[sortBy];
        let valB = (b as any)[sortBy] ?? (b.customFields as any)?.[sortBy];
        if (sortBy === 'contact') {
            valA = this.getContact(a.contactId)?.name;
            valB = this.getContact(b.contactId)?.name;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    if (!groupBy) {
        return { 'All Tickets': sorted };
    }

    return sorted.reduce((acc, ticket) => {
        let groupKey = (ticket as any)[groupBy] ?? (ticket.customFields as any)?.[groupBy] ?? 'Uncategorized';
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(ticket);
        return acc;
    }, {} as { [key: string]: models.Ticket[] });
  });

  objectKeys = (obj: object) => Object.keys(obj);
  
  isViewModified = computed(() => {
    const activeId = this.activeViewId();
    if (activeId === 'custom') return true;

    const currentView = this.ticketViews().find(v => v.id === activeId);
    if (!currentView) return true;
    
    // Naive deep compare
    const filtersMatch = JSON.stringify(currentView.filters) === JSON.stringify(this.activeFilters());
    return !filtersMatch;
  });
  
  showSaveActions = computed(() => this.isViewModified() || this.activeViewId() === 'custom');

  analyticsData = computed<models.AnalyticsData>(() => {
    const resolvedTickets = this.tickets().filter(t => t.status === 'resolved');
    const totalResolutionTime = resolvedTickets.reduce((acc, t) => t.resolvedAt ? acc + (new Date(t.resolvedAt).getTime() - new Date(t.created).getTime()) : acc, 0);
    const satisfactionScores = resolvedTickets.map(t => t.satisfactionRating).filter(r => r !== undefined) as number[];
    const csatDrivers: { [key: string]: number } = {};
    resolvedTickets.forEach(t => { if (t.csatDriver) csatDrivers[t.csatDriver] = (csatDrivers[t.csatDriver] || 0) + 1; });

    return {
        ticketsCreated: this.tickets().length,
        ticketsResolved: resolvedTickets.length,
        avgFirstResponseTime: 15,
        avgResolutionTime: resolvedTickets.length > 0 ? (totalResolutionTime / resolvedTickets.length) / (1000 * 60 * 60) : 0,
        satisfactionScore: satisfactionScores.length > 0 ? (satisfactionScores.reduce((a,b) => a+b, 0) / satisfactionScores.length) * 20 : 95,
        topPerformingAgent: 'Alex Ray',
        csatDrivers: csatDrivers
    };
  });
  
  wallboardData = computed<models.WallboardData>(() => {
    const openTickets = this.tickets().filter(t => t.status === 'open' || t.status === 'pending');
    const today = new Date().toDateString();
    const todaysResolved = this.tickets().filter(t => t.resolvedAt && new Date(t.resolvedAt).toDateString() === today).length;
    const onlineAgents = this.agents().filter(a => a.onlineStatus === 'online').length;

    const oldestOpenTicket = openTickets.sort((a,b) => new Date(a.created).getTime() - new Date(b.created).getTime())[0];
    let longestWaitTime = '0m';
    if(oldestOpenTicket) {
      const waitMinutes = Math.floor((new Date().getTime() - new Date(oldestOpenTicket.created).getTime()) / (1000 * 60));
      longestWaitTime = `${waitMinutes}m`;
    }

    return {
      openTickets: openTickets.length,
      todaysResolved: todaysResolved,
      slaBreachRisks: openTickets.filter(t => t.sla?.status === 'risk').length,
      agentStatus: this.agents().map(a => ({ name: a.name, status: a.onlineStatus, tickets: this.tickets().filter(t => t.assignedTo === a.name && t.status === 'open').length })),
      customerSatisfaction: { score: this.analyticsData().satisfactionScore, trend: 'up' },
      longestWaitTime: longestWaitTime,
      agentsOnline: onlineAgents,
    }
  });

  availableTags = computed(() => [...new Set(this.tickets().flatMap(t => t.tags))]);
  customerPortalTickets = computed(() => this.tickets().filter(t => t.contactId === this.currentCustomer().id));
  hasPermission = computed(() => (permission: models.Permission) => (this.roles().find(r => r.id === this.currentAgent().roleId)?.permissions.includes(permission) ?? false));
  areAllSelected = computed(() => {
    const filteredIds = this.filteredTickets().map(t => t.id);
    return filteredIds.length > 0 && filteredIds.every(id => this.selectedTicketIds().includes(id));
  });

  // === METHODS ===
  
  private addAuditLog(icon: string, action: string, details?: string) {
    const newLog: models.AuditLogEntry = { id: `log_${Date.now()}_${Math.random()}`, user: this.currentAgent().name, action, details, timestamp: new Date().toISOString(), icon };
    this.auditLog.update(log => [newLog, ...log]);
  }

  addToast(message: string, type: 'success' | 'info' | 'error' = 'info') {
    const id = Date.now();
    const icon = { success: 'check-circle', info: 'alert-circle', error: 'x-circle' }[type];
    const newToast: models.Toast = { id, message, type, icon };
    
    this.toasts.update(toasts => [...toasts, newToast]);
    
    setTimeout(() => this.removeToast(id), 5000);
  }

  removeToast(id: number) {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  toggleDarkMode() {
    this.isDarkMode.update(v => !v);
    document.documentElement.classList.toggle('dark', this.isDarkMode());
  }

  getContact = (id: number) => this.contacts().find(c => c.id === id);
  getAgent = (name: string) => this.agents().find(a => a.name === name);
  selectTicket = (id: number | null) => { 
    this.selectedTicketId.set(id); 
    if (id !== null) {
      this.currentView.set('tickets'); 
    }
  };
  
  getStatusDotClass(status: models.Ticket['status']): string {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'resolved':
      case 'closed':
        return 'bg-green-500';
      default: return 'bg-slate-400';
    }
  }
  
  getInitials(name: string = ''): string {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
  }

  getAvatarBgClass(name: string = ''): string {
    const colors = ['bg-red-200', 'bg-green-200', 'bg-blue-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200'];
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  }
  
  getLatestMessageSnippet(ticket: models.Ticket): { snippet: string, from: string } {
    if (ticket.messages.length === 0) {
      return { snippet: 'No messages yet.', from: 'system' };
    }
    const lastMessage = ticket.messages[ticket.messages.length - 1];
    const from = lastMessage.type === 'agent' ? lastMessage.from === this.currentAgent().name ? 'You' : lastMessage.from : 'Customer';
    return {
      snippet: lastMessage.content,
      from,
    };
  }
  
  markNotificationAsRead(notificationId: string) {
    this.notifications.update(notifs => notifs.map(n => n.id === notificationId ? { ...n, read: true } : n));
  }
  
  handleNotificationClick(notification: models.Notification) {
    this.markNotificationAsRead(notification.id);
    if (notification.ticketId) {
      this.selectTicket(notification.ticketId);
    }
    this.showNotifications.set(false);
  }

  // == Filter & View Methods ==
  toggleFilterPanel() {
    if (!this.showFilterPanel()) {
      const currentFilters = this.activeFilters();
      const filtersToSet = currentFilters.length > 0 ? currentFilters : [{ id: `g_${Date.now()}`, matchType: 'all', conditions: [{id: `c_${Date.now()}`, field: '', operator: 'is', value: ''}]}];
      this.panelFilters.set(JSON.parse(JSON.stringify(filtersToSet)));
    }
    this.showFilterPanel.update(v => !v);
  }

  applyFilters() {
    const newFilters = this.panelFilters().map(g => ({
        ...g,
        conditions: g.conditions.filter(c => c.field && c.operator)
    })).filter(g => g.conditions.length > 0);
    this.activeFilters.set(newFilters);
    const matchingView = this.ticketViews().find(v => JSON.stringify(v.filters) === JSON.stringify(newFilters));
    this.activeViewId.set(matchingView ? matchingView.id : 'custom');
    this.showFilterPanel.set(false);
  }

  clearFilters() {
    this.panelFilters.set([]);
    this.selectView('all');
    this.showFilterPanel.set(false);
  }
  
  addConditionGroup = () => this.panelFilters.update(f => [...f, { id: `g_${Date.now()}`, matchType: 'all', conditions: [{id: `c_${Date.now()}`, field: '', operator: 'is', value: ''}]}]);
  removeConditionGroup = (index: number) => this.panelFilters.update(f => f.filter((_, i) => i !== index));
  updateGroupMatchType = (index: number, event: Event) => this.panelFilters.update(f => { f[index].matchType = (event.target as HTMLSelectElement).value as 'all' | 'any'; return [...f]; });
  addCondition = (groupIndex: number) => this.panelFilters.update(f => { f[groupIndex].conditions.push({id: `c_${Date.now()}`, field: '', operator: 'is', value: ''}); return [...f]; });
  removeCondition = (groupIndex: number, condIndex: number) => this.panelFilters.update(f => { f[groupIndex].conditions = f[groupIndex].conditions.filter((_, i) => i !== condIndex); return [...f]; });

  updateConditionField(groupIndex: number, condIndex: number, event: Event) {
    const fieldId = (event.target as HTMLSelectElement).value;
    this.panelFilters.update(f => {
      f[groupIndex].conditions[condIndex].field = fieldId;
      f[groupIndex].conditions[condIndex].value = ''; // Reset value
      return [...f];
    });
  }
  updateConditionOperator(groupIndex: number, condIndex: number, event: Event) {
    const operator = (event.target as HTMLSelectElement).value as models.FilterOperator;
    this.panelFilters.update(f => { f[groupIndex].conditions[condIndex].operator = operator; return [...f]; });
  }
  updateConditionValue(groupIndex: number, condIndex: number, value: any) {
    this.panelFilters.update(f => {
      f[groupIndex].conditions[condIndex].value = value;
      return [...f];
    });
  }

  getFieldDef = (fieldId: string) => this.availableFilterFields().find(f => f.id === fieldId);
  
  getOperatorsForFieldType(fieldType?: string): {id: models.FilterOperator, name: string}[] {
    const general: {id: models.FilterOperator, name: string}[] = [{id: 'is_set', name: 'is set'}, {id: 'is_not_set', name: 'is not set'}];
    const text: {id: models.FilterOperator, name: string}[] = [{id: 'is', name: 'is'}, {id: 'is_not', name: 'is not'}, {id: 'contains', name: 'contains'}, {id: 'does_not_contain', name: 'does not contain'}, {id: 'starts_with', name: 'starts with'}, {id: 'ends_with', name: 'ends with'}];
    const number: {id: models.FilterOperator, name: string}[] = [{id: 'is', name: 'is'}, {id: 'is_not', name: 'is not'}, {id: 'greater_than', name: 'is greater than'}, {id: 'less_than', name: 'is less than'}];
    const date: {id: models.FilterOperator, name: string}[] = [{id: 'is_on', name: 'is on'}, {id: 'is_before', name: 'is before'}, {id: 'is_after', name: 'is after'}, {id: 'last_x_days', name: 'in the last X days'}];
    const dropdown: {id: models.FilterOperator, name: string}[] = [{id: 'is', name: 'is'}, {id: 'is_not', name: 'is not'}, {id: 'is_one_of', name: 'is one of'}];

    switch(fieldType) {
        case 'number': return [...number, ...general];
        case 'date': return [...date, ...general];
        case 'dropdown':
        case 'agent_dropdown':
            return [...dropdown, ...general];
        default: return [...text, ...general];
    }
  }

  selectView(viewId: string) {
    this.currentView.set('tickets');
    const view = this.ticketViews().find(v => v.id === viewId);
    if (view) {
      this.activeViewId.set(viewId);
      this.activeFilters.set(JSON.parse(JSON.stringify(view.filters)));
      this.showViewsDropdown.set(false);
      this.showViewActions.set(false);
      this.selectedTicketIds.set([]);
    }
  }
  
  resetViewChanges() {
    this.selectView(this.activeViewId());
  }

  openSaveViewModal(isCloning = false) {
    this.isEditingView.set(false);
    const currentDisplayOpts = this.activeView().displayOptions;
    this.tempViewOptions.set(JSON.parse(JSON.stringify(currentDisplayOpts)));
    this.newViewName.set(isCloning ? `${this.activeView().name} (Copy)` : '');
    this.newViewVisibility.set('private');
    this.newViewSharedGroups.set([]);
    this.openModal.set('saveView');
  }
  
  cloneView() {
    this.openSaveViewModal(true);
    this.showViewActions.set(false);
    this.addToast('View cloned. You can now save it as a new view.', 'info');
  }

  renameView(viewId: string) {
    const view = this.ticketViews().find(v => v.id === viewId);
    if (!view) return;
    const newName = prompt('Enter a new name for the view:', view.name);
    if (newName && newName.trim()) {
        this.ticketViews.update(views => views.map(v => v.id === viewId ? {...v, name: newName.trim()} : v));
        this.addAuditLog('tag', `Renamed view from "${view.name}" to "${newName.trim()}"`);
        this.addToast(`View renamed to "${newName.trim()}"`, 'success');
    }
    this.showViewActions.set(false);
  }
  
  setDefaultView(viewId: string) {
    localStorage.setItem(this.DEFAULT_VIEW_LS_KEY, viewId);
    this.defaultViewId.set(viewId);
    this.showViewActions.set(false);
    const viewName = this.ticketViews().find(v=>v.id === viewId)?.name;
    this.addAuditLog('star', `Set "${viewName}" as default view`);
    this.addToast(`"${viewName}" is now your default view.`, 'success');
  }

  openEditViewModal() {
    const view = this.activeView();
    if (!this.canEditActiveView()) return;
    this.isEditingView.set(true);
    this.newViewName.set(view.name);
    this.newViewVisibility.set(view.visibility);
    this.newViewSharedGroups.set(view.sharedWithGroupIds || []);
    this.tempViewOptions.set(JSON.parse(JSON.stringify(view.displayOptions)));
    this.openModal.set('saveView');
    this.showViewActions.set(false);
  }

  toggleViewColumn(columnId: string) {
    this.tempViewOptions.update(opts => {
      if (!opts) return null;
      const newCols = opts.columns.includes(columnId) ? opts.columns.filter(c => c !== columnId) : [...opts.columns, columnId];
      return { ...opts, columns: newCols };
    });
  }
  
  toggleSharedGroup(groupId: number) {
    this.newViewSharedGroups.update(groups => 
      groups.includes(groupId) ? groups.filter(g => g !== groupId) : [...groups, groupId]
    );
  }

  updateCurrentView() {
    const viewId = this.activeViewId();
    if (!this.isViewModified() || !this.canEditActiveView()) return;
    this.ticketViews.update(views => views.map(v => 
        v.id === viewId 
        ? { ...v, filters: JSON.parse(JSON.stringify(this.activeFilters())) } 
        : v
    ));
    this.addAuditLog('save', `Updated filters for view "${this.activeView().name}"`);
    this.addToast(`View "${this.activeView().name}" updated.`, 'success');
  }

  deleteView(viewId: string) {
    if (confirm('Are you sure you want to delete this view?')) {
        const viewName = this.ticketViews().find(v => v.id === viewId)?.name;
        this.ticketViews.update(views => views.filter(v => v.id !== viewId));
        this.selectView('all');
        this.addAuditLog('trash', `Deleted view "${viewName}"`);
        this.addToast(`View "${viewName}" deleted.`, 'success');
    }
    this.showViewActions.set(false);
  }

  saveCurrentView() {
    const viewName = this.newViewName().trim();
    if (!viewName || !this.tempViewOptions()) return;

    if (this.isEditingView()) {
        const viewId = this.activeViewId();
        this.ticketViews.update(views => views.map(v => 
            v.id === viewId 
            ? { ...v, name: viewName, visibility: this.newViewVisibility(), sharedWithGroupIds: this.newViewVisibility() === 'shared' ? this.newViewSharedGroups() : [], displayOptions: this.tempViewOptions()! }
            : v
        ));
        this.addAuditLog('edit-3', `Edited view "${viewName}"`);
        this.addToast(`View "${viewName}" saved.`, 'success');
    } else {
        const newView: models.TicketView = {
            id: `view_${Date.now()}`,
            name: viewName,
            ownerId: this.currentAgent().id,
            visibility: this.newViewVisibility(),
            sharedWithGroupIds: this.newViewVisibility() === 'shared' ? this.newViewSharedGroups() : [],
            filters: this.activeFilters(),
            displayOptions: this.tempViewOptions()!
        };
        this.ticketViews.update(views => [...views, newView]);
        this.activeViewId.set(newView.id);
        this.addAuditLog('plus-circle', `Created view "${viewName}"`);
        this.addToast(`View "${viewName}" created.`, 'success');
    }
    this.openModal.set(null);
  }

  private saveViews(views: models.TicketView[]) {
    const pinned = views.filter(v => v.isPinned).map(v => v.id);
    localStorage.setItem(this.PINNED_VIEWS_LS_KEY, JSON.stringify(pinned));
  }

  private loadViews(): models.TicketView[] {
    const pinnedIds = JSON.parse(localStorage.getItem(this.PINNED_VIEWS_LS_KEY) || '[]');
    const defaultViews: models.TicketView[] = [
      { 
          id: 'all', 
          name: 'All Tickets', 
          ownerId: 0, // System view
          visibility: 'shared',
          filters: [],
          displayOptions: {
              columns: ['id', 'subject', 'contact', 'status', 'priority', 'created', 'assignedTo'],
              sortBy: 'id',
              sortDirection: 'desc',
              groupBy: undefined
          }
      },
      { 
          id: 'api-view', 
          name: 'API Support Queue', 
          ownerId: 1, // Alex Ray
          visibility: 'shared',
          sharedWithGroupIds: [3],
          filters: [{ id: 'g1', matchType: 'all', conditions: [{id: 'c1', field: 'tags', operator: 'contains', value: 'api'}]}],
          displayOptions: {
              columns: ['id', 'subject', 'contact', 'status', 'priority', 'created'],
              sortBy: 'priority',
              sortDirection: 'asc',
              groupBy: 'status'
          }
      }
    ];

    return defaultViews.map(v => ({...v, isPinned: pinnedIds.includes(v.id)}));
  }

  togglePinView(viewId: string) {
    let viewName = '';
    let isPinned = false;
    this.ticketViews.update(views => {
        const newViews = views.map(v => {
            if (v.id === viewId) {
                viewName = v.name;
                isPinned = !v.isPinned;
                return { ...v, isPinned };
            }
            return v;
        });
        this.saveViews(newViews);
        return newViews;
    });
    this.addToast(isPinned ? `View "${viewName}" pinned.` : `View "${viewName}" unpinned.`, 'success');
    this.showViewActions.set(false);
  }
  
  getColumnName(columnId: string): string {
    return this.availableColumns().find(c => c.id === columnId)?.name || columnId;
  }
  
  getColumnValue(ticket: models.Ticket, columnId: string): string {
    if (columnId.startsWith('cf_')) {
        return ticket.customFields?.[columnId] || '';
    }
    switch (columnId) {
        case 'contact': return this.getContact(ticket.contactId)?.name || 'Unknown';
        case 'created': return new Date(ticket.created).toLocaleDateString();
        default: return (ticket as any)[columnId]?.toString() || '';
    }
  }

  // == Inline Editing Methods ==
  startEditing(ticketId: number, columnId: string, event: MouseEvent) {
    event.stopPropagation();
    this.editingCell.set({ ticketId, columnId });
  }

  stopEditing() {
    this.editingCell.set(null);
  }

  handleInlineUpdate(ticketId: number, columnId: 'status' | 'priority' | 'assignedTo', event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.tickets.update(tickets => tickets.map(t => 
        t.id === ticketId ? { ...t, [columnId]: value === 'unassigned' ? undefined : value } : t
    ));
    this.stopEditing();
  }
  
  handleAnalyticsFilter(conditions: { field: string, operator: models.FilterOperator, value: any }[]) {
    const newFilters: models.TicketFilters = [
      {
        id: `g_${Date.now()}`,
        matchType: 'all',
        conditions: conditions.map(c => ({
          id: `c_${Date.now()}_${Math.random()}`,
          ...c
        }))
      }
    ];
    this.activeFilters.set(newFilters);
    this.activeViewId.set('custom');
    this.currentView.set('tickets');
    this.selectedTicketId.set(null);
  }
  
  handleCommandPaletteAction(item: any) {
    switch (item.type) {
        case 'navigation':
            this.currentView.set(item.view);
            break;
        case 'action':
            if (item.action === 'newTicket') this.openModal.set('newTicket');
            if (item.action === 'toggleDarkMode') this.toggleDarkMode();
            break;
        case 'ticket':
            this.selectTicket(item.id);
            break;
        case 'kb':
            this.currentView.set('kb');
            // A more robust implementation would select the article in the KB component
            break;
        case 'contact':
             this.currentView.set('customers');
            // A more robust implementation would select the contact in the Customers component
            break;
    }
    this.showCommandPalette.set(false);
  }

  // === TICKET ACTION HANDLERS ===
  noop() {}

  handleCreateTicket(event: any) {
    const newTicket: models.Ticket = {
      ...event,
      id: Math.max(...this.tickets().map(t => t.id)) + 1,
      created: new Date().toISOString(),
      status: 'open',
      messages: event.messages || [{ from: this.getContact(event.contactId)?.name || 'Customer', type: 'customer', content: event.messages[0].content, timestamp: new Date().toISOString(), attachments: []}],
      internalNotes: [],
      activities: [],
      timeTrackedSeconds: 0,
      source: 'portal',
    };
    this.tickets.update(t => [...t, newTicket]);
    this.addAuditLog('plus-circle', `Created ticket #${newTicket.id}`);
    this.openModal.set(null);
  }

  handleAddReply(event: { ticketId: number; content: string; fromAgent: boolean; attachments: string[] }) {
    this.tickets.update(tickets => tickets.map(t => {
      if (t.id === event.ticketId) {
        const newMessage: models.Message = {
          from: event.fromAgent ? this.currentAgent().name : this.getContact(t.contactId)?.name || 'Customer',
          type: event.fromAgent ? 'agent' : 'customer',
          content: event.content,
          timestamp: new Date().toISOString(),
          attachments: event.attachments
        };
        return { ...t, messages: [...t.messages, newMessage] };
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
    const id = this.selectedTicketId();
    if (!id) return;
    
    this.tickets.update(tickets => tickets.map(t => t.id === id ? { ...t, ...update } : t));
    
    // Add activity log for specific changes
    if (update.status) this.addAuditLog('circle', `Changed status of #${id} to ${update.status}`);
    if (update.priority) this.addAuditLog('alert-circle', `Changed priority of #${id} to ${update.priority}`);
    if (update.assignedTo) this.addAuditLog('user', `Assigned #${id} to ${update.assignedTo}`);
  }

  handleMergeTickets(targetTicketId: number) {
    const sourceTicketId = this.selectedTicketForModal()!.id;
    const sourceTicket = this.tickets().find(t => t.id === sourceTicketId);
    const targetTicket = this.tickets().find(t => t.id === targetTicketId);

    if (!sourceTicket || !targetTicket) return;

    this.tickets.update(tickets => {
      return tickets.map(t => {
        if (t.id === targetTicketId) {
          // Add merged messages and notes to target
          return {
            ...t,
            messages: [...t.messages, ...sourceTicket.messages],
            internalNotes: [...t.internalNotes, ...sourceTicket.internalNotes],
          };
        }
        if (t.id === sourceTicketId) {
          // Close the source ticket
          return { ...t, status: 'closed' };
        }
        return t;
      });
    });
    this.addAuditLog('merge', `Merged ticket #${sourceTicketId} into #${targetTicketId}`);
    this.openModal.set(null);
  }
  
  handleSplitTicket(newSubject: string) {
      const sourceTicket = this.selectedTicketForModal();
      const messageToSplit = this.selectedMessageForModal();
      if (!sourceTicket || !messageToSplit) return;
      
      const newTicket: models.Ticket = {
        id: Math.max(...this.tickets().map(t => t.id)) + 1,
        subject: newSubject,
        contactId: sourceTicket.contactId,
        created: new Date().toISOString(),
        status: 'open',
        priority: 'medium',
        tags: [],
        messages: [{...messageToSplit, timestamp: new Date().toISOString()}],
        internalNotes: [],
        activities: [],
        timeTrackedSeconds: 0,
        source: sourceTicket.source
      };
      this.tickets.update(t => [...t, newTicket]);
      this.addAuditLog('split', `Split a message from #${sourceTicket.id} into new ticket #${newTicket.id}`);
      this.openModal.set(null);
  }
  
  handleCreateProblemTicket(suggestion: models.ProblemSuggestion) {
    const newTicket: models.Ticket = {
      id: Math.max(...this.tickets().map(t => t.id)) + 1,
      subject: `PROBLEM: ${suggestion.suggestedTitle}`,
      contactId: this.currentCustomer().id, // Or a system user
      created: new Date().toISOString(),
      status: 'open',
      priority: 'high',
      tags: ['problem'],
      messages: [{ from: 'System', type: 'agent', content: `Problem ticket created to track multiple incidents.`, timestamp: new Date().toISOString(), attachments: [] }],
      internalNotes: [{ agentName: 'System', content: `Linked Incidents: ${suggestion.incidentTicketIds.map(id => `#${id}`).join(', ')}`, timestamp: new Date().toISOString()}],
      activities: [],
      timeTrackedSeconds: 0,
      childTicketIds: suggestion.incidentTicketIds,
      source: 'api'
    };
    
    this.tickets.update(tickets => {
      let updated = tickets.map(t => {
        if (suggestion.incidentTicketIds.includes(t.id)) {
          return { ...t, parentId: newTicket.id };
        }
        return t;
      });
      updated.push(newTicket);
      return updated;
    });
    this.addAuditLog('alert-circle', `Created problem ticket #${newTicket.id} from ${suggestion.incidentTicketIds.length} incidents`);
  }

  handleCsatSubmit(event: { rating: number; comment: string }) {
    const ticketId = this.selectedTicketForModal()!.id;
    this.tickets.update(tickets => tickets.map(t => {
        if (t.id === ticketId) {
            return { ...t, satisfactionRating: event.rating, satisfactionComment: event.comment };
        }
        return t;
    }));
    this.openModal.set(null);
  }

  handleKbFeedback(event: models.KbFeedback) {
    this.kbArticles.update(articles => articles.map(a => {
        if (a.id === event.articleId) {
            return {
                ...a,
                upvotes: event.vote === 'up' ? a.upvotes + 1 : a.upvotes,
                downvotes: event.vote === 'down' ? a.downvotes + 1 : a.downvotes
            };
        }
        return a;
    }));
  }

  handleLogTime(seconds: number) {
      const id = this.selectedTicketForModal()?.id;
      if (!id) return;
      this.tickets.update(tickets => tickets.map(t => t.id === id ? { ...t, timeTrackedSeconds: t.timeTrackedSeconds + seconds } : t));
      this.openModal.set(null);
  }
  
  handleLinkTicket(childTicketId: number) {
    const parentId = this.selectedTicketForModal()?.id;
    if (!parentId) return;
    
    this.tickets.update(tickets => tickets.map(t => {
      if (t.id === parentId) {
        return { ...t, childTicketIds: [...(t.childTicketIds || []), childTicketId] };
      }
      if (t.id === childTicketId) {
        return { ...t, parentId: parentId };
      }
      return t;
    }));
    this.addAuditLog('link', `Linked ticket #${childTicketId} to #${parentId}`);
    this.openModal.set(null);
  }

  toggleSelectTicket(ticketId: number) {
    this.selectedTicketIds.update(ids => 
      ids.includes(ticketId) 
        ? ids.filter(id => id !== ticketId) 
        : [...ids, ticketId]
    );
  }

  toggleSelectAll() {
    if (this.areAllSelected()) {
      this.selectedTicketIds.set([]);
    } else {
      this.selectedTicketIds.set(this.filteredTickets().map(t => t.id));
    }
  }

  handleBulkAction(event: { action: string, value: any }) {
    this.tickets.update(tickets => tickets.map(t => {
      if (this.selectedTicketIds().includes(t.id)) {
        switch (event.action) {
          case 'status': return { ...t, status: event.value };
          case 'priority': return { ...t, priority: event.value };
          case 'assign': return { ...t, assignedTo: event.value === 'unassigned' ? undefined : event.value };
          case 'addTag': return { ...t, tags: [...new Set([...t.tags, event.value])] };
          default: return t;
        }
      }
      return t;
    }));
    this.addAuditLog('check-square', `Applied bulk action "${event.action}" to ${this.selectedTicketIds().length} tickets.`);
    this.addToast(`${this.selectedTicketIds().length} tickets updated.`, 'success');
    this.selectedTicketIds.set([]);
  }

  handleSaveRoles(updatedRoles: models.Role[]) {
    this.roles.set(updatedRoles);
    this.addAuditLog('shield', `Updated roles and permissions`);
    this.addToast('Roles and permissions saved.', 'success');
  }

  handleSaveSsoSettings(settings: models.SsoSettings) {
    this.ssoSettings.set(settings);
    this.addAuditLog('shield', `Updated SSO settings`);
    this.addToast('SSO settings saved.', 'success');
  }
  
  handleSaveAutomationRules(rules: models.AutomationRule[]) {
    this.automationRules.set(rules);
    this.addAuditLog('zap', `Updated automation rules`);
    this.addToast('Automation rules saved.', 'success');
  }

  handleSaveSlaRules(rules: models.SlaRules) {
    this.slaRules.set(rules);
    this.addAuditLog('sliders', `Updated SLA policies`);
    this.addToast('SLA policies saved.', 'success');
  }
  
  handleSaveFormTemplates(templates: models.FormTemplate[]) {
    this.formTemplates.set(templates);
    this.addAuditLog('layout-template', `Updated form templates`);
    this.addToast('Form templates saved.', 'success');
  }
  
  handleCreateApiKey(key: models.ApiKey) {
    this.apiKeys.update(keys => [...keys, key]);
    this.addAuditLog('key', `Created API Key "${key.name}"`);
  }

  handleRevokeApiKey(keyId: string) {
    this.apiKeys.update(keys => keys.filter(k => k.id !== keyId));
    this.addAuditLog('key', `Revoked API Key`);
    this.addToast('API Key revoked.', 'success');
  }

  handleSaveWebhooks(webhooks: models.Webhook[]) {
    this.webhooks.set(webhooks);
    this.addAuditLog('webhook', `Updated webhooks configuration`);
    this.addToast('Webhooks saved.', 'success');
  }
  
  handleSaveSalesforceSettings(settings: models.SalesforceSettings) { this.salesforceSettings.set(settings); }
  handleSaveJiraSettings(settings: models.JiraSettings) { this.jiraSettings.set(settings); }

  handleConvertToTicket(email: models.MockEmail) {
      const contact = this.contacts().find(c => c.email.toLowerCase() === email.from.toLowerCase());
      if (!contact) {
        alert('Cannot create ticket: Contact not found.');
        return;
      }

      const newTicket: models.Ticket = {
        id: Math.max(...this.tickets().map(t => t.id)) + 1,
        subject: email.subject,
        contactId: contact.id,
        created: new Date().toISOString(),
        status: 'open',
        priority: 'medium',
        tags: ['email'],
        messages: [{ from: contact.name, type: 'customer', content: email.body, timestamp: email.receivedAt, attachments: []}],
        internalNotes: [],
        activities: [],
        timeTrackedSeconds: 0,
        source: 'email'
      };
      this.tickets.update(t => [...t, newTicket]);
      this.emails.update(emails => emails.map(e => e.id === email.id ? {...e, status: 'ticket_created', ticketId: newTicket.id} : e));
      this.addAuditLog('mail', `Created ticket #${newTicket.id} from email`);
  }

  handleAcceptChat(chatId: string) {
      this.chatSessions.update(sessions => sessions.map(s => 
          s.id === chatId ? {...s, status: 'active', agentId: this.currentAgent().id} : s
      ));
  }

  handleSendChatMessage(event: { chatId: string, content: string, from: 'agent' | 'customer' }) {
    this.chatSessions.update(sessions => sessions.map(s => {
      if (s.id === event.chatId) {
        const newTranscript = {
          sender: event.from,
          name: event.from === 'agent' ? this.currentAgent().name : s.customerName,
          content: event.content,
          timestamp: new Date().toISOString()
        };
        return { ...s, transcript: [...s.transcript, newTranscript] };
      }
      return s;
    }));
  }

  handleChatConvertToTicket(chat: models.ChatSession) {
      const contact = this.contacts().find(c => c.email.toLowerCase() === chat.customerEmail.toLowerCase());
       if (!contact) {
        alert('Cannot create ticket: Contact not found.');
        return;
      }
       const newTicket: models.Ticket = {
        id: Math.max(...this.tickets().map(t => t.id)) + 1,
        subject: `Chat with ${chat.customerName}`,
        contactId: contact.id,
        created: new Date(chat.createdAt).toISOString(),
        status: 'open',
        priority: 'medium',
        tags: ['chat'],
        messages: chat.transcript.map(t => ({
            from: t.name,
            type: t.sender,
            content: t.content,
            timestamp: t.timestamp,
            attachments: []
        })),
        internalNotes: [],
        activities: [],
        timeTrackedSeconds: 0,
        source: 'chat'
      };
      this.tickets.update(t => [...t, newTicket]);
      this.chatSessions.update(sessions => sessions.map(s => s.id === chat.id ? {...s, status: 'ended'} : s));
  }
  
  handleStartChat(event: { initialMessage: string, pageUrl: string, browserInfo: string }) {
      const newSession: models.ChatSession = {
          id: `chat_${Date.now()}`,
          customerName: this.currentCustomer().name,
          customerEmail: this.currentCustomer().email,
          initialMessage: event.initialMessage,
          status: 'pending',
          createdAt: new Date().toISOString(),
          pageUrl: event.pageUrl,
          browserInfo: event.browserInfo,
          transcript: [{ sender: 'customer', name: this.currentCustomer().name, content: event.initialMessage, timestamp: new Date().toISOString() }]
      };
      this.chatSessions.update(sessions => [...sessions, newSession]);
  }
  
  handleCreateKanbanBoard(event: {title: string, workspaceId: string}) {
      const newBoard: models.KanbanBoard = {
          id: `board_${Date.now()}`,
          title: event.title,
          workspaceId: event.workspaceId,
          lists: [
              { id: 'l1', title: 'To Do', order: 0, boardId: `board_${Date.now()}`, cards: [] },
              { id: 'l2', title: 'In Progress', order: 1, boardId: `board_${Date.now()}`, cards: [] },
              { id: 'l3', title: 'Done', order: 2, boardId: `board_${Date.now()}`, cards: [] },
          ]
      };
      this.kanbanBoards.update(b => [...b, newBoard]);
      this.openModal.set(null);
  }
  
  openModalWithTicket(modal: Modal, ticket: models.Ticket) {
    this.selectedTicketForModal.set(ticket);
    this.openModal.set(modal);
  }
  
  openSplitModalWithMessage(message: models.Message) {
    this.selectedTicketForModal.set(this.selectedTicket());
    this.selectedMessageForModal.set(message);
    this.openModal.set('splitTicket');
  }
}