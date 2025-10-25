import { Component, ChangeDetectionStrategy, signal, computed, WritableSignal, Signal, effect, Injector, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket, AutomationRule, CannedResponse, SlaRules, SlaInfo, AdvancedFilters, AnalyticsData, KnowledgeBaseArticle, KnowledgeBaseCategory, Activity, TimeLog, CustomFieldDefinition, Macro, Message, Agent, Role, Group, AutomationAction, AutomationTrigger, MockEmail, ChatSession, ChatMessage, Notification, View, SlackSettings, SlackMessage, ServiceRequestType } from './models';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { NewTicketModalComponent } from './components/new-ticket-modal/new-ticket-modal.component';
import { AutomationModalComponent } from './components/automation-modal/automation-modal.component';
import { CsatModalComponent } from './components/csat-modal/csat-modal.component';
import { BulkActionBarComponent } from './components/bulk-action-bar/bulk-action-bar.component';
import { IconComponent } from './components/icon/icon.component';
import { KnowledgeBaseComponent } from './components/knowledge-base/knowledge-base.component';
import { SlaManagementModalComponent } from './components/sla-management-modal/sla-management-modal.component';
import { CustomerPortalComponent } from './components/customer-portal/customer-portal.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatWidgetComponent } from './components/chat-widget/chat-widget.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SlackIntegrationComponent } from './components/slack-integration/slack-integration.component';
import { GeminiService } from './gemini.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    AnalyticsDashboardComponent,
    TicketDetailComponent,
    NewTicketModalComponent,
    AutomationModalComponent,
    CsatModalComponent,
    BulkActionBarComponent,
    IconComponent,
    KnowledgeBaseComponent,
    SlaManagementModalComponent,
    CustomerPortalComponent,
    SettingsModalComponent,
    InboxComponent,
    ChatComponent,
    ChatWidgetComponent,
    ReportsComponent,
    SlackIntegrationComponent,
  ],
})
export class AppComponent {
  activeView = signal<'tickets' | 'analytics' | 'knowledge-base' | 'customer-portal' | 'inbox' | 'chat' | 'reports' | 'slack'>('tickets');
  selectedTicket: WritableSignal<Ticket | null> = signal(null);
  showNewTicket = signal(false);
  showAutomation = signal(false);
  showCSAT = signal(false);
  showSlaManagement = signal(false);
  showSettings = signal(false);
  showKeyboardShortcuts = signal(false);
  csatTicket: WritableSignal<Ticket | null> = signal(null);
  filterStatus = signal('all');
  filterTag = signal('all');
  filterPriority = signal<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  filterAssignee = signal('all');
  searchQuery = signal('');
  showAdvancedSearch = signal(false);
  selectedTicketIds = signal<number[]>([]);
  showBulkActions = signal(false);
  theme = signal<'light' | 'dark'>('light');
  
  // Views
  savedViews = signal<View[]>([
    {
      id: 'view-1',
      name: 'My Urgent Tickets',
      filters: {
        status: 'open',
        tag: 'all',
        priority: 'urgent',
        assignee: 'me',
        searchQuery: '',
        advancedFilters: { customer: '', agent: '', dateFrom: '', dateTo: '', priority: 'all', customFilters: {} }
      }
    },
    {
      id: 'view-2',
      name: 'Unassigned Billing Issues',
      filters: {
        status: 'open',
        tag: 'Billing',
        priority: 'all',
        assignee: 'Unassigned',
        searchQuery: '',
        advancedFilters: { customer: '', agent: '', dateFrom: '', dateTo: '', priority: 'all', customFilters: {} }
      }
    }
  ]);
  activeViewId = signal<string | null>('all');

  // Integrations
  slackSettings = signal<SlackSettings>({ enabled: true, channel: 'support-tickets' });
  slackMessages = signal<SlackMessage[]>([]);


  // Notifications
  notifications = signal<Notification[]>([
    { id: 'notif-1', type: 'customer_reply', message: 'New reply on ticket #2 from Emily Davis', ticketId: 2, isRead: false, timestamp: '2025-10-18T15:58:00' },
    { id: 'notif-2', type: 'new_ticket', message: 'New ticket #4 from Lisa Chen', ticketId: 4, isRead: true, timestamp: '2025-10-18T13:02:00' }
  ]);
  showNotifications = signal(false);
  unreadNotificationsCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  roles = signal<Role[]>([
    { id: 1, name: 'Admin', permissions: ['*'] },
    { id: 2, name: 'Agent', permissions: ['view_tickets', 'edit_tickets'] }
  ]);

  groups = signal<Group[]>([
    { id: 1, name: 'Support' },
    { id: 2, name: 'Billing' },
    { id: 3, name: 'Engineering' }
  ]);

  agents = signal<Agent[]>([
    { id: 1, name: 'Jane Doe (Admin)', email: 'jane.doe@email.com', roleId: 1, groupIds: [1,2], status: 'Online' },
    { id: 2, name: 'Mike Chen', email: 'mike.chen@email.com', roleId: 2, groupIds: [1,3], status: 'Online' },
    { id: 3, name: 'Sarah Johnson', email: 'sarah.j@email.com', roleId: 2, groupIds: [2], status: 'Offline' }
  ]);

  // Simulate a logged-in user. This can be an agent or a customer.
  allUsers = computed(() => [
    ...this.agents(),
    { id: 101, name: 'John Smith (Customer)', email: 'john.smith@email.com' },
    { id: 102, name: 'Emily Davis (Customer)', email: 'emily.davis@email.com' }
  ]);
  currentUser = signal<(Agent & { type?: 'agent' }) | { id: number; name: string; email: string; type?: 'customer' }>(this.agents()[0]);
  
  showChatWidget = computed(() => {
    const user = this.currentUser();
    return user && !('roleId' in user);
  });
  
  customerChatSession = computed(() => {
    if (!this.showChatWidget()) return null;
    const user = this.currentUser();
    return this.chatSessions().find(c => c.customerEmail === user.email && c.status !== 'closed' && c.status !== 'ticket_created') || null;
  });

