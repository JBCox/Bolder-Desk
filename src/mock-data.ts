import * as models from './models';

export const mockOrganizations: models.Organization[] = [
  { id: 1, name: 'Innovate Inc.', industry: 'Technology', isVip: true, slaTier: 'Premium', timezone: 'PST' },
  { id: 2, name: 'Global Goods Co.', industry: 'Retail', isVip: false, slaTier: 'Standard', timezone: 'EST' },
  { id: 3, name: 'HealthFirst Partners', industry: 'Healthcare', isVip: false, slaTier: 'Standard', timezone: 'CST' },
];

export const mockContacts: models.Contact[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice.j@innovate.com', organizationId: 1, title: 'Lead Developer' },
  { id: 2, name: 'Bob Smith', email: 'bob.s@globalgoods.com', organizationId: 2, title: 'Store Manager' },
  { id: 3, name: 'Charlie Brown', email: 'charlie.b@healthfirst.com', organizationId: 3, title: 'Clinic Administrator' },
  { id: 4, name: 'Diana Prince', email: 'diana.p@innovate.com', organizationId: 1, title: 'Project Manager' },
  { id: 5, name: 'Ethan Hunt', email: 'ethan.h@globalgoods.com', organizationId: 2, title: 'Logistics Coordinator' },
];

export const mockAgents: models.Agent[] = [
  { id: 1, name: 'Super Agent', email: 'super.agent@bolddesk.ai', roleId: 'admin', skills: ['billing', 'tech-support', 'sales'], onlineStatus: 'online' },
  { id: 2, name: 'Support Specialist', email: 'support.specialist@bolddesk.ai', roleId: 'agent', skills: ['tech-support'], onlineStatus: 'online' },
  { id: 3, name: 'Billing Expert', email: 'billing.expert@bolddesk.ai', roleId: 'agent', skills: ['billing', 'sales'], onlineStatus: 'away' },
  { id: 4, 'name': 'Tier 2 Engineer', email: 't2.engineer@bolddesk.ai', roleId: 'agent', skills: ['tech-support', 'api'], onlineStatus: 'offline' }
];

export const mockGroups: models.Group[] = [
    { id: 1, name: 'Support Team', memberIds: [1, 2, 4] },
    { id: 2, name: 'Billing Team', memberIds: [1, 3] },
    { id: 3, name: 'Management', memberIds: [1] }
];

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

