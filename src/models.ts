export interface Message {
  from: string;
  content: string;
  timestamp: string;
  type: 'customer' | 'agent';
  attachments: string[];
  channel?: 'web' | 'email' | 'chat';
}

export interface InternalNote {
  from: string;
  content: string;
  timestamp: string;
}

export interface Activity {
  type: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface TimeLog {
  agent: string;
  durationSeconds: number;
  timestamp: string;
  note?: string;
}

export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'dropdown';
  options?: string[];
  defaultValue?: any;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  roleId: number;
  groupIds: number[];
  status: 'Online' | 'Offline';
  load?: number; // Number of active tickets
}

export interface Role {
  id: number;
  name: 'Admin' | 'Agent';
  permissions: string[];
}

export interface Group {
    id: number;
    name: string;
}

export interface Ticket {
  id: number;
  subject: string;
  customer: string;
  email: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  created: string;
  lastUpdate: string;
  firstResponseAt: string | null;
  resolvedAt?: string;
  tags: string[];
  category: string;
  messages: Message[];
  internalNotes: InternalNote[];
  activity: Activity[];
  csatRating: number | null;
  csatComment?: string;
  viewingAgents?: string[];
  timeTrackedSeconds?: number;
  timeLogs?: TimeLog[];
  customFields?: { [key: string]: any };
  isPrivate?: boolean;
  watchers?: number[]; // Agent IDs
  cc?: string[]; // External emails
  channel: 'web' | 'email' | 'chat';
  parentId?: number;
  childTicketIds?: number[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  serviceRequestId?: string;
}

export type AutomationTrigger =
  | { type: 'tag_added'; value: string }
  | { type: 'priority_is'; value: string }
  | { type: 'status_changed_to'; value: string }
  | { type: 'ticket_created' }
  | { type: 'time_since_status'; status: string; hours: number };

export type AutomationAction =
  | { type: 'assign_agent'; value: string }
  | { type: 'assign_group_round_robin'; groupId: number }
  | { type: 'assign_group_load_based'; groupId: number }
  | { type: 'change_status'; value: string }
  | { type: 'add_tag'; value: string }
  | { type: 'change_priority'; value: string };

export interface AutomationRule {
  id: number;
  name: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  action: AutomationAction;
}

export interface CannedResponse {
  id: number;
  name: string;
  content: string;
}

export interface SlaRules {
  [key: string]: {
    responseTime: number;
    resolutionTime: number;
  };
}

export interface SlaInfo {
  responseDeadline: Date;
  resolutionDeadline: Date;
  responseTimeLeft: number;
  resolutionTimeLeft: number;
  responseBreached: boolean;
  resolutionBreached: boolean;
  responseStatus: 'met' | 'breached' | 'warning' | 'ok';
  resolutionStatus: 'met' | 'breached' | 'warning' | 'ok';
}

export interface AdvancedFilters {
  customer: string;
  agent: string;
  dateFrom: string;
  dateTo: string;
  priority: 'all' | 'low' | 'medium' | 'high' | 'urgent';
  customFilters: { [key: string]: any };
}

export interface AnalyticsData {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  avgResponseTime: string;
  customerSatisfaction: string;
  slaCompliance: string;
  avgCSAT: string;
  byCategory: { name: string; count: number }[];
  byPriority: { urgent: number; high: number; medium: number; low: number };
}

export interface KnowledgeBaseArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  lastUpdatedAt: string;
}

export interface KnowledgeBaseCategory {
  id: string;
  name: string;
}

export interface MacroAction {
    type: 'change_status' | 'assign_agent' | 'add_tag' | 'change_priority' | 'add_internal_note';
    value: string;
}

export interface Macro {
    id: number;
    name: string;
    actions: MacroAction[];
}

export interface View {
  id: string;
  name: string;
  filters: {
    status: string;
    tag: string;
    priority: 'all' | 'low' | 'medium' | 'high' | 'urgent';
    assignee: string;
    searchQuery: string;
    advancedFilters: AdvancedFilters;
  };
}

// Omnichannel Models
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
    from: 'customer' | 'agent';
    name: string;
    content: string;
    timestamp: string;
}

export interface ChatSession {
  id: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'active' | 'closed' | 'ticket_created';
  agentId?: number;
  agentName?: string;
  startedAt: string;
  messages: ChatMessage[];
  pageUrl?: string;
  ticketId?: number;
  browserInfo?: string;
}

export interface Notification {
  id: string;
  type: 'new_ticket' | 'customer_reply' | 'sla_breach' | 'mention';
  message: string;
  ticketId: number;
  isRead: boolean;
  timestamp: string;
}

// Integrations
export interface SlackSettings {
  enabled: boolean;
  channel: string;
}

export interface SlackMessage {
  id: string;
  author: string;
  authorIcon: string;
  timestamp: string;
  content?: string;
  attachment?: {
    color: string;
    title: string;
    title_link: string;
    fields: { title: string; value: string; short: boolean }[];
  };
}

// Self-Service
export interface ServiceRequestType {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name from IconComponent
  customFieldIds: string[];
}