  constructor(private injector: Injector, private geminiService: GeminiService) {
    const savedTheme = localStorage.getItem('bolddesk-theme') as 'light' | 'dark';
    if (savedTheme) {
      this.theme.set(savedTheme);
    }
    
    // Load saved views from local storage
    const savedViewsFromStorage = localStorage.getItem('bolddesk-saved-views');
    if (savedViewsFromStorage) {
        this.savedViews.set(JSON.parse(savedViewsFromStorage));
    }
    
    const savedSlackSettings = localStorage.getItem('bolddesk-slack-settings');
    if (savedSlackSettings) {
        this.slackSettings.set(JSON.parse(savedSlackSettings));
    }

    effect(() => {
        // Update agent load when tickets change
        const currentTickets = this.tickets();
        this.agents.update(agents => agents.map(agent => ({
            ...agent,
            load: currentTickets.filter(t => t.assignedTo === agent.name && (t.status === 'open' || t.status === 'in-progress')).length
        })));
    }, { allowSignalWrites: true });

    // Time-based automation check (every minute)
    setInterval(() => {
      this.checkTimeBasedAutomations();
    }, 60 * 1000);

    // SLA breach check (every 5 minutes)
     setInterval(() => {
      this.checkSlaBreaches();
    }, 5 * 60 * 1000);

    effect(() => {
        const user = this.currentUser();
        if ('roleId' in user) { // is agent
            if (this.activeView() === 'customer-portal') {
              this.activeView.set('tickets');
            }
        } else { // is customer
            this.activeView.set('customer-portal');
            this.selectedTicket.set(null);
        }
    });

    effect((onCleanup) => {
      const ticket = this.selectedTicket();
      const user = this.currentUser();

      if (ticket && 'roleId' in user) {
        const agentName = user.name;
        this.tickets.update(currentTickets => currentTickets.map(t => {
          if (t.id === ticket.id) {
            const viewingAgents = t.viewingAgents ? [...t.viewingAgents] : [];
            if (!viewingAgents.includes(agentName)) {
              viewingAgents.push(agentName);
            }
            return { ...t, viewingAgents };
          }
          return t;
        }));
      

      onCleanup(() => {
        if (ticket) {
          this.tickets.update(currentTickets => currentTickets.map(t => {
            if (t.id === ticket.id) {
              const viewingAgents = (t.viewingAgents || []).filter(name => name !== agentName);
              return { ...t, viewingAgents };
            }
            return t;
          }));
        }
      });
      }
    }, { allowSignalWrites: true });

    effect(() => {
      this.showBulkActions.set(this.selectedTicketIds().length > 0);
    });
    
    effect(() => {
      const currentTheme = this.theme();
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('bolddesk-theme', currentTheme);
    });

    // Persist saved views to local storage
    effect(() => {
        localStorage.setItem('bolddesk-saved-views', JSON.stringify(this.savedViews()));
    });
    
    effect(() => {
        localStorage.setItem('bolddesk-slack-settings', JSON.stringify(this.slackSettings()));
    });

    // Effect to deselect active view if filters change
    effect(() => {
      const activeViewId = this.activeViewId();
      if (activeViewId === 'all' || activeViewId === null) return;
    
      const activeView = this.savedViews().find(v => v.id === activeViewId);
      if (!activeView) return;
    
      // Listen to all filter signals
      const currentFilters = {
        status: this.filterStatus(),
        tag: this.filterTag(),
        priority: this.filterPriority(),
        assignee: this.filterAssignee(),
        searchQuery: this.searchQuery(),
        advancedFilters: this.advancedFilters()
      };
    
      if (JSON.stringify(currentFilters) !== JSON.stringify(activeView.filters)) {
        this.activeViewId.set(null);
      }
    }, { allowSignalWrites: true });
    
    // Effect for Slack notifications
    effect((onCleanup) => {
        const currentTickets = this.tickets();
        onCleanup(() => {
            const previousTickets = this.tickets();
            if (currentTickets.length > previousTickets.length) {
                const newTicket = currentTickets[0]; // Assuming new ticket is at the start
                this.postToSlack(newTicket);
            }
        });
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Disable shortcuts if an input, textarea, or select is focused
    const target = event.target as HTMLElement;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      return;
    }

    switch (event.key) {
      case 'n':
        event.preventDefault();
        this.showNewTicket.set(true);
        break;
      case '?':
        this.showKeyboardShortcuts.set(true);
        break;
      // Add more shortcuts here for navigation or actions
    }
  }

  toggleTheme() {
    this.theme.update(current => (current === 'light' ? 'dark' : 'light'));
  }

  updateCurrentUser(userId: number) {
    const selectedUser = this.allUsers().find(u => u.id === userId);
    if (selectedUser) {
      this.currentUser.set(selectedUser);
    }
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    if (!('roleId' in user)) return false; // Customer has no agent permissions
    
    const userRole = this.roles().find(r => r.id === user.roleId);
    if (!userRole) return false;

    return userRole.permissions.includes('*') || userRole.permissions.includes(permission);
  }

  checkTimeBasedAutomations() {
    const now = new Date().getTime();
    this.automationRules().filter(rule => rule.enabled && rule.trigger.type === 'time_since_status').forEach(rule => {
      const trigger = rule.trigger as Extract<AutomationTrigger, {type: 'time_since_status'}>;
      this.tickets().forEach(ticket => {
        if (ticket.status === trigger.status) {
          const lastUpdate = new Date(ticket.lastUpdate).getTime();
          const hoursPassed = (now - lastUpdate) / (1000 * 60 * 60);
          if (hoursPassed >= trigger.hours) {
            // To prevent re-triggering, we can add a check here, maybe a special tag or activity log
            const alreadyTriggered = ticket.activity.some(a => a.details.includes(`by time-based rule "${rule.name}"`));
            if (!alreadyTriggered) {
                this.applyAutomationAction(ticket, rule.action, `by time-based rule "${rule.name}"`);
            }
          }
        }
      });
    });
  }
  
  checkSlaBreaches() {
    const now = new Date();
    this.tickets().forEach(ticket => {
        if (ticket.status === 'open' || ticket.status === 'in-progress') {
            const slaInfo = this.calculateSLA(ticket);
            let breachType: 'response' | 'resolution' | null = null;
            if (slaInfo.responseBreached) {
                breachType = 'response';
            } else if (slaInfo.resolutionBreached) {
                breachType = 'resolution';
            }

            if (breachType) {
                const alreadyNotified = this.notifications().some(n => n.ticketId === ticket.id && n.type === 'sla_breach' && n.message.includes(breachType!));
                if (!alreadyNotified) {
                      const newNotification: Notification = {
                        id: `notif-${Date.now()}-${ticket.id}`,
                        type: 'sla_breach',
                        message: `SLA ${breachType} breach on ticket #${ticket.id}`,
                        ticketId: ticket.id,
                        isRead: false,
                        timestamp: now.toISOString()
                    };
                    this.notifications.update(n => [newNotification, ...n]);
                }
            }
        }
    });
  }

  advancedFilters = signal<AdvancedFilters>({
    customer: '',
    agent: '',
    dateFrom: '',
    dateTo: '',
    priority: 'all',
    customFilters: {}
  });

  macros = signal<Macro[]>([
    { id: 1, name: 'Escalate to Tier 2', actions: [
      { type: 'change_priority', value: 'high' },
      { type: 'assign_agent', value: 'Mike Chen' },
      { type: 'add_tag', value: 'Escalated' },
      { type: 'add_internal_note', value: 'This ticket has been escalated to Tier 2 for further investigation.' }
    ]},
    { id: 2, name: 'Resolve & Close', actions: [
        { type: 'change_status', value: 'resolved' }
    ]},
    { id: 3, name: 'Billing Inquiry', actions: [
        { type: 'assign_agent', value: 'Sarah Johnson' },
        { type: 'add_tag', value: 'Billing' }
    ]}
  ]);
  
  customFieldDefinitions = signal<CustomFieldDefinition[]>([
    { id: 'order_id', name: 'Order ID', type: 'text', defaultValue: '' },
    { id: 'product_area', name: 'Product Area', type: 'dropdown', options: ['App', 'Website', 'API'], defaultValue: 'App'},
    { id: 'purchase_date', name: 'Purchase Date', type: 'date', defaultValue: '' }
  ]);

  serviceRequestTypes = signal<ServiceRequestType[]>([
    {
      id: 'report_bug',
      name: 'Report a Bug',
      description: 'Something is broken or not working as expected.',
      icon: 'bug',
      customFieldIds: ['product_area']
    },
    {
      id: 'billing_inquiry',
      name: 'Billing Inquiry',
      description: 'Questions about invoices, payments, or subscriptions.',
      icon: 'credit-card',
      customFieldIds: ['order_id']
    },
    {
      id: 'feature_request',
      name: 'Feature Request',
      description: 'Suggest a new feature or enhancement for our product.',
      icon: 'sparkles',
      customFieldIds: ['product_area']
    },
    {
      id: 'general_question',
      name: 'General Question',
      description: 'For any other questions you might have.',
      icon: 'help-circle',
      customFieldIds: []
    }
  ]);

  cannedResponses = signal<CannedResponse[]>([
    { id: 1, name: 'Welcome Message', content: 'Thank you for contacting our support team! We have received your request and will get back to you shortly.' },
    { id: 2, name: 'Password Reset', content: 'I can help you reset your password. Please click the "Forgot Password" link on the login page and follow the instructions sent to your email.' },
    { id: 3, name: 'Resolved & Close', content: 'I am glad we could resolve your issue! If you need any further assistance, please do not hesitate to reach out. Marking this ticket as resolved.' },
    { id: 4, name: 'Need More Info', content: 'To better assist you, could you please provide more details about the issue you are experiencing? Any screenshots or error messages would be helpful.' },
    { id: 5, name: 'Escalation', content: 'I understand this is important. I am escalating your ticket to our senior support team who will review this promptly.' }
  ]);

  availableTags = signal<string[]>([
    'Billing', 'Technical', 'Feature Request', 'Bug', 'Account', 'General', 'Escalated'
  ]);

  slaRules = signal<SlaRules>({
    urgent: { responseTime: 1, resolutionTime: 4 },
    high: { responseTime: 2, resolutionTime: 8 },
    medium: { responseTime: 4, resolutionTime: 24 },
    low: { responseTime: 8, resolutionTime: 48 }
  });

  automationRules = signal<AutomationRule[]>([
    { id: 1, name: 'New tickets -> Assign to Support (Round Robin)', enabled: true, trigger: { type: 'ticket_created' }, action: { type: 'assign_group_round_robin', groupId: 1 } },
    { id: 2, name: 'Billing tag -> Assign to Billing (Load Based)', enabled: true, trigger: { type: 'tag_added', value: 'Billing' }, action: { type: 'assign_group_load_based', groupId: 2 } },
    { id: 3, name: 'Auto-close resolved tickets after 7 days', enabled: true, trigger: { type: 'time_since_status', status: 'resolved', hours: 168 }, action: { type: 'change_status', value: 'closed' } },
    { id: 4, name: 'Escalate urgent tickets', enabled: true, trigger: { type: 'priority_is', value: 'urgent' }, action: { type: 'add_tag', value: 'Escalated' } }
  ]);

  tickets = signal<Ticket[]>([
    { id: 1, subject: 'Cannot login to account', customer: 'John Smith', email: 'john.smith@email.com', status: 'open', priority: 'high', assignedTo: 'Unassigned', created: '2025-10-18T10:30:00', lastUpdate: '2025-10-18T14:20:00', firstResponseAt: null, tags: ['Technical', 'Account'], category: 'Technical', messages: [{ from: 'John Smith', content: 'I cannot login to my account. I keep getting an error message.', timestamp: '2025-10-18T10:30:00', type: 'customer', attachments: [], channel: 'web' }], internalNotes: [], activity: [{ type: 'created', user: 'System', timestamp: '2025-10-18T10:30:00', details: 'Ticket created' }], csatRating: null, viewingAgents: [], timeTrackedSeconds: 3600, timeLogs: [], customFields: { order_id: 'ORD-12345', product_area: 'Website', purchase_date: '2025-10-15' }, isPrivate: false, watchers: [], cc: [], channel: 'web', sentiment: 'negative' },
    { id: 2, subject: 'Feature request: Dark mode', customer: 'Emily Davis', email: 'emily.davis@email.com', status: 'in-progress', priority: 'medium', assignedTo: 'Mike Chen', created: '2025-10-17T09:15:00', lastUpdate: '2025-10-18T11:00:00', firstResponseAt: '2025-10-17T10:30:00', tags: ['Feature Request'], category: 'Feature Request', messages: [{ from: 'Emily Davis', content: 'Would love to see a dark mode option in the app.', timestamp: '2025-10-17T09:15:00', type: 'customer', attachments: [], channel: 'web' }, { from: 'Mike Chen', content: 'Thank you for the suggestion! We are adding this to our roadmap.', timestamp: '2025-10-18T11:00:00', type: 'agent', attachments: [], channel: 'web' }], internalNotes: [{ from: 'Mike Chen', content: 'Adding to Q1 2026 roadmap. UI team to review.', timestamp: '2025-10-18T11:05:00' }], activity: [{ type: 'created', user: 'System', timestamp: '2025-10-17T09:15:00', details: 'Ticket created' }, { type: 'assigned', user: 'System', timestamp: '2025-10-17T09:16:00', details: 'Assigned to Mike Chen' }, { type: 'status_changed', user: 'Mike Chen', timestamp: '2025-10-17T10:30:00', details: 'Status changed to In Progress' }], csatRating: null, viewingAgents: [], timeTrackedSeconds: 900, timeLogs: [], customFields: { product_area: 'App' }, isPrivate: false, watchers: [], cc: [], channel: 'web', sentiment: 'positive', serviceRequestId: 'feature_request' },
    { id: 3, subject: 'Billing question', customer: 'Robert Wilson', email: 'robert.w@email.com', status: 'resolved', priority: 'low', assignedTo: 'Sarah Johnson', created: '2025-10-16T14:00:00', lastUpdate: '2025-10-17T16:30:00', firstResponseAt: '2025-10-16T15:00:00', resolvedAt: '2025-10-17T16:30:00', tags: ['Billing'], category: 'Billing', messages: [{ from: 'Robert Wilson', content: 'I was charged twice this month.', timestamp: '2025-10-16T14:00:00', type: 'customer', attachments: [], channel: 'email' }, { from: 'Sarah Johnson', content: 'I have reviewed your account and processed a refund for the duplicate charge.', timestamp: '2025-10-17T16:30:00', type: 'agent', attachments: [], channel: 'email' }], internalNotes: [{ from: 'Sarah Johnson', content: 'Refund processed: $49.99. Reference: REF-2834', timestamp: '2025-10-17T16:28:00' }], activity: [{ type: 'created', user: 'System', timestamp: '2025-10-16T14:00:00', details: 'Ticket created' }, { type: 'assigned', user: 'System', timestamp: '2025-10-16T14:01:00', details: 'Assigned to Sarah Johnson' }, { type: 'status_changed', user: 'Sarah Johnson', timestamp: '2025-10-17T16:30:00', details: 'Status changed to Resolved' }], csatRating: 5, viewingAgents: [], timeTrackedSeconds: 1200, timeLogs: [], customFields: {}, isPrivate: true, watchers: [1], cc: ['billing@company.com'], channel: 'email', sentiment: 'neutral', serviceRequestId: 'billing_inquiry' },
    { id: 4, subject: 'App crashes on startup', customer: 'Lisa Chen', email: 'lisa.chen@email.com', status: 'open', priority: 'urgent', assignedTo: 'Unassigned', created: '2025-10-18T13:00:00', lastUpdate: '2025-10-18T13:00:00', firstResponseAt: null, tags: ['Bug', 'Technical'], category: 'Bug', messages: [{ from: 'Lisa Chen', content: 'The app crashes immediately when I try to open it. I have tried restarting my phone.', timestamp: '2025-10-18T13:00:00', type: 'customer', attachments: ['crash_log.txt'], channel: 'web' }], internalNotes: [], activity: [{ type: 'created', user: 'System', timestamp: '2025-10-18T13:00:00', details: 'Ticket created' }], csatRating: null, viewingAgents: [], timeTrackedSeconds: 0, timeLogs: [], customFields: { product_area: 'App' }, isPrivate: false, watchers: [], cc: [], channel: 'web', sentiment: 'negative', serviceRequestId: 'report_bug' }
  ]);

  knowledgeBaseCategories = signal<KnowledgeBaseCategory[]>([
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'billing', name: 'Billing' },
    { id: 'api', name: 'API & Integrations' },
    { id: 'troubleshooting', name: 'Troubleshooting' },
  ]);

