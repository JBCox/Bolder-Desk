import * as models from './models';
import { mockKnowledgeBaseArticles, mockKnowledgeBaseCategories } from './data/knowledge-base.data';

const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const minutesAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();

export const mockAgents: models.Agent[] = [
    { id: 1, name: 'Alex Ray', email: 'alex@example.com', role: 'Admin', onlineStatus: 'online', skills: ['billing', 'api', 'enterprise'] },
    { id: 2, name: 'Jordan Lee', email: 'jordan@example.com', role: 'Agent', onlineStatus: 'online', skills: ['onboarding', 'mobile'] },
    { id: 3, name: 'Casey Dell', email: 'casey@example.com', role: 'Agent', onlineStatus: 'away', skills: ['billing', 'mobile'] },
    { id: 4, name: 'Morgan Pat', email: 'morgan@example.com', role: 'Agent', onlineStatus: 'offline', skills: ['api', 'enterprise'] },
];

export const mockGroups: models.Group[] = [
    { id: 1, name: 'Billing Team', memberIds: [1, 3] },
    { id: 2, name: 'Tier 2 Support', memberIds: [1, 4] },
    { id: 3, name: 'Mobile Team', memberIds: [2, 3] },
];

export const mockOrganizations: models.Organization[] = [
    { id: 1, name: 'Innovate Inc.', domain: 'innovate.com', healthScore: 95, industry: 'Technology', isVip: true, slaTier: 'Premium', timezone: 'PST' },
    { id: 2, name: 'Synergy Corp.', domain: 'synergy.com', healthScore: 80, industry: 'Finance', isVip: false, slaTier: 'Standard', timezone: 'EST' },
    { id: 3, name: 'Quantum Solutions', domain: 'quantum.com', healthScore: 70, industry: 'Healthcare', isVip: false, slaTier: 'Standard', timezone: 'CST' },
];

export const mockContacts: models.Contact[] = [
    { id: 1, name: 'Sam Taylor', email: 'sam@innovate.com', organizationId: 1, tags: ['vip'], createdAt: daysAgo(10), title: 'Engineering Manager' },
    { id: 2, name: 'Riley Green', email: 'riley@synergy.com', organizationId: 2, tags: ['beta-tester'], createdAt: daysAgo(20), title: 'Product Manager' },
    { id: 3, name: 'Devin Hill', email: 'devin@quantum.com', organizationId: 3, tags: [], createdAt: daysAgo(5), title: 'Data Analyst' },
    { id: 4, name: 'Chris Evans', email: 'chris@innovate.com', organizationId: 1, tags: [], createdAt: daysAgo(30), title: 'Lead Developer' },
];

