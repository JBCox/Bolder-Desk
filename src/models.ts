import { CdkDragDrop } from '@angular/cdk/drag-drop';

// Basic types
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type UserType = 'customer' | 'agent';
export type Permission = 
  'tickets:read' | 'tickets:create' | 'tickets:update' | 'tickets:delete' | 
  'contacts:read' | 'contacts:create' | 'contacts:update' | 'contacts:delete' |
  'reports:view' | 'settings:access' | 'admin:access';

// Data models
export interface Message {
  id: number;
  from: string;
  type: UserType;
  content: string;
  timestamp: string;
  attachments: string[];
}

export interface InternalNote {
  id: number;
  agentName: string;
  content: string;
  timestamp: string;
}

export interface Activity {
  id: number;
  user: string;
  details: string;
  timestamp: string;
  type?: string;
}

export interface Sla {
  status: 'ok' | 'risk' | 'breached';
  firstResponseDue: string;
  resolutionDue: string;
}

export interface Ticket {
  id: number;
  subject: string;
  contactId: number;
  created: string;
  updated: string;
  resolvedAt?: string;
  status: TicketStatus;
  priority: Priority;
  assignedTo?: string;
  tags: string[];
  messages: Message[];
  internalNotes: InternalNote[];
  activities: Activity[];
  sla?: Sla;
  customFields?: { [key: string]: any };
  sentiment: 'positive' | 'neutral' | 'negative';
  predictedSatisfaction: number | null;
  parentId?: number;
  childTicketIds?: number[];
  linkedTicketIds?: number[];
  source: string;
  timeTrackedSeconds: number;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  organizationId: number;
  tags: string[];
  createdAt: string;
  title?: string;
}

export interface Organization {
  id: number;
  name: string;
  domain: string;
  healthScore?: number;
  industry?: string;
  isVip?: boolean;
  slaTier?: string;
  timezone?: string;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  role: string;
  onlineStatus: 'online' | 'offline' | 'away';
  skills: string[];
}

export interface Group {
  id: number;
  name: string;
  memberIds: number[];
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  description?: string;
}

export type FilterOperator =
  | 'is' | 'is_not' | 'contains' | 'does_not_contain' | 'starts_with' | 'ends_with'
  | 'is_set' | 'is_not_set' | 'greater_than' | 'less_than' | 'is_on' | 'is_before'
  | 'is_after' | 'last_x_days' | 'is_one_of';

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
  filters: TicketFilters;
  displayOptions: {
    columns: string[];
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    groupBy?: string;
  }
  isPinned?: boolean;
}

export interface AnalyticsData {
    ticketsCreated: number;
    ticketsResolved: number;
    avgFirstResponseTime: number;
    avgResolutionTime: number;
    satisfactionScore: number;
    csatDrivers: { [key: string]: number };
}

export interface Anomaly {
    topic: string;
    count: number;
    severity: 'high' | 'medium';
}

export interface ProblemSuggestion {
    suggestedTitle: string;
    incidentTicketIds: number[];
}

export interface CustomFieldDefinition {
  id: string; // e.g., 'cf_order_id'
  name: string;
  type: 'text' | 'number' | 'date' | 'dropdown';
  options?: string[];
}

export interface FormField {
    id: string;
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio' | 'date';
    required: boolean;
    options?: string[];
    conditionalLogic: { fieldId: string; value: any } | null;
}

export interface FormTemplate {
    id: string;
    name: string;
    fields: FormField[];
}