  knowledgeBaseArticles = signal<KnowledgeBaseArticle[]>([
    { id: 1, title: 'How to create your first ticket', content: 'Creating a ticket is easy. Click the "New Ticket" button...', category: 'getting-started', tags: ['tutorial', 'tickets'], createdAt: '2025-01-15T10:00:00', lastUpdatedAt: '2025-01-16T11:30:00' },
    { id: 2, title: 'Understanding your invoice', content: 'Your monthly invoice includes a breakdown of all charges...', category: 'billing', tags: ['invoice', 'payment'], createdAt: '2025-02-01T14:00:00', lastUpdatedAt: '2025-02-01T14:00:00' },
    { id: 3, title: 'Resetting your password', content: 'If you have forgotten your password, you can reset it by...', category: 'troubleshooting', tags: ['account', 'password'], createdAt: '2025-01-20T09:00:00', lastUpdatedAt: '2025-03-10T15:00:00' },
    { id: 4, title: 'Using the REST API', content: 'Our REST API provides programmatic access to your data...', category: 'api', tags: ['developer', 'integration'], createdAt: '2025-03-05T18:00:00', lastUpdatedAt: '2025-03-08T12:00:00' }
  ]);
  
  mockEmails = signal<MockEmail[]>([
    { id: 'email-1', from: 'support-case-345@domain.com', to: 'support@bolddesk.com', subject: 'Urgent: Cannot access my files', body: 'Hello, I am unable to access any of my files. I get an error "Permission Denied". Please help, this is critical for my work. Thanks, David Miller.', receivedAt: '2025-10-18T15:00:00', isRead: false, status: 'unprocessed' },
    { id: 'email-2', from: 'sandra.p@example.net', to: 'support@bolddesk.com', subject: 'Question about my last invoice', body: 'Hi team, I have a quick question regarding invoice #INV-9876. I was expecting a credit to be applied but I don\'t see it. Can you clarify? Best, Sandra', receivedAt: '2025-10-18T14:30:00', isRead: true, status: 'unprocessed' },
    { id: 'email-3', from: 'no-reply@status.com', to: 'support@bolddesk.com', subject: 'Service Degradation Notice', body: 'This is an automated message. We are currently experiencing a partial outage affecting our API services. Our engineering team is aware and working on a fix. We apologize for any inconvenience.', receivedAt: '2025-10-18T12:00:00', isRead: true, status: 'unprocessed' },
  ]);
  
  chatSessions = signal<ChatSession[]>([
    { id: 'chat-1', customerName: 'Kevin Hart', customerEmail: 'kevin.h@email.com', status: 'pending', startedAt: '2025-10-18T16:00:00', messages: [{from: 'customer', name: 'Kevin Hart', content: 'Hi, I need help with setting up my account.', timestamp: '2025-10-18T16:00:00'}], pageUrl: '/pricing' },
    { id: 'chat-2', customerName: 'Emily Davis', customerEmail: 'emily.davis@email.com', status: 'active', agentId: 2, agentName: 'Mike Chen', startedAt: '2025-10-18T15:55:00', messages: [
      { from: 'customer', name: 'Emily Davis', content: 'My new feature request ticket is #2. I was wondering if there is any update on it?', timestamp: '2025-10-18T15:55:00' },
      { from: 'agent', name: 'Mike Chen', content: 'Hi Emily, let me check that for you right now.', timestamp: '2025-10-18T15:56:00' }
    ], pageUrl: '/dashboard' }
  ]);