export const mockTickets: models.Ticket[] = [
    { 
        id: 101, subject: 'Cannot login to my account', contactId: 1, created: hoursAgo(2), updated: minutesAgo(5), status: 'open', priority: 'high', assignedTo: 'Alex Ray', tags: ['login', 'critical'],
        messages: [
            { id: 1, from: 'Sam Taylor', type: 'customer', content: 'I can\'t seem to login. It says "Invalid Credentials". I tried resetting my password but no email came.', timestamp: hoursAgo(2), attachments: [] },
            { id: 2, from: 'Alex Ray', type: 'agent', content: 'Hi Sam, looking into this for you now. Can you confirm you checked your spam folder for the reset email?', timestamp: minutesAgo(5), attachments: [] }
        ],
        internalNotes: [], activities: [], sla: { status: 'risk', firstResponseDue: hoursAgo(-1), resolutionDue: hoursAgo(-4) },
        sentiment: 'negative', predictedSatisfaction: 2.5, source: 'email', timeTrackedSeconds: 300
    },
    { 
        id: 102, subject: 'Question about API rate limits', contactId: 2, created: hoursAgo(8), updated: hoursAgo(1), status: 'open', priority: 'medium', assignedTo: 'Morgan Pat', tags: ['api'],
        messages: [{ id: 1, from: 'Riley Green', type: 'customer', content: 'What are the rate limits for the v2 API? The docs seem to be down.', timestamp: hoursAgo(8), attachments: [] }],
        internalNotes: [], activities: [], sla: { status: 'ok', firstResponseDue: hoursAgo(-3), resolutionDue: hoursAgo(-16) },
        sentiment: 'neutral', predictedSatisfaction: 4.0, source: 'portal', timeTrackedSeconds: 120
    },
    { 
        id: 103, subject: 'Billing issue on last invoice', contactId: 3, created: daysAgo(1), updated: hoursAgo(4), status: 'pending', priority: 'high', assignedTo: 'Casey Dell', tags: ['billing', 'invoice'],
        messages: [
            { id: 1, from: 'Devin Hill', type: 'customer', content: 'I was overcharged on my last invoice. Can someone please look into this?', timestamp: daysAgo(1), attachments: ['invoice.pdf'] },
            { id: 2, from: 'Casey Dell', type: 'agent', content: 'Hi Devin, I see the discrepancy. I\'ve escalated this to our finance team to get it corrected for you. I will update you as soon as I hear back.', timestamp: hoursAgo(4), attachments: [] }
        ],
        internalNotes: [{ id: 1, agentName: 'Casey Dell', content: '@Alex Ray can you approve the credit for this customer?', timestamp: hoursAgo(3) }], activities: [],
        sentiment: 'negative', predictedSatisfaction: 3.0, source: 'chat', timeTrackedSeconds: 600
    },
    { 
        id: 104, subject: 'Feature request: Dark mode', contactId: 4, created: daysAgo(3), updated: daysAgo(2), status: 'resolved', resolvedAt: daysAgo(2), priority: 'low', assignedTo: 'Jordan Lee', tags: ['feature-request'],
        messages: [
            { id: 1, from: 'Chris Evans', type: 'customer', content: 'I would love to see a dark mode in the app!', timestamp: daysAgo(3), attachments: [] },
            { id: 2, from: 'Jordan Lee', type: 'agent', content: 'Thanks for the suggestion, Chris! I\'ve added your vote to our internal tracker for this feature. We appreciate the feedback!', timestamp: daysAgo(2), attachments: [] }
        ],
        internalNotes: [], activities: [],
        sentiment: 'positive', predictedSatisfaction: 5.0, source: 'email', timeTrackedSeconds: 60
    },
    {
        id: 105, subject: 'App is crashing on startup (iOS)', contactId: 1, created: daysAgo(1), updated: hoursAgo(6), status: 'open', priority: 'urgent', assignedTo: 'Jordan Lee', tags: ['mobile', 'bug'],
        messages: [{id: 1, from: 'Sam Taylor', type: 'customer', content: 'My app won\'t open anymore after the last update.', timestamp: daysAgo(1), attachments: []}],
        internalNotes: [], activities: [], sentiment: 'negative', predictedSatisfaction: 1.5, source: 'portal', timeTrackedSeconds: 0
    }
];

export const mockCustomFieldDefs: models.CustomFieldDefinition[] = [
    { id: 'cf_order_id', name: 'Order ID', type: 'text' },
    { id: 'cf_plan_type', name: 'Plan Type', type: 'dropdown', options: ['Free', 'Pro', 'Enterprise'] },
    { id: 'cf_renewal_date', name: 'Renewal Date', type: 'date' }
];

mockTickets[0].customFields = { 'cf_plan_type': 'Enterprise' };
mockTickets[1].customFields = { 'cf_plan_type': 'Pro', 'cf_renewal_date': '2024-12-01' };

export const mockAnalyticsData: models.AnalyticsData = {
    ticketsCreated: 125,
    ticketsResolved: 110,
    avgFirstResponseTime: 15.5,
    avgResolutionTime: 8.2,
    satisfactionScore: 92.4,
    csatDrivers: {
        "Product Quality": 25,
        "Customer Service": 45,
        "Pricing": 10,
    },
};

export const mockTicketViews: models.TicketView[] = [
    { 
        id: 'all', name: 'All Tickets', ownerId: 0, visibility: 'shared', filters: [],
        displayOptions: { columns: ['id', 'subject', 'contact', 'status', 'priority'], sortBy: 'created', sortDirection: 'desc' }
    },
    { 
        id: 'my_assigned', name: 'My Assigned Tickets', ownerId: 1, visibility: 'private', 
        filters: [{ id: 'g1', matchType: 'all', conditions: [{ id: 'c1', field: 'assignedTo', operator: 'is', value: 'Alex Ray' }, {id: 'c2', field: 'status', operator: 'is_not', value: 'resolved'}] }],
        displayOptions: { columns: ['id', 'subject', 'contact', 'priority', 'updated'], sortBy: 'updated', sortDirection: 'desc' },
        isPinned: true
    },
    { 
        id: 'billing_queue', name: 'Billing Queue', ownerId: 1, visibility: 'shared', sharedWithGroupIds: [1],
        filters: [{ id: 'g1', matchType: 'all', conditions: [{ id: 'c1', field: 'tags', operator: 'contains', value: 'billing' }] }],
        displayOptions: { columns: ['id', 'subject', 'contact', 'priority', 'status'], sortBy: 'priority', sortDirection: 'asc' },
        isPinned: false
    },
];

