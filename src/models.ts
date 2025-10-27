

export interface Ticket {
  id: number;
  subject: string;
  contactId: number;
  assignedTo?: string;
  created: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  messages: Message[];
  internalNotes: InternalNote[];
  activities: Activity[];
  timeTrackedSeconds: number;
  sla?: {
    breachAt: string;
    status: 'ok' | 'risk' | 'breached';
  };
  customFields?: { [key: string]: any };
  formValues?: { [key: string]: any };
  sentiment?: 'positive' | 'neutral' | 'negative';
  resolvedAt?: string;
  satisfactionRating?: number;
  satisfactionComment?: string;
  csatDriver?: string;
  predictedSatisfaction?: number;
  parentId?: number;
  childTicketIds?: number[];
  linkedTicketIds?: number[];
  source: 'email' | 'portal' | 'chat' | 'api' | 'slack' | 'facebook' | 'twitter' | 'whatsapp';
}

export interface Message {
  from: string;
  type: 'customer' | 'agent';
  content: string;
  timestamp: string;
  attachments: string[];
}

export interface InternalNote {
  agentName: string;
  content: string;
  timestamp: string;
}

export interface Activity {
  type: 'status_change' | 'assignment' | 'tag_add' | 'tag_remove' | 'created' | 'merged' | 'split' | 'ai_assignment';
  user: string;
  timestamp: string;
  details: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  organizationId: number;
  phone?: string;
  title?: string;
}

export interface Organization {
  id: number;
  name: string;
  industry?: string;
  isVip?: boolean;
  slaTier?: 'Premium' | 'Standard';
  timezone?: string;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  roleId: string;
  skills: string[];
  onlineStatus: 'online' | 'away' | 'offline';
}

export interface Group {
  id: number;
  name: string;
  memberIds: number[];
}

export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'dropdown';
  options?: string[];
}

export interface SlaRules {
  [key: string]: {
    responseTime: number;
    resolutionTime: number;
  };
}

export type AutomationTrigger =
  | { type: 'tag_added'; value: string }
  | { type: 'status_changed_to'; value: Ticket['status'] }
  | { type: 'priority_is'; value: Ticket['priority'] }
  | { type: 'ticket_created' }
  | { type: 'time_since_status'; status: Ticket['status']; hours: number }
  | { type: 'view_entered'; viewId: string }
  | { type: 'view_left'; viewId: string };

export interface AutomationRule {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  action: {
    type: string;
    payload: any;
  };
}

export interface KnowledgeBaseArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: string;
  views: number;
  upvotes: number;
  downvotes: number;
}

export interface KnowledgeBaseCategory {
  id: string;
  name: string;
  description: string;
}

export interface KbFeedback {
  articleId: number;
  vote: 'up' | 'down';
}

export interface FormTemplate {
  id: string;
  name: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  label: string;
  name: string;
  type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio' | 'date';
  required: boolean;
  options?: string[];
  conditionalLogic?: {
    fieldId: string;
    value: any;
  } | null;
}

export interface AnalyticsData {
  ticketsCreated: number;
  ticketsResolved: number;
  avgFirstResponseTime: number;
  avgResolutionTime: number;
  satisfactionScore: number;
  topPerformingAgent: string;
  csatDrivers: { [key: string]: number };
}

export interface Anomaly {
  topic: string;
  count: number;
  severity: 'high' | 'medium';
}

export interface MockEmail {
  id: string;
  from: string;
  to?: string;
  subject: string;
  body: string;
  receivedAt: string;
  isRead?: boolean;
  status?: 'unprocessed' | 'ticket_created';
  ticketId?: number;
}

export interface ChatSession {
  id: string;
  customerName: string;
  customerEmail: string;
  initialMessage: string;
  status: 'pending' | 'active' | 'ended';
  agentId?: number;
  transcript: { sender: 'customer' | 'agent', name: string, content: string, timestamp: string }[];
  createdAt: string;
  pageUrl?: string;
  browserInfo?: string;
}

export interface SlackMessage {
  id: string;
  channel: string;
  user: string;
  text: string;
  timestamp: string;
  isSupportRequest: boolean;
  status: 'unprocessed' | 'ticket_created' | 'reply_added';
  linkedTicketId?: number;
}

export interface SlackSettings {
  connected: boolean;
  supportChannel: string;
  notificationRules: {
    newTicket: boolean;
    ticketResolved: boolean;
    slaBreach: boolean;
  };
}