  readonly filteredTickets: Signal<Ticket[]> = computed(() => {
    const user = this.currentUser();
    let currentTickets = this.tickets();
    
    // Filter for private tickets if user is a customer
    if (!('roleId' in user)) {
        currentTickets = currentTickets.filter(t => !t.isPrivate);
    }
    
    const status = this.filterStatus();
    const tag = this.filterTag();
    const priority = this.filterPriority();
    const assignee = this.filterAssignee();
    const query = this.searchQuery().toLowerCase();
    const advFilters = this.advancedFilters();
    
    return currentTickets.filter(ticket => {
      const statusMatch = status === 'all' || ticket.status === status;
      const tagMatch = tag === 'all' || ticket.tags.includes(tag);
      const priorityMatch = priority === 'all' || ticket.priority === priority;
      const assigneeMatch = (() => {
        if (assignee === 'all') return true;
        if (assignee === 'me') {
          return 'roleId' in user && ticket.assignedTo === user.name;
        }
        return ticket.assignedTo === assignee;
      })();

      let searchMatch = true;
      if (query) {
        searchMatch = 
          ticket.subject.toLowerCase().includes(query) ||
          ticket.customer.toLowerCase().includes(query) ||
          ticket.email.toLowerCase().includes(query) ||
          ticket.id.toString().includes(query);
      }
      
      let advSearchMatch = true;
      if (advFilters.customer && !ticket.customer.toLowerCase().includes(advFilters.customer.toLowerCase())) advSearchMatch = false;
      if (advFilters.agent && advFilters.agent !== 'all' && ticket.assignedTo !== advFilters.agent) advSearchMatch = false;
      if (advFilters.priority && advFilters.priority !== 'all' && ticket.priority !== advFilters.priority) advSearchMatch = false;
      if (advFilters.dateFrom) {
        if (new Date(ticket.created) < new Date(advFilters.dateFrom)) advSearchMatch = false;
      }
      if (advFilters.dateTo) {
        const toDate = new Date(advFilters.dateTo);
        toDate.setHours(23, 59, 59);
        if (new Date(ticket.created) > toDate) advSearchMatch = false;
      }

      if (advSearchMatch) {
        const customFilters = advFilters.customFilters;
        for (const fieldId in customFilters) {
          if (Object.prototype.hasOwnProperty.call(customFilters, fieldId)) {
            const filterValue = customFilters[fieldId];
            const ticketValue = ticket.customFields?.[fieldId];

            if (filterValue === null || filterValue === undefined || filterValue === '' || filterValue === 'all') {
              continue;
            }

            if (ticketValue === undefined || ticketValue === null || ticketValue === '') {
              advSearchMatch = false;
              break;
            }

            const fieldDef = this.customFieldDefinitions().find(def => def.id === fieldId);

            if (fieldDef?.type === 'text') {
              if (!String(ticketValue).toLowerCase().includes(String(filterValue).toLowerCase())) {
                advSearchMatch = false;
              }
            } else { // For number, date, dropdown - exact match
              if (String(ticketValue) !== String(filterValue)) {
                advSearchMatch = false;
              }
            }

            if (!advSearchMatch) {
              break;
            }
          }
        }
      }
      
      return statusMatch && tagMatch && priorityMatch && assigneeMatch && searchMatch && advSearchMatch;
    });
  });

  readonly customerTickets = computed(() => {
    const user = this.currentUser();
    if ('roleId' in user) return [];
    return this.tickets().filter(t => t.email === user.email && !t.isPrivate);
  });
  
  readonly customerTicketHistory = computed(() => {
    const ticket = this.selectedTicket();
    if (!ticket) return [];
    return this.tickets().filter(t => t.email === ticket.email && t.id !== ticket.id);
  });
  
  readonly statusCounts = computed(() => {
      const allTickets = this.tickets();
      return {
          all: allTickets.length,
          open: allTickets.filter(t => t.status === 'open').length,
          'in-progress': allTickets.filter(t => t.status === 'in-progress').length,
          resolved: allTickets.filter(t => t.status === 'resolved').length,
          closed: allTickets.filter(t => t.status === 'closed').length
      };
  });
  
  readonly priorityCounts = computed(() => {
      const allTickets = this.tickets();
      return {
          all: allTickets.length,
          urgent: allTickets.filter(t => t.priority === 'urgent').length,
          high: allTickets.filter(t => t.priority === 'high').length,
          medium: allTickets.filter(t => t.priority === 'medium').length,
          low: allTickets.filter(t => t.priority === 'low').length
      };
  });

  readonly assigneeCounts = computed(() => {
      const allTickets = this.tickets();
      const user = this.currentUser();
      const counts: {[key: string]: number} = {};

      if ('roleId' in user) {
        counts['me'] = allTickets.filter(t => t.assignedTo === user.name).length;
      }

      this.agents().forEach(agent => {
          counts[agent.name] = allTickets.filter(t => t.assignedTo === agent.name).length;
      });
      counts['Unassigned'] = allTickets.filter(t => t.assignedTo === 'Unassigned').length;
      return counts;
  });

  readonly tagCounts = computed(() => {
      const allTickets = this.tickets();
      const counts: {[key: string]: number} = {};
      this.availableTags().forEach(tag => {
          counts[tag] = allTickets.filter(t => t.tags.includes(tag)).length;
      });
      return counts;
  });

  readonly analytics: Signal<AnalyticsData> = computed(() => {
    const currentTickets = this.tickets();
    const ticketsWithCSAT = currentTickets.filter(t => t.csatRating);
    return {
      total: currentTickets.length,
      open: currentTickets.filter(t => t.status === 'open').length,
      inProgress: currentTickets.filter(t => t.status === 'in-progress').length,
      resolved: currentTickets.filter(t => t.status === 'resolved').length,
      avgResponseTime: '2.5 hours',
      customerSatisfaction: '94%',
      slaCompliance: Math.round((currentTickets.filter(t => {
        const sla = this.calculateSLA(t);
        return !sla.responseBreached && !sla.resolutionBreached;
      }).length / currentTickets.length) * 100) + '%',
      avgCSAT: ticketsWithCSAT.length > 0
        ? (ticketsWithCSAT.reduce((sum, t) => sum + (t.csatRating || 0), 0) / ticketsWithCSAT.length).toFixed(1)
        : 'N/A',
      byCategory: this.availableTags().map(tag => ({
        name: tag,
        count: currentTickets.filter(t => t.tags.includes(tag)).length
      })),
      byPriority: {
        urgent: currentTickets.filter(t => t.priority === 'urgent').length,
        high: currentTickets.filter(t => t.priority === 'high').length,
        medium: currentTickets.filter(t => t.priority === 'medium').length,
        low: currentTickets.filter(t => t.priority === 'low').length
      }
    };
  });

  readonly selectedTicketSlaInfo = computed(() => {
    const ticket = this.selectedTicket();
    return ticket ? this.calculateSLA(ticket) : null;
  });

  calculateSLA(ticket: Ticket): SlaInfo {
    const now = new Date();
    const created = new Date(ticket.created);
    const sla = this.slaRules()[ticket.priority];
    
    const responseDeadline = new Date(created.getTime() + sla.responseTime * 60 * 60 * 1000);
    const resolutionDeadline = new Date(created.getTime() + sla.resolutionTime * 60 * 60 * 1000);
    
    const responseTimeLeft = responseDeadline.getTime() - now.getTime();
    const resolutionTimeLeft = resolutionDeadline.getTime() - now.getTime();
    
    return {
      responseDeadline,
      resolutionDeadline,
      responseTimeLeft,
      resolutionTimeLeft,
      responseBreached: !ticket.firstResponseAt && responseTimeLeft < 0,
      resolutionBreached: !ticket.resolvedAt && resolutionTimeLeft < 0,
      responseStatus: ticket.firstResponseAt ? 'met' : (responseTimeLeft < 0 ? 'breached' : (responseTimeLeft < 60 * 60 * 1000 ? 'warning' : 'ok')),
      resolutionStatus: ticket.resolvedAt ? 'met' : (resolutionTimeLeft < 0 ? 'breached' : (resolutionTimeLeft < 2 * 60 * 60 * 1000 ? 'warning' : 'ok'))
    };
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
  
  async handleNewTicket(formData: any) {
    const newTicket: Ticket = {
      id: this.tickets().length + 1,
      subject: formData.subject,
      customer: formData.customer,
      email: formData.email,
      status: 'open',
      priority: formData.priority,
      assignedTo: 'Unassigned',
      created: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      firstResponseAt: null,
      tags: formData.tags || [],
      category: formData.category || 'General',
      messages: [{ from: formData.customer, content: formData.description, timestamp: new Date().toISOString(), type: 'customer', attachments: [], channel: 'web' }],
      internalNotes: [],
      activity: [{ type: 'created', user: 'System', timestamp: new Date().toISOString(), details: 'Ticket created via Web Portal' }],
      csatRating: null,
      viewingAgents: [],
      timeTrackedSeconds: 0,
      timeLogs: [],
      customFields: formData.customFields || {},
      isPrivate: false,
      watchers: [],
      cc: [],
      channel: 'web',
      serviceRequestId: formData.serviceRequestId,
    };
    
    let updatedTicket = this.runAutomationRules(newTicket, 'ticket_created');
    
    // AI Enhancements
    const sentiment = await this.geminiService.analyzeSentiment(updatedTicket);
    const suggestedTags = await this.geminiService.suggestTags(updatedTicket, this.availableTags());
    updatedTicket = { 
        ...updatedTicket, 
        sentiment, 
        tags: [...new Set([...updatedTicket.tags, ...suggestedTags])] 
    };

    this.tickets.update(current => [updatedTicket, ...current]);
    this.showNewTicket.set(false);
    
    this.postToSlack(updatedTicket);

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'new_ticket',
      message: `New ticket #${updatedTicket.id} from ${updatedTicket.customer}`,
      ticketId: updatedTicket.id,
      isRead: false,
      timestamp: new Date().toISOString()
    };
    this.notifications.update(n => [newNotification, ...n]);
  }
  