export const mockFormTemplates: models.FormTemplate[] = [
    {
        id: 'bug_report', name: 'Bug Report', fields: [
            { id: 'f1', name: 'subject', label: 'Subject', type: 'text', required: true, conditionalLogic: null, options: [] },
            { id: 'f2', name: 'description', label: 'Description', type: 'textarea', required: true, conditionalLogic: null, options: [] },
            { id: 'f3', name: 'platform', label: 'Platform', type: 'dropdown', required: true, options: ['Web', 'iOS', 'Android'], conditionalLogic: null },
        ]
    },
    {
        id: 'feature_request', name: 'Feature Request', fields: [
            { id: 'f1', name: 'subject', label: 'What feature are you requesting?', type: 'text', required: true, conditionalLogic: null, options: [] },
            { id: 'f2', name: 'business_case', label: 'What problem would this solve for you?', type: 'textarea', required: true, conditionalLogic: null, options: [] },
        ]
    },
    { id: 'blank', name: 'Blank Ticket', fields: [
        { id: 'f1', name: 'subject', label: 'Subject', type: 'text', required: true, conditionalLogic: null, options: [] },
        { id: 'f2', name: 'description', label: 'Description', type: 'textarea', required: true, conditionalLogic: null, options: [] },
    ]}
];

export const mockSlaRules: models.SlaRules = {
    urgent: { responseTime: 1, resolutionTime: 4 },
    high: { responseTime: 4, resolutionTime: 24 },
    medium: { responseTime: 8, resolutionTime: 48 },
    low: { responseTime: 24, resolutionTime: 120 }
};

export const mockAutomationRules: models.AutomationRule[] = [
    // FIX: Added missing 'conditions' property to align with the AutomationRule model.
    { id: 1, name: 'Auto-assign billing tickets to Billing Team', enabled: true, trigger: { type: 'tag_added', value: 'billing' }, conditions: [], action: { type: 'assign_group_round_robin', payload: 1 } },
    // FIX: Added missing 'conditions' property to align with the AutomationRule model.
    { id: 2, name: 'Notify on high priority tickets', enabled: true, trigger: { type: 'priority_is', value: 'high' }, conditions: [], action: { type: 'send_email', payload: 'tier2-leads@example.com' } },
    // FIX: Added missing 'conditions' property to align with the AutomationRule model.
    { id: 3, name: 'Auto-resolve inactive tickets', enabled: false, trigger: { type: 'time_since_status', status: 'pending', hours: 72 }, conditions: [], action: { type: 'change_status', payload: 'resolved' } },
];

export const mockEmails: models.MockEmail[] = [
    { id: 'email1', from: 'no-reply@monitor.com', to: 'support@bolddesk.com', subject: '[Alert] Server CPU > 90%', body: 'Server "prod-web-1" has high CPU usage.', receivedAt: minutesAgo(5), isRead: false, status: 'unprocessed' },
    { id: 'email2', from: 'new-user@gmail.com', to: 'support@bolddesk.com', subject: 'Help with onboarding', body: 'Hi, I just signed up and need some help getting started.', receivedAt: minutesAgo(20), isRead: false, status: 'unprocessed' },
    { id: 'email3', from: 'old-customer@innovate.com', to: 'support@bolddesk.com', subject: 'Re: Your ticket #104', body: 'Thanks for the quick reply!', receivedAt: daysAgo(1), isRead: true, status: 'ticket_created', ticketId: 104 },
];

export const mockChatSessions: models.ChatSession[] = [
    { id: 'chat1', customerName: 'Jamie Fox', customerEmail: 'jamie@innovate.com', status: 'pending', createdAt: minutesAgo(2), transcript: [{ sender: 'customer', content: 'Hi, I need help with my bill.', timestamp: minutesAgo(2), name: 'Jamie Fox' }], initialMessage: 'Hi, I need help with my bill.', pageUrl: '/billing' },
    { id: 'chat2', customerName: 'Pat Doe', customerEmail: 'pat@synergy.com', status: 'active', agentId: 2, createdAt: minutesAgo(10), transcript: [
        { sender: 'customer', content: 'My app is crashing', timestamp: minutesAgo(10), name: 'Pat Doe' },
        { sender: 'agent', content: 'Hi Pat, I can help with that. Can you tell me what version of the app you are using?', timestamp: minutesAgo(8), name: 'Jordan Lee' },
    ], initialMessage: 'My app is crashing', pageUrl: '/dashboard' }
];

