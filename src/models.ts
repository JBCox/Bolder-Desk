export interface Ticket {
  id: number;
  subject: string;
  contactId: number;
  assignedTo?: string; // Agent name
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
  parentId?: number;
  childTicketIds?: number[];
  linkedTicketIds?: number[];
}

export interface Message {
  from: string; // "Customer" or agent name
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
  user: string; // agent name or "System"
  timestamp: string;
  details: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  organizationId: number;
  phone?: string;
}

export interface Organization {
  id: number;
  name: string;
  industry?: string;
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
    responseTime: number; // minutes
    resolutionTime: number; // minutes
  };
}

export interface AutomationRule {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  trigger: string;
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
  name: string;
  label: string;
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
  avgFirstResponseTime: number; // in minutes
  avgResolutionTime: number; // in hours
  satisfactionScore: number;
  topPerformingAgent: string;
}

export interface MockEmail {
  id: string;
  from: string;
  subject: string;
  body: string;
  receivedAt: string;
}

export interface ChatSession {
  id: string;
  customerName: string;
  customerEmail: string;
  initialMessage: string;
  status: 'pending' | 'active' | 'ended';
  agentId?: number;
  transcript: { sender: 'customer' | 'agent', content: string, timestamp: string }[];
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
    linkedTicket?: string; // e.g., "Ticket #12345"
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
  'ticket:merge' |
  'view:tickets' | 'edit:tickets' | 'delete:tickets' |
  'view:customers' | 'edit:customers' |
  'view:reports' | 'view:settings' | 'manage:agents' | 'manage:billing';

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