  runAutomationRules(ticket: Ticket, triggerType: AutomationTrigger['type'], triggerValue?: string): Ticket {
    let updatedTicket = { ...ticket };
    
    this.automationRules().filter(rule => rule.enabled).forEach(rule => {
      let shouldApply = false;
      const { trigger, action } = rule;

      switch(trigger.type) {
        case 'ticket_created':
          if (triggerType === 'ticket_created') shouldApply = true;
          break;
        case 'tag_added':
          if (triggerType === 'tag_added' && trigger.value === triggerValue) shouldApply = true;
          break;
        case 'priority_is':
          if (ticket.priority === trigger.value) shouldApply = true;
          break;
        case 'status_changed_to':
          if (triggerType === 'status_changed_to' && ticket.status === trigger.value) shouldApply = true;
          break;
      }
      
      if (shouldApply) {
        updatedTicket = this.applyAutomationAction(updatedTicket, action, `by rule "${rule.name}"`);
      }
    });
    
    return updatedTicket;
  }
  
  applyAutomationAction(ticket: Ticket, action: AutomationAction, detailsSuffix: string): Ticket {
    let updatedTicket = { ...ticket };
    
    switch(action.type) {
        case 'assign_agent':
            updatedTicket.assignedTo = action.value;
            updatedTicket.activity.push({ type: 'assigned', user: 'System', timestamp: new Date().toISOString(), details: `Assigned to ${action.value} ${detailsSuffix}` });
            break;
        case 'add_tag':
            if (!updatedTicket.tags.includes(action.value)) {
                updatedTicket.tags = [...updatedTicket.tags, action.value];
                updatedTicket.activity.push({ type: 'tag_added', user: 'System', timestamp: new Date().toISOString(), details: `Tag added: ${action.value} ${detailsSuffix}` });
            }
            break;
        case 'change_status':
            updatedTicket.status = action.value as any;
            updatedTicket.lastUpdate = new Date().toISOString();
            updatedTicket.activity.push({ type: 'status_changed', user: 'System', timestamp: new Date().toISOString(), details: `Status changed to ${action.value} ${detailsSuffix}` });
            break;
        case 'change_priority':
             updatedTicket.priority = action.value as any;
             updatedTicket.lastUpdate = new Date().toISOString();
             updatedTicket.activity.push({ type: 'priority_changed', user: 'System', timestamp: new Date().toISOString(), details: `Priority changed to ${action.value} ${detailsSuffix}` });
             break;
        case 'assign_group_round_robin':
        case 'assign_group_load_based':
            const groupAgents = this.agents().filter(a => a.groupIds.includes(action.groupId) && a.status === 'Online');
            if (groupAgents.length > 0) {
                let agentToAssign: Agent | undefined;
                if (action.type === 'assign_group_round_robin') {
                    // Simple round robin implementation
                    const lastAssignedIndex = this.injector.get('lastAssignedIndex', -1) as number;
                    const nextIndex = (lastAssignedIndex + 1) % groupAgents.length;
                    agentToAssign = groupAgents[nextIndex];
                    this.injector['lastAssignedIndex'] = nextIndex;
                } else { // Load-based
                    agentToAssign = groupAgents.reduce((prev, curr) => (prev.load || 0) < (curr.load || 0) ? prev : curr);
                }
                
                if(agentToAssign) {
                    updatedTicket.assignedTo = agentToAssign.name;
                    updatedTicket.activity.push({ type: 'assigned', user: 'System', timestamp: new Date().toISOString(), details: `Assigned to ${agentToAssign.name} ${detailsSuffix}` });
                }
            }
            break;
    }
    
    this.tickets.update(tickets => tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    return updatedTicket;
  }


  updateTicketStatus(event: { ticketId: number, newStatus: 'open' | 'in-progress' | 'resolved' | 'closed' }) {
    this.tickets.update(tickets => tickets.map(t => {
      if (t.id === event.ticketId) {
        const user = this.currentUser();
        const updates: Partial<Ticket> = { 
          status: event.newStatus, 
          lastUpdate: new Date().toISOString(),
          activity: [...t.activity, { type: 'status_changed', user: user.name, timestamp: new Date().toISOString(), details: `Status changed to ${event.newStatus}` }]
        };
        if (event.newStatus === 'resolved' && !t.resolvedAt) {
          updates.resolvedAt = new Date().toISOString();
          this.csatTicket.set(t);
          this.showCSAT.set(true);
        }
        let updatedTicket = { ...t, ...updates };

        updatedTicket = this.runAutomationRules(updatedTicket, 'status_changed_to');

        if(this.selectedTicket()?.id === updatedTicket.id) {
            this.selectedTicket.set(updatedTicket);
        }
        return updatedTicket;
      }
      return t;
    }));
  }

  updateTicketTags(event: { ticketId: number, newTags: string[] }) {
    this.tickets.update(tickets => tickets.map(t => {
      if (t.id === event.ticketId) {
        const user = this.currentUser();
        const addedTags = event.newTags.filter(tag => !t.tags.includes(tag));
        const removedTags = t.tags.filter(tag => !event.newTags.includes(tag));
        const activityEntries = [
          ...addedTags.map(tag => ({ type: 'tag_added', user: user.name, timestamp: new Date().toISOString(), details: `Tag added: ${tag}` })),
          ...removedTags.map(tag => ({ type: 'tag_removed', user: user.name, timestamp: new Date().toISOString(), details: `Tag removed: ${tag}` }))
        ];
        let updatedTicket = { ...t, tags: event.newTags, lastUpdate: new Date().toISOString(), activity: [...t.activity, ...activityEntries] };
        
        addedTags.forEach(tag => {
          updatedTicket = this.runAutomationRules(updatedTicket, 'tag_added', tag);
        });
        
        this.selectedTicket.set(updatedTicket);
        return updatedTicket;
      }
      return t;
    }));
  }

  addReply(event: { ticketId: number; content: string; fromAgent: boolean; attachments: string[] }) {
    let ticketForNotification: Ticket | undefined;

    this.tickets.update(tickets => tickets.map(t => {
      if (t.id === event.ticketId) {
        const user = this.currentUser();
        const updates: Partial<Ticket> = {
          messages: [...t.messages, { from: event.fromAgent ? user.name : t.customer, content: event.content, timestamp: new Date().toISOString(), type: event.fromAgent ? 'agent' : 'customer', attachments: event.attachments, channel: t.channel }],
          lastUpdate: new Date().toISOString(),
          activity: [...t.activity, { type: event.fromAgent ? 'reply_sent' : 'customer_replied', user: event.fromAgent ? user.name : t.customer, timestamp: new Date().toISOString(), details: event.fromAgent ? 'Agent sent reply' : 'Customer replied' }]
        };
        if (event.fromAgent && !t.firstResponseAt) {
          updates.firstResponseAt = new Date().toISOString();
        }
        const updatedTicket = { ...t, ...updates };
        
        if (!event.fromAgent) {
            ticketForNotification = updatedTicket;
        }

        this.selectedTicket.set(updatedTicket);
        return updatedTicket;
      }
      return t;
    }));

    if (ticketForNotification) {
        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            type: 'customer_reply',
            message: `New reply on ticket #${ticketForNotification.id} from ${ticketForNotification.customer}`,
            ticketId: ticketForNotification.id,
            isRead: false,
            timestamp: new Date().toISOString()
        };
        this.notifications.update(n => [newNotification, ...n]);
        // Update sentiment on new customer reply
        this.geminiService.analyzeSentiment(ticketForNotification).then(sentiment => {
            this.tickets.update(tickets => tickets.map(t => t.id === ticketForNotification!.id ? {...t, sentiment} : t));
        });
    }
  }

  addInternalNote(event: { ticketId: number; content: string; agentName: string }) {
    this.tickets.update(tickets => tickets.map(t => {
      if (t.id === event.ticketId) {
        const updatedTicket = { ...t, internalNotes: [...t.internalNotes, { from: event.agentName, content: event.content, timestamp: new Date().toISOString() }], lastUpdate: new Date().toISOString(), activity: [...t.activity, { type: 'note_added', user: event.agentName, timestamp: new Date().toISOString(), details: 'Internal note added' }] };
        this.selectedTicket.set(updatedTicket);
        
        // Handle @mentions
        const mentionRegex = /@([\w\s.\(\)]+)/g;
        let match;
        const mentions = new Set<string>();
        while ((match = mentionRegex.exec(event.content)) !== null) {
          mentions.add(match[1].trim());
        }

        mentions.forEach(agentName => {
          const mentionedAgent = this.agents().find(a => a.name === agentName);
          if (mentionedAgent && mentionedAgent.id !== (this.currentUser() as Agent).id) {
            const newNotification: Notification = {
              id: `notif-${Date.now()}-${t.id}`,
              type: 'mention',
              message: `${event.agentName} mentioned you in ticket #${t.id}`,
              ticketId: t.id,
              isRead: false,
              timestamp: new Date().toISOString()
            };
            this.notifications.update(n => [newNotification, ...n]);
          }
        });

        return updatedTicket;
      }
      return t;
    }));
  }

