// Fix: Defining all the data models used throughout the application.
export interface Ticket {
  id: number;
  subject: string;
  contactId: number;
  organizationId: number | null;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created: string;
  updated: string;
  messages: Message[];
  internalNotes: InternalNote[];
  tags: string[];
  assignedTo: string | null;
  watchers: number[]; // agent IDs
  parentId: number | null;
  childTicketIds: number[];
  viewingAgents?: string[];
  customFields: { [key: string]: any };
  resolvedAt?: string;
  satisfactionRating?: number;
  satisfactionComment?: string;
}

export interface Message {
  from: string;
  type: 'customer' | 'agent';
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface InternalNote {
  agentName: string;
  content: string;
  timestamp: string;
}

export interface Activity {
  type: 'created' | 'status-change' | 'note-added' | 'reply-sent';
  ticketId: number;
  subject: string;
  timestamp: Date;
  user: string;
  details: string;
}

export interface CannedResponse {
  id: number;
  name: string;
  content: string;
}

export interface MacroAction {
  type: 'set-status' | 'add-tag' | 'set-assignee';
  value: any;
}

export interface Macro {
  id: number;
  name: string;
  actions: MacroAction[];
}

export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'dropdown';
  options?: string[];
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  roleId: number;
  skills: string[];
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  organizationId: number | null;
}

export interface Organization {
  id: number;
  name: string;
  domains: string[];
}

export interface KnowledgeBaseArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: string;
  upvotes: number;
  downvotes: number;
}

export interface KnowledgeBaseCategory {
  id: string;
  name: string;
}

export interface KbFeedback {
  articleId: number;
  vote: 'up' | 'down';
}

export interface AnalyticsData {
  ticketsCreated: number;
  ticketsResolved: number;
  firstResponseTime: number; // in hours
  avgResolutionTime: number; // in hours
  satisfactionScore: number;
  ticketsByChannel: { channel: string, count: number }[];
  ticketsByPriority: { priority: string, count: number }[];
  busiestTimeOfDay: { hour: number, count: number }[];
}

export interface AutomationRule {
    id: number;
    name: string;
    description: string;
    enabled: boolean;
    trigger: { type: string, value: any };
    action: { type: string, value: any };
}

export interface Group {
    id: number;
    name: string;
}

export type SlaRules = {
  [key: string]: {
    responseTime: number; // in minutes
    resolutionTime: number; // in minutes
  }
};

export type ServiceRequestType = 'incident' | 'question' | 'problem';

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
  status: 'pending' | 'active' | 'closed';
  agentId: number | null;
  messages: ChatMessage[];
  createdAt: string;
  pageUrl: string;
  browserInfo: string;
}

export interface ChatMessage {
  sender: 'customer' | 'agent';
  content: string;
  timestamp: string;
}

export interface SlackMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  channel: string;
  relatedTicketId?: number;
}

export interface SlackSettings {
    channel: string;
    notificationsEnabled: boolean;
}

export interface WallboardData {
    openTickets: number;
    todaysResolved: number;
    slaBreachRisks: number;
    customerSatisfaction: number;
    topAgents: { name: string, resolved: number }[];
    channelBreakdown: { channel: string, count: number }[];
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
    scores: { [key: string]: number };
    feedback: string;
    reviewDate: string;
    totalScore: number;
}

export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'dropdown' | 'checkbox' | 'radio';
    options?: string[];
    required: boolean;
}

export interface FormDefinition {
    id: string;
    name: string;
    fields: FormField[];
}
