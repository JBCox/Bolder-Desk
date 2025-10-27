import * as models from './models';

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_DATA = {
  tickets: [
    {
      id: 1,
      subject: 'Cannot login to my account',
      contactId: 1,
      assignedTo: 'Alex Ray',
      created: daysAgo(2),
      status: 'open',
      priority: 'high',
      tags: ['login', 'critical'],
      messages: [
        { from: 'Sarah Chen', type: 'customer', content: "I'm trying to log in but it says my password is incorrect. I tried resetting it but I haven't received an email.", timestamp: daysAgo(2), attachments: [] },
        { from: 'Alex Ray', type: 'agent', content: "Hi Sarah, I've checked our system and it seems there was a delay in our email service. I've manually sent you a password reset link. Please let me know if it works.", timestamp: daysAgo(1), attachments: [] },
      ],
      internalNotes: [{ agentName: 'Alex Ray', content: 'Email service had an outage, might be related to other reports.', timestamp: daysAgo(1)}],
      activities: [],
      timeTrackedSeconds: 300,
      sla: { breachAt: hoursAgo(-20), status: 'risk' },
      customFields: { 'cf_product_area': 'Backend', 'cf_region': 'NA' },
      source: 'portal',
    },
    // ... more tickets
  ] as models.Ticket[],
  contacts: [
    { id: 1, name: 'Sarah Chen', email: 'sarah.chen@acmecorp.com', organizationId: 101, title: 'Project Manager' },
    { id: 2, name: 'John Doe', email: 'john.d@techsolutions.io', organizationId: 102, title: 'Developer' },
    { id: 3, name: 'Maria Garcia', email: 'maria.g@globex.com', organizationId: 101, title: 'Accounts Payable' },
  ] as models.Contact[],
  organizations: [
    { id: 101, name: 'Acme Corp', industry: 'Retail', isVip: true, slaTier: 'Premium', timezone: 'PST' },
    { id: 102, name: 'Tech Solutions Inc.', industry: 'Technology', isVip: false, slaTier: 'Standard', timezone: 'EST' },
  ] as models.Organization[],
  agents: [
    { id: 1, name: 'Alex Ray', email: 'alex@deskflow.app', roleId: 'admin', skills: ['billing', 'tech-support'], onlineStatus: 'online' },
    { id: 2, name: 'Ben Carter', email: 'ben@deskflow.app', roleId: 'agent', skills: ['tech-support'], onlineStatus: 'away' },
    { id: 3, name: 'Carla Dane', email: 'carla@deskflow.app', roleId: 'agent', skills: ['tech-support', 'frontend'], onlineStatus: 'online' },
    { id: 4, name: 'Dana Scully', email: 'dana@deskflow.app', roleId: 'agent', skills: ['tech-support', 'api'], onlineStatus: 'online' },
  ] as models.Agent[],
  groups: [
    { id: 1, name: 'Tier 1 Support', memberIds: [2, 3] },
    { id: 2, name: 'Billing Team', memberIds: [1] },
    { id: 3, name: 'API Support', memberIds: [4] },
  ] as models.Group[],
  customFieldDefinitions: [
    { id: 'cf_product_area', name: 'Product Area', type: 'dropdown', options: ['Frontend', 'Backend', 'API'] },
    { id: 'cf_region', name: 'Region', type: 'dropdown', options: ['NA', 'EMEA', 'APAC'] },
  ] as models.CustomFieldDefinition[],
  slaRules: {
    urgent: { responseTime: 15, resolutionTime: 240 },
    high: { responseTime: 30, resolutionTime: 480 },
    medium: { responseTime: 240, resolutionTime: 1440 },
    low: { responseTime: 1440, resolutionTime: 4320 },
  } as models.SlaRules,
  automationRules: [
    { id: 1, name: 'Auto-assign Billing issues', description: 'Assigns tickets with "billing" tag to the Billing Team.', enabled: true, trigger: { type: 'tag_added', value: 'billing' }, action: { type: 'assign_group_round_robin', payload: 2 } },
    { id: 2, name: 'Triage API tickets', description: 'When a ticket enters the API Support Queue view, add the "needs-triage" tag.', enabled: true, trigger: { type: 'view_entered', viewId: 'api-view' }, action: { type: 'add_tag', payload: 'needs-triage' } }
  ] as models.AutomationRule[],
  knowledgeBaseArticles: [
    { id: 1, title: 'How to Reset Your Password', content: 'Go to the login page and click "Forgot Password".', category: 'accounts', tags: ['password', 'login'], createdAt: daysAgo(10), updatedAt: daysAgo(2), author: 'Alex Ray', views: 150, upvotes: 25, downvotes: 1 },
    { id: 2, title: 'Configuring Single Sign-On (SSO)', content: 'To configure SSO, navigate to Settings > Authentication. Enable SSO and provide your Identity Provider URL, Client ID, and Client Secret. This allows your team to log in using your company\'s standard authentication method.', category: 'administration', tags: ['sso', 'login', 'security', 'saml', 'oidc'], createdAt: now.toISOString(), updatedAt: now.toISOString(), author: 'System', views: 0, upvotes: 0, downvotes: 0 },
  ] as models.KnowledgeBaseArticle[],
  knowledgeBaseCategories: [
    { id: 'accounts', name: 'Account Management', description: 'Help with managing your account.'},
    { id: 'billing', name: 'Billing', description: 'Questions about invoices and payments.'},
    { id: 'administration', name: 'Administration', description: 'Settings and configuration.' },
  ] as models.KnowledgeBaseCategory[],
  formTemplates: [
    { id: 'bug_report', name: 'Bug Report', fields: [
      { id: 'f1', name: 'subject', label: 'Subject', type: 'text', required: true, conditionalLogic: null },
      { id: 'f2', name: 'description', label: 'Description', type: 'textarea', required: true, conditionalLogic: null },
      { id: 'f3', name: 'product_area', label: 'Product Area', type: 'dropdown', options: ['Frontend', 'Backend', 'API'], required: true, conditionalLogic: null },
    ]}
  ] as models.FormTemplate[],
  emails: [
    { id: 'e1', to: 'support@deskflow.app', from: 'no-reply@monitor.com', subject: 'System Alert: High CPU', body: 'CPU usage is at 95%', receivedAt: hoursAgo(1), isRead: false, status: 'unprocessed' },
    { id: 'e2', to: 'support@deskflow.app', from: 'john.d@techsolutions.io', subject: 'Cannot access my files', body: 'Hi team, I seem to have lost access to the shared drive. Can you help?', receivedAt: hoursAgo(3), isRead: false, status: 'unprocessed' },
    { id: 'e3', to: 'support@deskflow.app', from: 'maria.g@globex.com', subject: 'Invoice #INV-123', body: 'This has already been paid.', receivedAt: daysAgo(1), isRead: true, status: 'ticket_created', ticketId: 4 },
  ] as models.MockEmail[],
  chatSessions: [
    { id: 'c1', customerName: 'Guest User', customerEmail: 'guest@example.com', initialMessage: 'I have a question about pricing', status: 'pending', createdAt: hoursAgo(0.1), transcript: [] }
  ] as models.ChatSession[],
  slackMessages: [
    { id: 's1', channel: '#support-requests', user: 'David', text: 'A customer is reporting issues with the new feature. They mentioned error code 503.', timestamp: hoursAgo(0.5), isSupportRequest: true, status: 'unprocessed' },
    { id: 's2', channel: '#support-requests', user: 'Maria', text: 'Just wanted to follow up on ticket #2.', timestamp: hoursAgo(0.2), isSupportRequest: true, status: 'ticket_created', linkedTicketId: 2 },
  ] as models.SlackMessage[],
  slackSettings: {
    connected: true,
    supportChannel: '#support-requests',
    notificationRules: { newTicket: true, ticketResolved: false, slaBreach: true }
  } as models.SlackSettings,
  qaRubrics: [
    { id: 'r1', name: 'Standard Support Interaction', criteria: [
      { id: 'rc1', name: 'Greeting', description: 'Agent used a proper and friendly greeting.', maxScore: 5 },
      { id: 'rc2', name: 'Accuracy', description: 'The information provided was accurate.', maxScore: 10 },
    ]}
  ] as models.QARubric[],
  qaReviews: [] as models.QAReview[],
  roles: [
    { id: 'admin', name: 'Administrator', description: 'Full access to all features.', permissions: ['ticket:merge', 'view:tickets', 'edit:tickets', 'delete:tickets', 'view:customers', 'edit:customers', 'view:reports', 'view:settings', 'manage:agents', 'manage:billing'] },
    { id: 'agent', name: 'Support Agent', description: 'Can manage tickets and customers.', permissions: ['view:tickets', 'edit:tickets', 'view:customers', 'edit:customers'] },
    { id: 'viewer', name: 'Viewer', description: 'Read-only access to tickets and reports.', permissions: ['view:tickets', 'view:reports'] },
  ] as models.Role[],
  ssoSettings: {
    enabled: false,
    providerUrl: '',
    clientId: '',
    clientSecret: '',
  } as models.SsoSettings,
  facebookThreads: [
    {
      id: 'fb1',
      customerName: 'Maria Garcia',
      customerProfilePic: 'https://i.pravatar.cc/150?u=maria',
      lastMessageSnippet: 'Hi, I have a question about my recent order.',
      updatedAt: hoursAgo(1.5),
      status: 'unprocessed',
      messages: [
        { sender: 'customer', content: 'Hi, I have a question about my recent order.', timestamp: hoursAgo(1.5) },
      ]
    },
    {
      id: 'fb2',
      customerName: 'John Doe',
      customerProfilePic: 'https://i.pravatar.cc/150?u=john',
      lastMessageSnippet: 'Thanks for the help!',
      updatedAt: daysAgo(1),
      status: 'ticket_created',
      linkedTicketId: 2,
      messages: [
        { sender: 'customer', content: 'I was having an issue with my invoice.', timestamp: daysAgo(1.1) },
        { sender: 'page', content: 'We can help with that! We have created ticket #2 for you.', timestamp: daysAgo(1.05) },
        { sender: 'customer', content: 'Thanks for the help!', timestamp: daysAgo(1) },
      ]
    }
  ] as models.FacebookThread[],
  twitterThreads: [
    {
      id: 'tw1',
      customerName: 'TechieTom',
      customerHandle: '@tom_dev',
      customerProfilePic: 'https://i.pravatar.cc/150?u=tomdev',
      lastMessageSnippet: 'Hey, my API key seems to have stopped working. Can you help?',
      updatedAt: hoursAgo(2),
      status: 'unprocessed',
      messages: [
        { sender: 'customer', content: 'Hey, my API key seems to have stopped working. Can you help?', timestamp: hoursAgo(2) },
      ]
    },
    {
      id: 'tw2',
      customerName: 'DesignerDeb',
      customerHandle: '@deb_designs',
      customerProfilePic: 'https://i.pravatar.cc/150?u=debdesigns',
      lastMessageSnippet: 'Just wanted to say the new UI update is fantastic!',
      updatedAt: daysAgo(3),
      status: 'ticket_created',
      linkedTicketId: 3,
      messages: [
        { sender: 'customer', content: 'Just wanted to say the new UI update is fantastic!', timestamp: daysAgo(3) },
        { sender: 'agent', content: 'Thanks so much for the feedback! We created ticket #3 to track this.', timestamp: daysAgo(2.9) }
      ]
    }
  ] as models.TwitterThread[],
  whatsAppThreads: [
    {
      id: 'wa1',
      customerName: 'MobileMax',
      customerPhone: '+1-555-123-4567',
      lastMessageSnippet: 'Is the service down? I can\'t connect.',
      updatedAt: hoursAgo(0.5),
      status: 'unprocessed',
      messages: [
        { sender: 'customer', content: 'Is the service down? I can\'t connect.', timestamp: hoursAgo(0.5) }
      ]
    }
  ] as models.WhatsAppThread[],
  apiKeys: [
    { id: 'ak_1', name: 'Zapier Integration', key: `sk_live_${'x'.repeat(20)}abcd`, createdAt: daysAgo(30), lastUsedAt: daysAgo(1) }
  ] as models.ApiKey[],
  webhooks: [
    { 
      id: 'wh_1', 
      url: 'https://api.example.com/webhook-receiver', 
      events: ['ticket.created', 'ticket.resolved'], 
      status: 'active',
      deliveries: [
        { id: 'd_1', timestamp: hoursAgo(1), success: true, statusCode: 200, requestPayload: '{}', responsePayload: '{"status":"ok"}'}
      ]
    }
  ] as models.Webhook[],
  salesforceSettings: {
    connected: false,
    instanceUrl: '',
    sync: {
      accounts: true,
      contacts: true,
      cases: false,
    }
  } as models.SalesforceSettings,
  jiraSettings: {
    connected: false,
    instanceUrl: '',
    projectKey: '',
    issueTypeId: '10001',
  } as models.JiraSettings,
  kanbanWorkspaces: [
    { id: 'ws1', name: 'Product Development', description: 'All boards related to building our product.' },
    { id: 'ws2', name: 'Marketing', description: 'Content calendar, campaigns, and more.' },
  ] as models.KanbanWorkspace[],
  kanbanBoards: [
    {
      id: 'board1',
      title: 'Q3 Roadmap',
      description: 'Tasks for the third quarter.',
      workspaceId: 'ws1',
      lists: [
        { 
          id: 'list1', 
          title: 'To Do', 
          order: 0,
          boardId: 'board1',
          cards: [
            { id: 'card1', title: 'Design new dashboard widgets', order: 0, listId: 'list1', boardId: 'board1' },
            { id: 'card2', title: 'Implement user profile page', order: 1, listId: 'list1', boardId: 'board1' },
          ]
        },
        { 
          id: 'list2', 
          title: 'In Progress',
          order: 1,
          boardId: 'board1',
          cards: [
            { id: 'card3', title: 'Refactor authentication service', order: 0, listId: 'list2', boardId: 'board1', assigneeIds: [1] },
          ]
        },
        { 
          id: 'list3', 
          title: 'Done',
          order: 2,
          boardId: 'board1',
          cards: []
        },
      ]
    },
    {
      id: 'board2',
      title: 'Content Calendar',
      description: 'Blog posts and social media schedule.',
      workspaceId: 'ws2',
      lists: []
    }
  ] as models.KanbanBoard[],
};