export interface KnowledgeBaseCategory {
    id: string;
    name: string;
    description: string;
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

export interface KbFeedback {
    articleId: number;
    vote: 'up' | 'down';
}

export interface AutomationRule {
    id: number;
    name: string;
    enabled: boolean;
    trigger: any;
    conditions: any; // Simplified for now
    action: any; // Simplified for now
}

export interface SlaRules {
    [key: string]: {
        responseTime: number; // in hours
        resolutionTime: number; // in hours
    };
}

export interface MockEmail {
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    receivedAt: string;
    isRead: boolean;
    status: 'unprocessed' | 'ticket_created';
    ticketId?: number;
}

export interface ChatMessage {
    sender: 'customer' | 'agent';
    content: string;
    timestamp: string;
    name: string;
}

export interface ChatSession {
    id: string;
    customerName: string;
    customerEmail: string;
    status: 'pending' | 'active' | 'ended';
    agentId?: number;
    createdAt: string;
    transcript: ChatMessage[];
    initialMessage: string;
    pageUrl: string;
}

export interface WallboardData {
    openTickets: number;
    todaysResolved: number;
    slaBreachRisks: number;
    agentsOnline: number;
    longestWaitTime: string;
    agentStatus: { name: string; status: 'online' | 'away' | 'offline'; tickets: number }[];
    liveCsat: number;
}

export interface QACriterion {
    id: string;
    name: string;
    description: string;
    maxScore: number;
}
export interface QARubric {
    id: string;
    name: string;
    criteria: QACriterion[];
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

export interface Command {
    type: string;
    name: string;
    icon: string;
    action?: string;
    view?: string;
}

export interface SlackMessage {
    id: string;
    user: string;
    ts: string;
    text: string;
    channel: string;
    linkedTicketId?: number;
    isSupportRequest: boolean;
    status: 'unprocessed' | 'ticket_created' | 'reply_added';
}

export interface SlackSettings {
    connected: boolean;
    supportChannel: string;
    notificationChannels: { [key: string]: string[] }; // event -> channelId[]
}

export interface SocialThread {
    id: string;
    customerName: string;
    customerHandle: string;
    customerProfilePic: string;
    lastMessageSnippet: string;
    updatedAt: string;
    status: 'unprocessed' | 'ticket_created';
    linkedTicketId?: number;
    messages: {
        sender: 'customer' | 'page' | 'agent';
        content: string;
    }[];
}

export type FacebookThread = SocialThread;
export type TwitterThread = SocialThread;
export interface WhatsAppThread extends SocialThread {
    customerPhone: string;
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

export interface KanbanLabel {
    id: string;
    name: string;
    color: string;
}
export interface KanbanComment {
    id: string;
    agentId: number;
    content: string;
    timestamp: string;
}
export interface KanbanActivity {
    id: string;
    agentId: number;
    content: string;
    timestamp: string;
}
export interface KanbanTask {
    id: string;
    title: string;
    description: string;
    assigneeIds: number[];
    dueDate: string | null;
    labels: string[]; // array of label ids
    comments: KanbanComment[];
    activities: KanbanActivity[];
    order: number;
}

export interface KanbanColumn {
    id: string;
    title: string;
    taskIds: string[];
}

export interface KanbanBoard {
    id: string;
    workspaceId: string;
    title: string;
// FIX: Changed `lists` to `columns` to match application logic and enable kanban functionality.
    columns: KanbanColumn[];
}

export interface KanbanWorkspace {
    id: string;
    name: string;
    boardIds: string[];
}

export type WebhookEvent = 'ticket.created' | 'ticket.updated' | 'ticket.resolved' | 'contact.created';

export interface WebhookDelivery {
    id: string;
    timestamp: string;
    statusCode: number;
    success: boolean;
}

export interface Webhook {
    id: string;
    url: string;
    events: WebhookEvent[];
    status: 'active' | 'inactive';
    deliveries: WebhookDelivery[];
}

export interface ApiKey {
    id: string;
    name: string;
    key: string;
    createdAt: string;
    lastUsedAt?: string;
}

export interface AuditLogEntry {
    id: number;
    user: string;
    action: string;
    details?: string;
    timestamp: string;
    icon: string;
}

export interface SsoSettings {
    enabled: boolean;
    providerUrl: string;
    clientId: string;
    clientSecret: string;
}

export interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read: boolean;
  ticketId?: number;
}