export const mockTickets: models.Ticket[] = [
  {
    id: 1,
    subject: 'Cannot login to my account',
    contactId: 1,
    assignedTo: 'Support Specialist',
    created: daysAgo(2),
    status: 'open',
    priority: 'high',
    tags: ['login', 'tech-support'],
    messages: [
      { from: 'Alice Johnson', type: 'customer', content: 'I can\'t seem to log into my account. I keep getting an "Invalid Credentials" error.', timestamp: daysAgo(2), attachments: [] },
      { from: 'Support Specialist', type: 'agent', content: 'Hi Alice, have you tried resetting your password using the "Forgot Password" link?', timestamp: daysAgo(1), attachments: [] },
      { from: 'Alice Johnson', type: 'customer', content: 'I did, but I never received the reset email.', timestamp: hoursAgo(20), attachments: [] }
    ],
    internalNotes: [{ agentName: 'Super Agent', content: '@Support Specialist Check the email server logs for bounces from innovate.com.', timestamp: hoursAgo(18) }],
    activities: [{ type: 'created', user: 'Alice Johnson', timestamp: daysAgo(2), details: 'Ticket created via portal' }],
    timeTrackedSeconds: 300,
    source: 'portal',
    sla: { breachAt: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), status: 'risk' }
  },
  {
    id: 2,
    subject: 'Question about my recent invoice',
    contactId: 2,
    assignedTo: 'Billing Expert',
    created: daysAgo(5),
    status: 'pending',
    priority: 'medium',
    tags: ['billing', 'invoice'],
    messages: [
      { from: 'Bob Smith', type: 'customer', content: 'I have a question about a charge on my latest invoice. Can someone explain what "Service Overage Fee" means?', timestamp: daysAgo(5), attachments: ['invoice_123.pdf'] }
    ],
    internalNotes: [],
    activities: [{ type: 'created', user: 'Bob Smith', timestamp: daysAgo(5), details: 'Ticket created via email' }],
    timeTrackedSeconds: 120,
    source: 'email'
  },
  {
    id: 3,
    subject: 'Feature Request: Dark Mode',
    contactId: 4,
    created: daysAgo(10),
    resolvedAt: daysAgo(8),
    status: 'resolved',
    priority: 'low',
    tags: ['feature-request'],
    messages: [
      { from: 'Diana Prince', type: 'customer', content: 'I would love to see a dark mode option in the application. It would be easier on the eyes.', timestamp: daysAgo(10), attachments: [] },
      { from: 'Support Specialist', type: 'agent', content: 'Thanks for the suggestion, Diana! I\'ve passed this along to our product team for consideration.', timestamp: daysAgo(8), attachments: [] }
    ],
    internalNotes: [],
    activities: [],
    timeTrackedSeconds: 60,
    source: 'portal',
    satisfactionRating: 5,
    satisfactionComment: 'Quick and friendly response!'
  },
    {
    id: 4,
    subject: 'API Integration failing with 500 error',
    contactId: 1,
    assignedTo: 'Tier 2 Engineer',
    created: hoursAgo(4),
    status: 'open',
    priority: 'urgent',
    tags: ['api', 'tech-support', 'bug'],
    messages: [
      { from: 'Alice Johnson', type: 'customer', content: 'Our API integration suddenly started failing with a 500 Internal Server Error. This is critical for our workflow.', timestamp: hoursAgo(4), attachments: [] }
    ],
    internalNotes: [],
    activities: [],
    timeTrackedSeconds: 0,
    source: 'api',
    sla: { breachAt: new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(), status: 'breached' }
  },
  {
    id: 5,
    subject: 'Shipment is delayed',
    contactId: 5,
    created: daysAgo(1),
    status: 'closed',
    resolvedAt: hoursAgo(5),
    priority: 'medium',
    tags: ['shipping', 'logistics'],
    messages: [
        { from: 'Ethan Hunt', type: 'customer', content: 'My order #GG12345 seems to be stuck in transit. Can you provide an update?', timestamp: daysAgo(1), attachments: [] },
        { from: 'Support Specialist', type: 'agent', content: 'Hi Ethan, I\'ve checked with the carrier and it looks like your package is out for delivery today.', timestamp: hoursAgo(6), attachments: [] },
        { from: 'Ethan Hunt', type: 'customer', content: 'Great, thanks!', timestamp: hoursAgo(5), attachments: [] }
    ],
    internalNotes: [],
    activities: [],
    timeTrackedSeconds: 240,
    source: 'chat'
  },
];

export const mockCustomFieldDefinitions: models.CustomFieldDefinition[] = [
    { id: 'cf_plan_type', name: 'Plan Type', type: 'dropdown', options: ['Free', 'Pro', 'Enterprise'] },
    { id: 'cf_renewal_date', name: 'Renewal Date', type: 'date' },
];

export const mockSlaRules: models.SlaRules = {
    urgent: { responseTime: 1, resolutionTime: 4 },
    high: { responseTime: 4, resolutionTime: 24 },
    medium: { responseTime: 12, resolutionTime: 72 },
    low: { responseTime: 24, resolutionTime: 120 }
};

export const mockAutomationRules: models.AutomationRule[] = [
    { id: 1, name: 'Auto-assign billing tickets', description: 'Assigns new tickets with the "billing" tag to the Billing Team.', enabled: true, trigger: { type: 'tag_added', value: 'billing' }, action: { type: 'assign_group', payload: { groupId: 2 }}},
    { id: 2, name: 'Close tickets after 3 days of resolution', description: 'Automatically closes resolved tickets if there is no customer reply after 72 hours.', enabled: true, trigger: { type: 'time_since_status', status: 'resolved', hours: 72 }, action: { type: 'change_status', payload: { status: 'closed' }}},
];

export const mockKnowledgeBaseArticles: models.KnowledgeBaseArticle[] = [
    { id: 1, title: 'How to Reset Your Password', content: 'To reset your password, go to the login page and click the "Forgot Password" link...', category: 'accounts', tags: ['password', 'login', 'account'], createdAt: daysAgo(30), updatedAt: daysAgo(5), author: 'Support Specialist', views: 152, upvotes: 45, downvotes: 2 },
    { id: 2, title: 'Understanding Your Invoice', content: 'This guide explains the common line items you will find on your monthly invoice...', category: 'billing', tags: ['invoice', 'billing', 'payment'], createdAt: daysAgo(60), updatedAt: daysAgo(10), author: 'Billing Expert', views: 280, upvotes: 80, downvotes: 1 },
];