export const mockWallboardData: models.WallboardData = {
    openTickets: mockTickets.filter(t => t.status === 'open' || t.status === 'pending').length,
    todaysResolved: 5,
    slaBreachRisks: mockTickets.filter(t => t.sla?.status === 'risk').length,
    agentsOnline: mockAgents.filter(a => a.onlineStatus === 'online').length,
    longestWaitTime: "4h 12m",
    agentStatus: mockAgents.map(a => ({ name: a.name, status: a.onlineStatus, tickets: mockTickets.filter(t => t.assignedTo === a.name && t.status === 'open').length })),
    liveCsat: 94.1
};

export const mockRoles: models.Role[] = [
    { id: 'admin', name: 'Administrator', description: 'Has all permissions and can manage settings.', permissions: ['tickets:read', 'tickets:create', 'tickets:update', 'tickets:delete', 'contacts:read', 'contacts:create', 'contacts:update', 'contacts:delete', 'reports:view', 'settings:access', 'admin:access'] },
    { id: 'agent', name: 'Agent', description: 'Can manage tickets and contacts.', permissions: ['tickets:read', 'tickets:create', 'tickets:update', 'contacts:read', 'contacts:create'] },
    { id: 'viewer', name: 'Viewer', description: 'Read-only access to tickets and reports.', permissions: ['tickets:read', 'reports:view'] }
];

export const allPermissions: models.Permission[] = ['tickets:read', 'tickets:create', 'tickets:update', 'tickets:delete', 'contacts:read', 'contacts:create', 'contacts:update', 'contacts:delete', 'reports:view', 'settings:access', 'admin:access'];

export const mockQaRubrics: models.QARubric[] = [
    { id: 'rubric1', name: 'Standard Support Interaction', criteria: [
        { id: 'crit1', name: 'Opening & Tone', description: 'Agent was polite and professional.', maxScore: 10 },
        { id: 'crit2', name: 'Problem Identification', description: 'Agent correctly identified the customer\'s issue.', maxScore: 20 },
        { id: 'crit3', name: 'Solution Accuracy', description: 'Agent provided an accurate and effective solution.', maxScore: 50 },
        { id: 'crit4', name: 'Closing', description: 'Agent confirmed resolution and closed politely.', maxScore: 20 },
    ]}
];

export const mockQaReviews: models.QAReview[] = [];

export const mockSsoSettings: models.SsoSettings = {
    enabled: false,
    providerUrl: '',
    clientId: '',
    clientSecret: '',
};

export const mockAuditLog: models.AuditLogEntry[] = [
    { id: 1, user: 'Alex Ray', action: 'updated ticket #101 priority to high.', timestamp: hoursAgo(1), icon: 'trending-up' },
    { id: 2, user: 'System', action: 'ran automation rule "Auto-assign billing tickets".', timestamp: hoursAgo(2), icon: 'zap' },
    { id: 3, user: 'Alex Ray', action: 'viewed the Analytics dashboard.', timestamp: hoursAgo(3), icon: 'bar-chart-3' },
];

export const mockApiKeys: models.ApiKey[] = [
    { id: 'ak_1', name: 'Main API Key', key: 'sk_live_xxxxxxxxxxxx', createdAt: daysAgo(30), lastUsedAt: hoursAgo(2) },
];

export const mockWebhooks: models.Webhook[] = [
    { id: 'wh_1', url: 'https://api.example.com/webhook', events: ['ticket.created', 'ticket.resolved'], status: 'active', deliveries: [] },
];

export const mockSlackMessages: models.SlackMessage[] = [
    { id: 'sm1', user: 'Sarah', text: 'Hey team, we have a P1 issue with login failures for @Innovate Inc.', ts: '1678886400', channel: 'C012AB3CD', linkedTicketId: 101, isSupportRequest: true, status: 'ticket_created' },
    { id: 'sm2', user: 'Mike', text: 'Can someone look at this API question? Client is @Synergy Corp.', ts: '1678883400', channel: 'C012AB3CD', isSupportRequest: true, status: 'unprocessed' }
];

export const mockSlackSettings: models.SlackSettings = {
    connected: true,
    supportChannel: 'support-requests',
    notificationChannels: { 'ticket.created': ['C012AB3CD'], 'ticket.resolved': [] }
};