export interface WallboardData {
  openTickets: number;
  todaysResolved: number;
  slaBreachRisks: number;
  agentStatus: { name: string, status: 'online' | 'away' | 'offline', tickets: number }[];
  customerSatisfaction: { score: number, trend: 'up' | 'down' | 'stable' };
  longestWaitTime: string;
  agentsOnline: number;
}

export interface QARubric {
  id: string;
  name: string;
  criteria: QACriterion[];
}

export interface QACriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
}

export interface QAReview {
  id: string;
  ticketId: number;
  rubricId: string;
  reviewerId: number;
  agentId: number;
  scores: { [criterionId: string]: number };
  feedback: string;
  reviewDate: string;
  totalScore: number;
}

export type Permission =
  | 'ticket:merge'
  | 'view:tickets' | 'edit:tickets' | 'delete:tickets'
  | 'view:customers' | 'edit:customers'
  | 'view:reports' | 'view:settings' | 'manage:agents' | 'manage:billing';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface SsoSettings {
  enabled: boolean;
  providerUrl: string;
  clientId: string;
  clientSecret: string;
}

export interface ProblemSuggestion {
  suggestedTitle: string;
  incidentTicketIds: number[];
}

export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details?: string;
  icon: string;
}

export interface FacebookMessage {
  sender: 'customer' | 'page';
  content: string;
  timestamp: string;
}

export interface FacebookThread {
  id: string;
  customerName: string;
  customerProfilePic: string;
  lastMessageSnippet: string;
  updatedAt: string;
  status: 'unprocessed' | 'ticket_created';
  linkedTicketId?: number;
  messages: FacebookMessage[];
}

export interface TwitterMessage {
  sender: 'customer' | 'agent';
  content: string;
  timestamp: string;
}

export interface TwitterThread {
  id: string;
  customerName: string;
  customerHandle: string;
  customerProfilePic: string;
  lastMessageSnippet: string;
  updatedAt: string;
  status: 'unprocessed' | 'ticket_created';
  linkedTicketId?: number;
  messages: TwitterMessage[];
}

export interface WhatsAppMessage {
  sender: 'customer' | 'agent';
  content: string;
  timestamp: string;
}

export interface WhatsAppThread {
  id: string;
  customerName: string;
  customerPhone: string;
  lastMessageSnippet: string;
  updatedAt: string;
  status: 'unprocessed' | 'ticket_created';
  linkedTicketId?: number;
  messages: WhatsAppMessage[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt?: string;
}

export type WebhookEvent = 'ticket.created' | 'ticket.updated' | 'ticket.resolved' | 'contact.created';

export interface WebhookDelivery {
  id: string;
  timestamp: string;
  success: boolean;
  statusCode: number;
  requestPayload: string;
  responsePayload: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  status: 'active' | 'failing';
  deliveries: WebhookDelivery[];
}

export interface SalesforceSettings {
  connected: boolean;
  instanceUrl: string;
  sync: {
    accounts: boolean;
    contacts: boolean;
    cases: boolean;
  };
}

export interface JiraSettings {
  connected: boolean;
  instanceUrl: string;
  projectKey: string;
  issueTypeId: string;
}

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  order: number;
  listId: string;
  boardId: string;
  assigneeIds?: number[];
  labels?: string[];
  dueDate?: string;
}

export interface KanbanList {
  id: string;
  title: string;
  order: number;
  boardId: string;
  cards: KanbanCard[];
}

export interface KanbanBoard {
  id: string;
  title: string;
  description?: string;
  workspaceId: string;
  lists: KanbanList[];
}

export interface KanbanWorkspace {
  id: string;
  name: string;
  description?: string;
}

export type FilterOperator =
  | 'is'
  | 'is_not'
  | 'is_set'
  | 'is_not_set'
  | 'contains'
  | 'does_not_contain'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'is_on'
  | 'is_before'
  | 'is_after'
  | 'last_x_days'
  | 'is_one_of';

export interface TicketFilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
}

export interface TicketFilterGroup {
  id: string;
  matchType: 'all' | 'any';
  conditions: TicketFilterCondition[];
}

export type TicketFilters = TicketFilterGroup[];

export interface TicketView {
  id: string;
  name: string;
  ownerId: number;
  visibility: 'private' | 'shared';
  sharedWithGroupIds?: number[];
  isPinned?: boolean;
  filters: TicketFilters;
  displayOptions: {
    columns: string[];
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    groupBy?: string;
  };
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  ticketId?: number;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
  icon: string;
}

export interface Command {
  id: string;
  name: string;
  icon: string;
  action: any;
}