export const mockKnowledgeBaseCategories: models.KnowledgeBaseCategory[] = [
    { id: 'accounts', name: 'Account Management', description: 'Help with logging in, managing users, and profile settings.' },
    { id: 'billing', name: 'Billing & Subscriptions', description: 'Everything about invoices, payments, and plans.' },
    { id: 'getting-started', name: 'Getting Started', description: 'Guides for new users to get up and running.' },
];

export const mockFormTemplates: models.FormTemplate[] = [
    { id: 'bug_report', name: 'Bug Report', fields: [
        { id: 'f1', name: 'subject', label: 'Subject', type: 'text', required: true },
        { id: 'f2', name: 'description', label: 'Detailed Description', type: 'textarea', required: true },
        { id: 'f3', name: 'product_area', label: 'Product Area', type: 'dropdown', required: true, options: ['Dashboard', 'API', 'Mobile App'] },
    ]},
    { id: 'feature_request', name: 'Feature Request', fields: [
        { id: 'f4', name: 'subject', label: 'Feature Title', type: 'text', required: true },
        { id: 'f5', name: 'description', label: 'Describe your idea', type: 'textarea', required: true },
    ]}
];

export const mockAnalyticsData: models.AnalyticsData = {
    ticketsCreated: 152,
    ticketsResolved: 145,
    avgFirstResponseTime: 1.2, // hours
    avgResolutionTime: 18.5, // hours
    satisfactionScore: 92.5, // percent
    topPerformingAgent: 'Support Specialist',
    csatDrivers: { 'Product Quality': 15, 'Customer Service': 25, 'Other': 5 }
};

export const mockEmails: models.MockEmail[] = [
    { id: 'e1', from: 'new.customer@example.com', subject: 'Pre-sales question', body: 'Hi, I was wondering if your Enterprise plan includes SSO integration?', receivedAt: hoursAgo(1), status: 'unprocessed' },
    { id: 'e2', from: 'another.user@globalgoods.com', subject: 'URGENT: Site is down', body: 'Our main e-commerce site seems to be down. We are getting a 503 error.', receivedAt: hoursAgo(3), status: 'unprocessed' }
];

export const mockChatSessions: models.ChatSession[] = [
    { id: 'c1', customerName: 'Fiona Gallagher', customerEmail: 'fiona.g@example.com', initialMessage: 'Hi, I need help upgrading my plan.', status: 'pending', transcript: [{ sender: 'customer', name: 'Fiona Gallagher', content: 'Hi, I need help upgrading my plan.', timestamp: hoursAgo(0.2)}], createdAt: hoursAgo(0.2) },
    { id: 'c2', customerName: 'Frank Reynolds', customerEmail: 'frank.r@paddys.pub', initialMessage: 'My thingamajig is broken', status: 'active', agentId: 2, transcript: [
        { sender: 'customer', name: 'Frank Reynolds', content: 'My thingamajig is broken', timestamp: hoursAgo(0.5)},
        { sender: 'agent', name: 'Support Specialist', content: 'Hi Frank, can you tell me more about the issue?', timestamp: hoursAgo(0.4)}
    ], createdAt: hoursAgo(0.5) },
];

export const mockSlackMessages: models.SlackMessage[] = [
    { id: 's1', channel: 'support-requests', user: 'Diana Prince', text: 'Hey team, Innovate Inc. is asking if we can expedite their data export. @Super Agent can you take a look?', timestamp: String(Date.now() / 1000 - 1800), isSupportRequest: true, status: 'unprocessed' }
];

export const mockSlackSettings: models.SlackSettings = { connected: true, supportChannel: '#support-requests', notificationRules: { newTicket: true, ticketResolved: false, slaBreach: true }};

export const mockWallboardData: models.WallboardData = { openTickets: 23, todaysResolved: 45, slaBreachRisks: 3, agentStatus: [{ name: 'Super Agent', status: 'online', tickets: 5}, { name: 'Support Specialist', status: 'online', tickets: 8}, { name: 'Billing Expert', status: 'away', tickets: 2}], customerSatisfaction: { score: 94, trend: 'up'}, longestWaitTime: '4h 15m', agentsOnline: 2 };