  submitCSAT(event: { rating: number, comment: string }) {
    const ticketId = this.csatTicket()?.id;
    if(!ticketId) return;

    this.tickets.update(tickets => tickets.map(t => {
      if (t.id === ticketId) {
        return { ...t, csatRating: event.rating, csatComment: event.comment, activity: [...t.activity, { type: 'csat_submitted', user: t.customer, timestamp: new Date().toISOString(), details: `CSAT rating: ${event.rating}/5` }] };
      }
      return t;
    }));
    this.showCSAT.set(false);
    this.csatTicket.set(null);
  }

  handleBulkAction(event: { action: string, value: any }) {
    const ids = this.selectedTicketIds();
    this.tickets.update(tickets => tickets.map(t => {
      if (ids.includes(t.id)) {
        const timestamp = new Date().toISOString();
        let updates: Partial<Ticket> = { lastUpdate: timestamp };
        let activityEntry = null;

        switch(event.action) {
            case 'status':
                updates.status = event.value;
                activityEntry = { type: 'status_changed', user: 'Bulk Action', timestamp, details: `Status changed to ${event.value}` };
                break;
            case 'assign':
                updates.assignedTo = event.value;
                activityEntry = { type: 'assigned', user: 'Bulk Action', timestamp, details: `Assigned to ${event.value}` };
                break;
            case 'priority':
                updates.priority = event.value;
                activityEntry = { type: 'priority_changed', user: 'Bulk Action', timestamp, details: `Priority changed to ${event.value}` };
                break;
            case 'addTag':
                 if (!t.tags.includes(event.value)) {
                    updates.tags = [...t.tags, event.value];
                    activityEntry = { type: 'tag_added', user: 'Bulk Action', timestamp, details: `Tag added: ${event.value}` };
                }
                break;
        }

        if (activityEntry) {
          updates.activity = [...t.activity, activityEntry];
        }
        return { ...t, ...updates };
      }
      return t;
    }));
    this.selectedTicketIds.set([]);
  }

  toggleTicketSelection(ticketId: number) {
    this.selectedTicketIds.update(ids => {
      if (ids.includes(ticketId)) {
        return ids.filter(id => id !== ticketId);
      } else {
        return [...ids, ticketId];
      }
    });
  }

  toggleSelectAll() {
    if (this.selectedTicketIds().length === this.filteredTickets().length) {
      this.selectedTicketIds.set([]);
    } else {
      this.selectedTicketIds.set(this.filteredTickets().map(t => t.id));
    }
  }

  clearAdvancedFilters() {
    this.advancedFilters.set({
      customer: '', agent: '', dateFrom: '', dateTo: '', priority: 'all', customFilters: {}
    });
  }