export const mockFacebookThreads: models.FacebookThread[] = [
    { id: 'fb1', customerName: 'John Doe', customerHandle: 'john.doe', customerProfilePic: `https://i.pravatar.cc/40?u=fb1`, lastMessageSnippet: 'Your website is down!', updatedAt: minutesAgo(10), status: 'unprocessed', messages: [{sender: 'customer', content: 'Your website is down! I can\'t access my account.'}] }
];
export const mockTwitterThreads: models.TwitterThread[] = [
    { id: 'tw1', customerName: 'Jane Smith', customerHandle: '@janesmith', customerProfilePic: `https://i.pravatar.cc/40?u=tw1`, lastMessageSnippet: 'Loving the dark mode.', updatedAt: hoursAgo(1), status: 'unprocessed', messages: [{sender: 'customer', content: '@BoldDesk your new update is amazing! Loving the dark mode.'}] }
];
export const mockWhatsAppThreads: models.WhatsAppThread[] = [
    { id: 'wa1', customerName: 'Carlos Ray', customerHandle: '+15551234567', customerProfilePic: ``, customerPhone: '+15551234567', lastMessageSnippet: 'I need help with my recent order.', updatedAt: minutesAgo(30), status: 'unprocessed', messages: [{sender: 'customer', content: 'I need help with my recent order.'}] }
];
export const mockSalesforceSettings: models.SalesforceSettings = { connected: false, instanceUrl: '', sync: { accounts: false, contacts: false, cases: false }};
export const mockJiraSettings: models.JiraSettings = { connected: false, instanceUrl: '', projectKey: '', issueTypeId: '' };

export const mockKanbanData = {
    workspaces: [
        { id: 'ws1', name: 'Engineering', boardIds: ['board1'] }
    ],
    boards: [
        { 
            id: 'board1', workspaceId: 'ws1', title: 'Q3 Feature Development',
            // FIX: Replaced `lists` with `columns` and added `taskIds` to align with models and enable functionality.
            columns: [
                {id: 'list1', title: 'Backlog', taskIds: ['task3']},
                {id: 'list2', title: 'In Progress', taskIds: ['task1', 'task4']},
                {id: 'list3', title: 'Code Review', taskIds: ['task2']},
                {id: 'list4', title: 'Done', taskIds: []},
            ]
        }
    ]
};

export const mockKanbanLabels: models.KanbanLabel[] = [
  {id: 'lbl1', name: 'Bug', color: 'bg-red-500'},
  {id: 'lbl2', name: 'Feature', color: 'bg-blue-500'},
  {id: 'lbl3', name: 'UI/UX', color: 'bg-purple-500'},
  {id: 'lbl4', name: 'Backend', color: 'bg-gray-500'},
];

export const mockKanbanTasks: {[id: string]: models.KanbanTask} = {
  'task1': { id: 'task1', title: 'Develop Dark Mode', description: 'Implement dark mode across the app.', assigneeIds: [2,3], dueDate: daysAgo(-10), labels: ['lbl2', 'lbl3'], comments:[], activities:[], order: 0 },
  'task2': { id: 'task2', title: 'Refactor Auth Service', description: 'Improve performance of login flow.', assigneeIds: [1,4], dueDate: daysAgo(-20), labels: ['lbl4'], comments:[], activities:[], order: 1 },
  'task3': { id: 'task3', title: 'Integrate New Payment Gateway', description: 'Add Stripe as a payment option.', assigneeIds: [1,3], dueDate: daysAgo(-5), labels: ['lbl2', 'lbl4'], comments:[], activities:[], order: 0 },
  'task4': { id: 'task4', title: 'Fix login button alignment on mobile', description: 'The login button is off-center on screens smaller than 375px.', assigneeIds: [2], dueDate: daysAgo(2), labels: ['lbl1', 'lbl3'], comments:[], activities:[], order: 2 },
};

export const mockNotifications: models.Notification[] = [
  { id: 1, message: 'You were mentioned by Casey Dell in ticket #103.', timestamp: hoursAgo(3), read: false, ticketId: 103 },
  { id: 2, message: 'Ticket #105 has been assigned to you.', timestamp: hoursAgo(6), read: false, ticketId: 105 },
  { id: 3, message: 'SLA for ticket #101 is at risk of being breached.', timestamp: hoursAgo(1), read: true, ticketId: 101 },
];

export { mockKnowledgeBaseArticles, mockKnowledgeBaseCategories };