// Add more mock tickets
MOCK_DATA.tickets.push({
    id: 2,
    subject: 'Billing question',
    contactId: 2,
    assignedTo: 'Alex Ray',
    created: daysAgo(1),
    status: 'pending',
    priority: 'medium',
    tags: ['billing', 'invoice'],
    messages: [
      { from: 'John Doe', type: 'customer', content: "I believe there's an error on my last invoice.", timestamp: daysAgo(1), attachments: [] },
    ],
    internalNotes: [],
    activities: [],
    timeTrackedSeconds: 120,
    customFields: { 'cf_product_area': 'Frontend', 'cf_region': 'EMEA' },
    source: 'email'
});
MOCK_DATA.tickets.push({
    id: 3,
    subject: 'Feature Request: Dark Mode',
    contactId: 1,
    created: daysAgo(5),
    status: 'resolved',
    priority: 'low',
    tags: ['feature-request'],
    messages: [
      { from: 'Sarah Chen', type: 'customer', content: "It would be great if the app had a dark mode.", timestamp: daysAgo(5), attachments: [] },
      { from: 'Ben Carter', type: 'agent', content: "Thanks for the suggestion! I've passed it along to our product team.", timestamp: daysAgo(4), attachments: [] },
    ],
    internalNotes: [],
    activities: [],
    timeTrackedSeconds: 60,
    resolvedAt: daysAgo(4),
    satisfactionRating: 5,
    customFields: { 'cf_product_area': 'Frontend', 'cf_region': 'NA' },
    source: 'portal',
});
MOCK_DATA.tickets.push({
    id: 4,
    subject: 'Re: Invoice #INV-123',
    contactId: 3,
    created: daysAgo(1),
    status: 'open',
    priority: 'medium',
    tags: ['billing', 'invoice'],
    messages: [
      { from: 'Maria Garcia', type: 'customer', content: "This has already been paid.", timestamp: daysAgo(1), attachments: [] },
    ],
    internalNotes: [],
    activities: [],
    timeTrackedSeconds: 0,
    customFields: { 'cf_region': 'APAC' },
    source: 'email',
});