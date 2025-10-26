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
    },
    // ... more tickets
  ] as models.Ticket[],
  contacts: [
    { id: 1, name: 'Sarah Chen', email: 'sarah.chen@acmecorp.com', organizationId: 101 },
    { id: 2, name: 'John Doe', email: 'john.d@techsolutions.io', organizationId: 102 },
  ] as models.Contact[],
  organizations: [
    { id: 101, name: 'Acme Corp', industry: 'Retail' },
    { id: 102, name: 'Tech Solutions Inc.', industry: 'Technology' },
  ] as models.Organization[],
  agents: [
    { id: 1, name: 'Alex Ray', email: 'alex@deskflow.app', roleId: 'admin', skills: ['billing', 'tech-support'], onlineStatus: 'online' },
    { id: 2, name: 'Ben Carter', email: 'ben@deskflow.app', roleId: 'agent', skills: ['tech-support'], onlineStatus: 'away' },
  ] as models.Agent[],
  groups: [
    { id: 1, name: 'Tier 1 Support', memberIds: [2] },
    { id: 2, name: 'Billing Team', memberIds: [1] },
  ] as models.Group[],
  customFieldDefinitions: [
    { id: 'product_area', name: 'Product Area', type: 'dropdown', options: ['Frontend', 'Backend', 'API'] },
  ] as models.CustomFieldDefinition[],
  slaRules: {
    urgent: { responseTime: 15, resolutionTime: 240 },
    high: { responseTime: 30, resolutionTime: 480 },
    medium: { responseTime: 240, resolutionTime: 1440 },
    low: { responseTime: 1440, resolutionTime: 4320 },
  } as models.SlaRules,
  automationRules: [
    { id: 1, name: 'Auto-assign Billing issues', description: 'Assigns tickets with "billing" tag to the Billing Team.', enabled: true, trigger: 'tag_added:billing', action: { type: 'assign_group', payload: 2 } },
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
    { id: 'e1', from: 'no-reply@monitor.com', subject: 'System Alert: High CPU', body: 'CPU usage is at 95%', receivedAt: hoursAgo(1) }
  ] as models.MockEmail[],
  chatSessions: [
    { id: 'c1', customerName: 'Guest User', customerEmail: 'guest@example.com', initialMessage: 'I have a question about pricing', status: 'pending', createdAt: hoursAgo(0.1), transcript: [] }
  ] as models.ChatSession[],
  slackMessages: [
    { id: 's1', channel: '#support-requests', user: 'David', text: 'A customer is reporting issues with the new feature.', timestamp: hoursAgo(0.5), isSupportRequest: true }
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
  } as models.SsoSettings
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
});