export const mockQARubrics: models.QARubric[] = [
    { id: 'r1', name: 'Standard Support Review', criteria: [
        { id: 'rc1', name: 'Opening', description: 'Agent used a proper and friendly greeting.', maxScore: 5 },
        { id: 'rc2', name: 'Problem Identification', description: 'Agent effectively identified the customer\'s core issue.', maxScore: 10 },
        { id: 'rc3', name: 'Solution Accuracy', description: 'The provided solution was correct and appropriate.', maxScore: 10 },
        { id: 'rc4', name: 'Closing', description: 'Agent ensured the customer was satisfied before closing.', maxScore: 5 }
    ]}
];

export const mockQAReviews: models.QAReview[] = [];

export const mockPermissions: models.Permission[] = ['ticket:merge', 'view:tickets', 'edit:tickets', 'delete:tickets', 'view:customers', 'edit:customers', 'view:reports', 'view:settings', 'manage:agents', 'manage:billing'];
export const mockRoles: models.Role[] = [
    { id: 'admin', name: 'Administrator', description: 'Has all permissions.', permissions: [...mockPermissions] },
    { id: 'agent', name: 'Agent', description: 'Can view and edit tickets and customers.', permissions: ['view:tickets', 'edit:tickets', 'view:customers', 'edit:customers'] },
    { id: 'viewer', name: 'Viewer', description: 'Read-only access to tickets.', permissions: ['view:tickets'] }
];

export const mockSsoSettings: models.SsoSettings = { enabled: false, providerUrl: '', clientId: '', clientSecret: '' };

export const mockAuditLog: models.AuditLogEntry[] = [
    { id: 'al1', user: 'Super Agent', action: 'updated SLA rules for "urgent" priority.', timestamp: hoursAgo(2), icon: 'shield' },
    { id: 'al2', user: 'System', action: 'closed Ticket #3 due to inactivity.', timestamp: hoursAgo(8), icon: 'zap' }
];

export const mockFacebookThreads: models.FacebookThread[] = [];
export const mockTwitterThreads: models.TwitterThread[] = [];
export const mockWhatsAppThreads: models.WhatsAppThread[] = [];
export const mockApiKeys: models.ApiKey[] = [];
export const mockWebhooks: models.Webhook[] = [];

export const mockSalesforceSettings: models.SalesforceSettings = { connected: false, instanceUrl: '', sync: { accounts: false, contacts: false, cases: false }};
export const mockJiraSettings: models.JiraSettings = { connected: false, instanceUrl: '', projectKey: '', issueTypeId: ''};

export const mockKanbanWorkspaces: models.KanbanWorkspace[] = [{ id: 'ws1', name: 'Product Development', description: 'Tracking new features and bug fixes.' }];
export const mockKanbanBoards: models.KanbanBoard[] = [{ id: 'board1', title: 'Q4 Initiatives', workspaceId: 'ws1', lists: []}];
export const mockKanbanLists: models.KanbanList[] = [
    { id: 'list1', title: 'To Do', order: 0, boardId: 'board1', cards: [] },
    { id: 'list2', title: 'In Progress', order: 1, boardId: 'board1', cards: [] },
    { id: 'list3', title: 'Done', order: 2, boardId: 'board1', cards: [] },
];
export const mockKanbanCards: models.KanbanCard[] = [];

export const mockTicketViews: models.TicketView[] = [
    {
        id: 'all', name: 'All Tickets', ownerId: 0, visibility: 'shared', filters: [],
        displayOptions: { columns: ['id', 'subject', 'contact', 'status', 'priority', 'created', 'assignedTo'], sortBy: 'created', sortDirection: 'desc' }
    },
    {
        id: 'my_open', name: 'My Open Tickets', ownerId: 1, visibility: 'private',
        filters: [
            { id: 'g1', matchType: 'all', conditions: [
                { id: 'c1', field: 'assignedTo', operator: 'is', value: 'Super Agent'},
                { id: 'c2', field: 'status', operator: 'is', value: 'open' }
            ]}
        ],
        displayOptions: { columns: ['id', 'subject', 'contact', 'priority'], sortBy: 'priority', sortDirection: 'desc' }
    }
];

export const mockNotifications: models.Notification[] = [
    { id: 'n1', message: 'Ticket #4 has been assigned to you.', timestamp: hoursAgo(4), read: false, ticketId: 4 },
    { id: 'n2', message: 'Your note on Ticket #1 was read by Support Specialist.', timestamp: hoursAgo(15), read: true, ticketId: 1 }
];