  updateAdvancedFilterCustomer(customer: string) { this.advancedFilters.update(f => ({ ...f, customer })); }
  updateAdvancedFilterAgent(agent: string) { this.advancedFilters.update(f => ({ ...f, agent })); }
  updateAdvancedFilterPriority(priority: 'all' | 'low' | 'medium' | 'high' | 'urgent') { this.advancedFilters.update(f => ({ ...f, priority }));}
  updateAdvancedFilterDateFrom(dateFrom: string) { this.advancedFilters.update(f => ({ ...f, dateFrom })); }
  updateAdvancedFilterDateTo(dateTo: string) { this.advancedFilters.update(f => ({ ...f, dateTo })); }
  updateAdvancedFilterCustomField(fieldId: string, value: any) {
    this.advancedFilters.update(filters => ({
        ...filters,
        customFilters: {
            ...filters.customFilters,
            [fieldId]: value
        }
    }));
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  applyDatePreset(preset: 'today' | 'last7days' | 'thismonth' | 'lastmonth') {
      const today = new Date();
      let fromDate: Date;
      let toDate: Date = new Date(today);

      switch(preset) {
          case 'today':
              fromDate = new Date(today);
              break;
          case 'last7days':
              fromDate = new Date(today);
              fromDate.setDate(today.getDate() - 6);
              break;
          case 'thismonth':
              fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
              break;
          case 'lastmonth':
              fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
              toDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month
              break;
      }
      
      this.advancedFilters.update(f => ({
          ...f,
          dateFrom: this.formatDateForInput(fromDate),
          dateTo: this.formatDateForInput(toDate)
      }));
  }

  handleMergeTickets(event: { targetTicketId: number; sourceTicketId: number }) {
    this.tickets.update(currentTickets => {
      const targetTicket = currentTickets.find(t => t.id === event.targetTicketId);
      const sourceTicket = currentTickets.find(t => t.id === event.sourceTicketId);
      const user = this.currentUser();

      if (!targetTicket || !sourceTicket) return currentTickets;
      
      const mergedMessages = sourceTicket.messages.map(m => ({...m, content: `(From Ticket #${sourceTicket.id}) ${m.content}`}));
      
      const newActivity: Activity = {
          type: 'merged',
          user: user.name,
          timestamp: new Date().toISOString(),
          details: `Merged ticket #${sourceTicket.id} into this ticket.`
      };

      const updatedTargetTicket = {
          ...targetTicket,
          messages: [...targetTicket.messages, ...mergedMessages],
          activity: [...targetTicket.activity, newActivity],
          lastUpdate: new Date().toISOString()
      };

      const updatedSourceTicket = {
          ...sourceTicket,
          status: 'closed' as const,
          activity: [...sourceTicket.activity, {
              type: 'merged',
              user: user.name,
              timestamp: new Date().toISOString(),
              details: `This ticket was merged into #${targetTicket.id}.`
          }],
          lastUpdate: new Date().toISOString()
      };
      
      const finalTickets = currentTickets.map(t => {
          if (t.id === updatedTargetTicket.id) return updatedTargetTicket;
          if (t.id === updatedSourceTicket.id) return updatedSourceTicket;
          return t;
      });

      if (this.selectedTicket()?.id === sourceTicket.id) {
        this.selectedTicket.set(updatedTargetTicket);
      } else if (this.selectedTicket()?.id === targetTicket.id) {
        this.selectedTicket.set(updatedTargetTicket);
      }
      
      return finalTickets;
    });
  }

  logTime(event: { ticketId: number; durationSeconds: number; agent: string }) {
    this.tickets.update(currentTickets => currentTickets.map(t => {
        if (t.id === event.ticketId) {
            const newTimeTracked = (t.timeTrackedSeconds || 0) + event.durationSeconds;
            const hours = (event.durationSeconds / 3600).toFixed(2);
            const newLog: TimeLog = {
                agent: event.agent,
                durationSeconds: event.durationSeconds,
                timestamp: new Date().toISOString()
            };
            const updatedTicket = {
                ...t,
                timeTrackedSeconds: newTimeTracked,
                timeLogs: [...(t.timeLogs || []), newLog],
                activity: [...t.activity, {
                    type: 'time_logged',
                    user: event.agent,
                    timestamp: new Date().toISOString(),
                    details: `Logged ${hours}h of work.`
                }]
            };
            if(this.selectedTicket()?.id === t.id) {
                this.selectedTicket.set(updatedTicket);
            }
            return updatedTicket;
        }
        return t;
    }));
  }

  applyMacro(event: { ticketId: number; macro: Macro }) {
    this.tickets.update(currentTickets => currentTickets.map(t => {
      if (t.id === event.ticketId) {
        let updatedTicket = { ...t };
        const user = this.currentUser();
        
        event.macro.actions.forEach(action => {
          switch(action.type) {
            case 'change_status':
              updatedTicket.status = action.value as any;
              updatedTicket.activity = [...updatedTicket.activity, { type: 'status_changed', user: user.name, timestamp: new Date().toISOString(), details: `Status changed to ${action.value} by macro "${event.macro.name}"` }];
              break;
            case 'change_priority':
              updatedTicket.priority = action.value as any;
              updatedTicket.activity = [...updatedTicket.activity, { type: 'priority_changed', user: user.name, timestamp: new Date().toISOString(), details: `Priority changed to ${action.value} by macro "${event.macro.name}"` }];
              break;
            case 'add_tag':
              if (!updatedTicket.tags.includes(action.value)) {
                updatedTicket.tags = [...updatedTicket.tags, action.value];
                updatedTicket.activity = [...updatedTicket.activity, { type: 'tag_added', user: user.name, timestamp: new Date().toISOString(), details: `Tag added: ${action.value} by macro "${event.macro.name}"` }];
              }
              break;
            case 'assign_agent':
               updatedTicket.assignedTo = action.value;
               updatedTicket.activity = [...updatedTicket.activity, { type: 'assigned', user: user.name, timestamp: new Date().toISOString(), details: `Assigned to ${action.value} by macro "${event.macro.name}"` }];
               break;
            case 'add_internal_note':
               updatedTicket.internalNotes = [...updatedTicket.internalNotes, { from: user.name, content: action.value, timestamp: new Date().toISOString() }];
               updatedTicket.activity = [...updatedTicket.activity, { type: 'note_added', user: user.name, timestamp: new Date().toISOString(), details: `Internal note added by macro "${event.macro.name}"` }];
               break;
          }
        });
        
        updatedTicket.lastUpdate = new Date().toISOString();
        if (this.selectedTicket()?.id === updatedTicket.id) {
          this.selectedTicket.set(updatedTicket);
        }
        return updatedTicket;
      }
      return t;
    }));
  }

  splitTicket(event: { sourceTicketId: number; message: Message; newSubject: string }) {
    this.tickets.update(currentTickets => {
        const sourceTicket = currentTickets.find(t => t.id === event.sourceTicketId);
        const user = this.currentUser();
        if (!sourceTicket) return currentTickets;

        const newTicketId = Math.max(...currentTickets.map(t => t.id)) + 1;

        const newTicket: Ticket = {
            id: newTicketId,
            subject: event.newSubject,
            customer: sourceTicket.customer,
            email: sourceTicket.email,
            status: 'open',
            priority: 'medium',
            assignedTo: 'Unassigned',
            created: new Date().toISOString(),
            lastUpdate: new Date().toISOString(),
            firstResponseAt: null,
            tags: [],
            category: sourceTicket.category,
            messages: [{...event.message, timestamp: new Date().toISOString()}],
            internalNotes: [],
            activity: [
                { type: 'created', user: 'System', timestamp: new Date().toISOString(), details: 'Ticket created' },
                { type: 'split_from', user: user.name, timestamp: new Date().toISOString(), details: `Split from ticket #${sourceTicket.id}` }
            ],
            csatRating: null,
            customFields: {},
            viewingAgents: [],
            timeTrackedSeconds: 0,
            timeLogs: [],
            isPrivate: false,
            watchers: [],
            cc: [],
            channel: sourceTicket.channel
        };
        
        const updatedSourceTicket = {
            ...sourceTicket,
            internalNotes: [...sourceTicket.internalNotes, {
                from: user.name,
                content: `A message from this ticket was split into a new ticket #${newTicketId}.\n\nOriginal message content:\n"${event.message.content}"`,
                timestamp: new Date().toISOString()
            }],
            activity: [...sourceTicket.activity, {
                type: 'split_to',
                user: user.name,
                timestamp: new Date().toISOString(),
                details: `Message split to new ticket #${newTicketId}`
            }],
            lastUpdate: new Date().toISOString()
        };
        
        const finalTickets = currentTickets.map(t => t.id === sourceTicket.id ? updatedSourceTicket : t);
        
        setTimeout(() => this.selectedTicket.set(newTicket), 0);

        return [newTicket, ...finalTickets];
    });
  }

  updateSlaRules(newRules: SlaRules) {
      this.slaRules.set(newRules);
      this.showSlaManagement.set(false);
  }
  
  exportToCsv() {
    const ticketsToExport = this.filteredTickets();
    if (ticketsToExport.length === 0) return;

    const headers = ['ID', 'Subject', 'Customer', 'Email', 'Status', 'Priority', 'Assigned To', 'Created', 'Tags'];
    const rows = ticketsToExport.map(t => [
        t.id,
        `"${t.subject.replace(/"/g, '""')}"`,
        `"${t.customer.replace(/"/g, '""')}"`,
        t.email,
        t.status,
        t.priority,
        t.assignedTo,
        t.created,
        t.tags.join(', ')
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tickets_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // Omnichannel handlers
  handleConvertToTicketFromEmail(email: MockEmail) {
    const newTicketId = this.tickets().length + 1;
    const newTicket: Ticket = {
      id: newTicketId,
      subject: email.subject,
      customer: email.from.split('@')[0].replace(/[^a-zA-Z\s]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email.from,
      status: 'open',
      priority: 'medium',
      assignedTo: 'Unassigned',
      created: email.receivedAt,
      lastUpdate: new Date().toISOString(),
      firstResponseAt: null,
      tags: ['Email'],
      category: 'General',
      messages: [{ from: email.from, content: email.body, timestamp: email.receivedAt, type: 'customer', attachments: [], channel: 'email' }],
      internalNotes: [],
      activity: [{ type: 'created', user: 'System', timestamp: new Date().toISOString(), details: 'Ticket created from Email' }],
      csatRating: null,
      viewingAgents: [],
      timeTrackedSeconds: 0,
      timeLogs: [],
      customFields: {},
      isPrivate: false,
      watchers: [],
      cc: [email.to],
      channel: 'email'
    };
    
    this.mockEmails.update(emails => emails.map(e => e.id === email.id ? {...e, status: 'ticket_created', ticketId: newTicketId} : e));
    const updatedTicket = this.runAutomationRules(newTicket, 'ticket_created');
    this.tickets.update(current => [updatedTicket, ...current]);
    this.activeView.set('tickets');
    setTimeout(() => this.selectedTicket.set(updatedTicket), 0);
  }
  
  handleStartChat(event: { initialMessage: string, browserInfo: string, pageUrl: string }) {
    const user = this.currentUser();
    if('roleId' in user) return;

    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      customerName: user.name,
      customerEmail: user.email,
      status: 'pending',
      startedAt: new Date().toISOString(),
      messages: [{from: 'customer', name: user.name, content: event.initialMessage, timestamp: new Date().toISOString()}],
      pageUrl: event.pageUrl,
      browserInfo: event.browserInfo
    };
    this.chatSessions.update(sessions => [...sessions, newChat]);
  }

  handleSendChatMessage(event: { chatId: string; content: string; from: 'customer' | 'agent' }) {
    this.chatSessions.update(sessions => sessions.map(s => {
      if (s.id === event.chatId) {
        const user = this.currentUser();
        const newMessage: ChatMessage = {
          from: event.from,
          name: user.name,
          content: event.content,
          timestamp: new Date().toISOString()
        };
        const updatedSession = { ...s, messages: [...s.messages, newMessage] };
        
        // Simulate agent/customer reply
        if (event.from === 'customer') {
          setTimeout(() => this.simulateAgentReply(event.chatId), 1500);
        } else {
          setTimeout(() => this.simulateCustomerReply(event.chatId), 2000);
        }

        return updatedSession;
      }
      return s;
    }));
  }
  
  simulateAgentReply(chatId: string) {
    this.chatSessions.update(sessions => sessions.map(s => {
      if (s.id === chatId && s.agentName) {
         const newMessage: ChatMessage = { from: 'agent', name: s.agentName, content: 'Thanks for waiting. I am looking into this now.', timestamp: new Date().toISOString() };
         return {...s, messages: [...s.messages, newMessage]};
      }
      return s;
    }));
  }
  
  simulateCustomerReply(chatId: string) {
     this.chatSessions.update(sessions => sessions.map(s => {
      if (s.id === chatId) {
         const newMessage: ChatMessage = { from: 'customer', name: s.customerName, content: 'Okay, thank you!', timestamp: new Date().toISOString() };
         return {...s, messages: [...s.messages, newMessage]};
      }
      return s;
    }));
  }

  handleAcceptChat(chatId: string) {
    this.chatSessions.update(sessions => sessions.map(s => {
      if (s.id === chatId) {
        const agent = this.currentUser();
        if ('roleId' in agent) {
          const updatedSession = { ...s, status: 'active' as const, agentId: agent.id, agentName: agent.name };
          const welcomeMessage: ChatMessage = { from: 'agent', name: agent.name, content: `Hi ${s.customerName}, my name is ${agent.name.split(' ')[0]}. How can I help you today?`, timestamp: new Date().toISOString()};
          updatedSession.messages.push(welcomeMessage);
          return updatedSession;
        }
      }
      return s;
    }));
  }
  
  handleConvertToTicketFromChat(chat: ChatSession) {
    const newTicketId = this.tickets().length + 1;
    const chatTranscript = chat.messages.map(m => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.name}: ${m.content}`).join('\n');
    const contextNote = `Chat started on: ${chat.pageUrl || 'N/A'}\nBrowser: ${chat.browserInfo || 'N/A'}`;
    const newTicket: Ticket = {
      id: newTicketId,
      subject: `Chat with ${chat.customerName} from ${chat.pageUrl || 'site'}`,
      customer: chat.customerName,
      email: chat.customerEmail,
      status: 'open',
      priority: 'medium',
      assignedTo: chat.agentName || 'Unassigned',
      created: chat.startedAt,
      lastUpdate: new Date().toISOString(),
      firstResponseAt: new Date().toISOString(),
      tags: ['Chat'],
      category: 'General',
      messages: [{ from: chat.customerName, content: `Chat transcript attached:\n\n${chatTranscript}`, timestamp: chat.startedAt, type: 'customer', attachments: [], channel: 'chat' }],
      internalNotes: [{ from: 'System', content: contextNote, timestamp: new Date().toISOString() }],
      activity: [{ type: 'created', user: 'System', timestamp: new Date().toISOString(), details: 'Ticket created from Live Chat' }],
      csatRating: null,
      viewingAgents: [],
      timeTrackedSeconds: 0,
      timeLogs: [],
      customFields: {},
      isPrivate: false,
      watchers: [],
      cc: [],
      channel: 'chat'
    };
    
    this.chatSessions.update(sessions => sessions.map(s => s.id === chat.id ? {...s, status: 'ticket_created', ticketId: newTicketId} : s));
    const updatedTicket = this.runAutomationRules(newTicket, 'ticket_created');
    this.tickets.update(current => [updatedTicket, ...current]);
    this.activeView.set('tickets');
    setTimeout(() => this.selectedTicket.set(updatedTicket), 0);
  }

  // Notification Handlers
  toggleNotifications() {
    this.showNotifications.update(s => !s);
  }

  viewNotification(notification: Notification) {
    this.notifications.update(notifications => notifications.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
    ));

    const ticketToSelect = this.tickets().find(t => t.id === notification.ticketId);
    if (ticketToSelect) {
        this.activeView.set('tickets');
        this.selectedTicket.set(ticketToSelect);
    }
    
    this.showNotifications.set(false);
  }

  markAllAsRead() {
    this.notifications.update(notifications => notifications.map(n => ({ ...n, isRead: true })));
  }

  handleAddWatcher(event: { ticketId: number; agentId: number }) {
    this.tickets.update(tickets => tickets.map(t => {
      if (t.id === event.ticketId) {
        if (!t.watchers?.includes(event.agentId)) {
          const watcherIds = [...(t.watchers || []), event.agentId];
          const agentName = this.agents().find(a => a.id === event.agentId)?.name || 'Unknown Agent';
          const newActivity: Activity = {
            type: 'watcher_added',
            user: this.currentUser().name,
            timestamp: new Date().toISOString(),
            details: `${agentName} was added as a watcher.`
          };
          const updatedTicket = { ...t, watchers: watcherIds, activity: [...t.activity, newActivity], lastUpdate: new Date().toISOString() };
          
          if(this.selectedTicket()?.id === t.id) {
            this.selectedTicket.set(updatedTicket);
          }
          return updatedTicket;
        }
      }
      return t;
    }));
  }

  handleRemoveWatcher(event: { ticketId: number; agentId: number }) {
    this.tickets.update(tickets => tickets.map(t => {
      if (t.id === event.ticketId) {
        if (t.watchers?.includes(event.agentId)) {
          const watcherIds = t.watchers.filter(id => id !== event.agentId);
          const agentName = this.agents().find(a => a.id === event.agentId)?.name || 'Unknown Agent';
          const newActivity: Activity = {
            type: 'watcher_removed',
            user: this.currentUser().name,
            timestamp: new Date().toISOString(),
            details: `${agentName} was removed as a watcher.`
          };
          const updatedTicket = { ...t, watchers: watcherIds, activity: [...t.activity, newActivity], lastUpdate: new Date().toISOString() };
          
          if(this.selectedTicket()?.id === t.id) {
            this.selectedTicket.set(updatedTicket);
          }
          return updatedTicket;
        }
      }
      return t;
    }));
  }

  handleLinkTicket(event: { parentId: number, childId: number }) {
      this.tickets.update(tickets => {
          let parentTicket: Ticket | undefined;
          let childTicket: Ticket | undefined;

          // Find tickets
          for(const ticket of tickets) {
              if (ticket.id === event.parentId) parentTicket = ticket;
              if (ticket.id === event.childId) childTicket = ticket;
          }

          if (!parentTicket || !childTicket) return tickets;

          // Update parent
          const updatedParent = {
              ...parentTicket,
              childTicketIds: [...(parentTicket.childTicketIds || []), event.childId],
              activity: [...parentTicket.activity, {
                  type: 'linked', user: this.currentUser().name, timestamp: new Date().toISOString(), details: `Linked ticket #${event.childId} as a child.`
              }]
          };

          // Update child
          const updatedChild = {
              ...childTicket,
              parentId: event.parentId,
              activity: [...childTicket.activity, {
                  type: 'linked', user: this.currentUser().name, timestamp: new Date().toISOString(), details: `This ticket was linked to parent #${event.parentId}.`
              }]
          };

          const newTickets = tickets.map(t => {
              if (t.id === event.parentId) return updatedParent;
              if (t.id === event.childId) return updatedChild;
              return t;
          });
          
          if(this.selectedTicket()?.id === event.parentId) {
              this.selectedTicket.set(updatedParent);
          }

          return newTickets;
      });
  }

  // Views Handlers
  applyView(viewId: string | null) {
    if (viewId === null || viewId === 'all') {
      this.resetAllFilters();
      this.activeViewId.set('all');
      return;
    }

    const view = this.savedViews().find(v => v.id === viewId);
    if (view) {
      this.filterStatus.set(view.filters.status);
      this.filterTag.set(view.filters.tag);
      this.filterPriority.set(view.filters.priority);
      this.filterAssignee.set(view.filters.assignee);
      this.searchQuery.set(view.filters.searchQuery);
      this.advancedFilters.set(view.filters.advancedFilters);
      this.activeViewId.set(viewId);
      this.selectedTicketIds.set([]);
      this.selectedTicket.set(null);
    }
  }

  resetAllFilters() {
    this.filterStatus.set('all');
    this.filterTag.set('all');
    this.filterPriority.set('all');
    this.filterAssignee.set('all');
    this.searchQuery.set('');
    this.clearAdvancedFilters();
    this.selectedTicketIds.set([]);
    this.selectedTicket.set(null);
  }

  saveCurrentView() {
    const viewName = prompt("Enter a name for this view:");
    if (viewName) {
      const newView: View = {
        id: `view-${Date.now()}`,
        name: viewName,
        filters: {
          status: this.filterStatus(),
          tag: this.filterTag(),
          priority: this.filterPriority(),
          assignee: this.filterAssignee(),
          searchQuery: this.searchQuery(),
          advancedFilters: JSON.parse(JSON.stringify(this.advancedFilters()))
        }
      };
      this.savedViews.update(views => [...views, newView]);
      this.activeViewId.set(newView.id);
    }
  }

  deleteView(viewId: string) {
    if (confirm("Are you sure you want to delete this view?")) {
      this.savedViews.update(views => views.filter(v => v.id !== viewId));
      if (this.activeViewId() === viewId) {
        this.applyView('all');
      }
    }
  }

  // Slack Integration Handlers
  postToSlack(ticket: Ticket) {
    if (!this.slackSettings().enabled) return;

    const priorityColors: {[key: string]: string} = {
        urgent: '#A855F7',
        high: '#EF4444',
        medium: '#F97316',
        low: '#6B7280'
    };

    const newMessage: SlackMessage = {
      id: `slack-${Date.now()}`,
      author: 'BoldDesk Bot',
      authorIcon: 'B',
      timestamp: new Date().toISOString(),
      attachment: {
        color: priorityColors[ticket.priority] || '#6B7280',
        title: `New Ticket #${ticket.id}: ${ticket.subject}`,
        title_link: `/tickets/${ticket.id}`,
        fields: [
          { title: 'Customer', value: ticket.customer, short: true },
          { title: 'Priority', value: ticket.priority, short: true },
          { title: 'Assigned To', value: ticket.assignedTo, short: true },
          { title: 'Tags', value: ticket.tags.join(', ') || 'None', short: true }
        ]
      }
    };
    this.slackMessages.update(messages => [newMessage, ...messages]);
  }
  
  handleCreateTicketFromSlack(subject: string) {
    const user = this.currentUser();
    this.handleNewTicket({
        subject,
        customer: user.name,
        email: 'roleId' in user ? user.email : 'slack-user@example.com',
        description: `Ticket created from Slack by ${user.name}`,
        priority: 'medium',
        tags: ['Slack'],
        customFields: {}
    });
    const successMessage: SlackMessage = {
        id: `slack-${Date.now()}`,
        author: user.name,
        authorIcon: user.name.charAt(0),
        timestamp: new Date().toISOString(),
        content: `I've created a new ticket: "${subject}"`
    };
    this.slackMessages.update(messages => [successMessage, ...messages]);
  }
  
  handleViewTicketFromSlack(ticketId: number) {
      const ticket = this.tickets().find(t => t.id === ticketId);
      if (ticket) {
          this.activeView.set('tickets');
          this.selectedTicket.set(ticket);
      }
  }
}
