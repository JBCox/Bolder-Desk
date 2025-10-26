import { Component, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agent, Ticket, Contact, Organization, CustomFieldDefinition, Macro, CannedResponse, KnowledgeBaseArticle, KnowledgeBaseCategory, AutomationRule, Group, SlaRules, MockEmail, ChatSession, SlackMessage, SlackSettings, WallboardData, QARubric, QAReview, FormDefinition, KbFeedback, AnalyticsData } from './models';

// Import all components
import { InboxComponent } from './components/inbox/inbox.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { NewTicketModalComponent } from './components/new-ticket-modal/new-ticket-modal.component';
import { AutomationModalComponent } from './components/automation-modal/automation-modal.component';
import { CsatModalComponent } from './components/csat-modal/csat-modal.component';
import { BulkActionBarComponent } from './components/bulk-action-bar/bulk-action-bar.component';
import { KnowledgeBaseComponent } from './components/knowledge-base/knowledge-base.component';
import { MergeTicketModalComponent } from './components/merge-ticket-modal/merge-ticket-modal.component';
import { LogTimeModalComponent } from './components/log-time-modal/log-time-modal.component';
import { SlaManagementModalComponent } from './components/sla-management-modal/sla-management-modal.component';
import { SplitTicketModalComponent } from './components/split-ticket-modal/split-ticket-modal.component';
import { LinkTicketModalComponent } from './components/link-ticket-modal/link-ticket-modal.component';
import { CustomerPortalComponent } from './components/customer-portal/customer-portal.component';
import { SettingsModalComponent } from './components/settings-modal/settings-modal.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatWidgetComponent } from './components/chat-widget/chat-widget.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SlackIntegrationComponent } from './components/slack-integration/slack-integration.component';
import { WallboardComponent } from './components/wallboard/wallboard.component';
import { QualityAssuranceComponent } from './components/quality-assurance/quality-assurance.component';
import { KeyboardShortcutsModalComponent } from './components/keyboard-shortcuts-modal/keyboard-shortcuts-modal.component';
import { CustomersComponent } from './components/customers/customers.component';
import { FormBuilderComponent } from './components/form-builder/form-builder.component';
import { FormRendererComponent } from './components/form-renderer/form-renderer.component';
import { IconComponent } from './components/icon/icon.component';
import { DevPlanComponent } from './components/dev-plan/dev-plan.component';

// Fix: Define a type for the mock data to prevent TypeScript from widening string literal types.
interface AppData {
  tickets: Ticket[];
  contacts: Contact[];
  organizations: Organization[];
  agents: Agent[];
  customFieldDefinitions: CustomFieldDefinition[];
  macros: Macro[];
  cannedResponses: CannedResponse[];
  knowledgeBaseArticles: KnowledgeBaseArticle[];
  knowledgeBaseCategories: KnowledgeBaseCategory[];
  automationRules: AutomationRule[];
  groups: Group[];
  slaRules: SlaRules;
  emails: MockEmail[];
  chatSessions: ChatSession[];
  slackMessages: SlackMessage[];
  slackSettings: SlackSettings;
  wallboardData: WallboardData;
  qaRubrics: QARubric[];
  qaReviews: QAReview[];
  formDefinitions: FormDefinition[];
  availableTags: string[];
  analyticsData: AnalyticsData;
}

// Mock data is included here as new files cannot be added.
const MOCK_DATA: AppData = {
  tickets: [
    { id: 1, subject: 'Login issue', contactId: 1, organizationId: 1, status: 'open', priority: 'high', created: '2024-07-29T10:00:00Z', updated: '2024-07-29T11:00:00Z', messages: [{ from: 'Alice', type: 'customer', content: 'I can\'t log in.', timestamp: '2024-07-29T10:00:00Z' }], internalNotes: [], tags: ['login', 'critical'], assignedTo: 'John Doe', watchers: [], parentId: null, childTicketIds: [], customFields: {} },
    { id: 2, subject: 'Billing question', contactId: 2, organizationId: 2, status: 'in-progress', priority: 'medium', created: '2024-07-29T09:00:00Z', updated: '2024-07-29T12:00:00Z', messages: [{ from: 'Bob', type: 'customer', content: 'There is a mistake on my invoice.', timestamp: '2024-07-29T09:00:00Z' }], internalNotes: [], tags: ['billing'], assignedTo: 'Jane Doe', watchers: [], parentId: null, childTicketIds: [], customFields: {}, resolvedAt: '2024-07-29T14:00:00Z' }
  ],
  contacts: [
    { id: 1, name: 'Alice', email: 'alice@example.com', organizationId: 1 },
    { id: 2, name: 'Bob', email: 'bob@example.com', organizationId: 2 }
  ],
  organizations: [
    { id: 1, name: 'Org A', domains: ['example.com'] },
    { id: 2, name: 'Org B', domains: ['anotherexample.com'] }
  ],
  agents: [
    { id: 1, name: 'John Doe', email: 'john@helpdesk.com', roleId: 1, skills: ['Level 1', 'Billing'] },
    { id: 2, name: 'Jane Doe', email: 'jane@helpdesk.com', roleId: 1, skills: ['Level 2', 'Technical'] }
  ],
  customFieldDefinitions: [{ id: 'cf_order_id', name: 'Order ID', type: 'text' }],
  macros: [{ id: 1, name: 'Escalate to Level 2', actions: [{ type: 'add-tag', value: 'escalated' }] }],
  cannedResponses: [{ id: 1, name: 'Greeting', content: 'Hello, thank you for contacting support.' }],
  knowledgeBaseArticles: [
      { id: 1, title: 'The Anatomy of a Ticket', content: 'This article covers the basics of managing tickets. You can create a new ticket using the "New Ticket" button. To reply to a customer, use the main reply box. To add a private note for your team, select the "Add Internal Note" tab. You can change a ticket\'s status (Open, In-Progress, Resolved, Closed) and priority (Low, Medium, High, Urgent) from the dropdowns in the ticket detail view.', category: 'getting-started', tags: ['tickets', 'basics', 'status', 'priority'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 25, downvotes: 0 },
      { id: 2, title: 'Navigating the Agent Dashboard', content: 'Your dashboard is organized into several key views, accessible from the left sidebar. "Tickets" is your main workspace. "Customers" provides the Customer 360 view of organizations and contacts. "Knowledge Base" is for managing help articles. "Reports", "Analytics", and "QA" provide tools for monitoring performance and quality.', category: 'getting-started', tags: ['navigation', 'dashboard', 'views'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 18, downvotes: 0 },
      { id: 3, title: 'Using the Customer 360 View', content: 'The Customer 360 panel on the right side of a ticket provides complete context. The "Contact" tab shows details for the person you are communicating with. The "Organization" tab shows company-level information like their SLA tier and VIP status. The "Timeline" tab provides a unified history of every interaction with that contact across all their tickets, allowing you to get up to speed instantly.', category: 'getting-started', tags: ['customer 360', 'context', 'organization', 'contact'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 22, downvotes: 0 },
      { id: 4, title: 'Advanced Ticket Actions: Merge, Split, and Link', content: 'Use advanced actions to keep your help desk organized. \n- Merge: Combine a duplicate ticket into a primary one. The conversation from the duplicate is added to the primary, and the duplicate is closed. \n- Split: Create a new ticket from a single message if a customer raises a new issue in an existing conversation. \n- Link: Create parent-child relationships between related tickets to track dependencies.', category: 'core-features', tags: ['merge', 'split', 'link', 'workflow'], lastUpdated: '2024-07-30T00:00:00Z', upvotes: 15, downvotes: 1 },
      { id: 5, title: 'Working Together: Collision Detection and Watchers', content: 'Collision Detection prevents duplicate replies by showing you who else is viewing the same ticket. You will see an eye icon and the names of other agents in the ticket header. Watchers are agents who want to be notified of updates on a ticket, even if it\'s not assigned to them. You can add or remove watchers from the sidebar.', category: 'core-features', tags: ['collaboration', 'watchers', 'collision detection'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 10, downvotes: 0 },
      { id: 6, title: 'Time Logging and Productivity', content: 'To log time spent on a ticket, click the clock icon in the ticket header. A modal will appear where you can enter the hours and minutes. This helps track effort and is useful for reporting and billing purposes.', category: 'core-features', tags: ['time tracking', 'productivity', 'logging'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 9, downvotes: 0 },
      { id: 7, title: 'Speeding Up Replies with Canned Responses and Macros', content: 'Canned Responses are pre-written answers to common questions. Access them from the reply box to insert text quickly. Macros are one-click shortcuts that can perform multiple actions at once, like adding a tag, changing the status, and assigning an agent. Apply them from the reply box to automate repetitive workflows.', category: 'core-features', tags: ['macros', 'canned responses', 'efficiency'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 14, downvotes: 0 },
      { id: 8, title: 'Managing Conversations from Email, Chat, and Slack', content: 'Our help desk integrates multiple channels. The "Inbox" view allows you to convert emails into tickets. The "Live Chat" view is for real-time conversations, which can also be converted to tickets. The "Slack" view simulates a channel where you can get notifications and create tickets directly.', category: 'channels', tags: ['omnichannel', 'email', 'chat', 'slack'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 11, downvotes: 0 },
      { id: 9, title: 'Your AI Assistant: Summaries, Replies, and Tone Changer', content: 'Our AI tools help you work faster. \n- Summarize: Instantly get a summary of a long ticket conversation. \n- Suggest Replies: Get three context-aware reply suggestions based on the customer\'s last message. \n- Tone Changer: Rewrite your drafted replies to be more Friendly or Formal before sending.', category: 'ai-tools', tags: ['ai', 'gemini', 'summarize', 'suggestions', 'tone'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 30, downvotes: 1 },
      { id: 10, title: 'Instant Answers with AI-Powered Knowledge Base Search', content: 'The "Answer from KB" AI tool provides instant, synthesized answers to customer questions. It reads your entire knowledge base to find the most relevant information and presents a direct answer with citations to the source articles. This is available to both agents in the ticket view and customers in the portal.', category: 'ai-tools', tags: ['ai', 'rag', 'search', 'knowledge base'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 28, downvotes: 0 },
      { id: 11, title: 'Auto-Generating Knowledge Base Articles from Tickets', content: 'After resolving a complex ticket, you can use AI to create a knowledge base article from it. Click the "Generate KB Article" icon in the header of a resolved ticket. The AI will analyze the conversation and solution, then generate a draft title, content, and tags for a new article, saving you documentation time.', category: 'ai-tools', tags: ['ai', 'knowledge base', 'documentation', 'automation'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 19, downvotes: 0 },
      { id: 12, title: 'Monitoring Performance with the Analytics Dashboard', content: 'The Analytics dashboard gives you a real-time overview of your help desk performance. It includes key metrics like Total Tickets, SLA Compliance, Average CSAT Score, and breakdowns of tickets by their current status and priority. Use this dashboard to monitor trends and team performance.', category: 'analytics-qa', tags: ['analytics', 'dashboard', 'metrics', 'reporting'], lastUpdated: '2024-07-30T00:00:00Z', upvotes: 15, downvotes: 0 },
      { id: 13, title: 'Using Reports for Agent Performance Reviews', content: 'Navigate to the "Reports" view to generate agent performance data. You can filter by a specific date range to see how many tickets each agent resolved and what their average resolution time was during that period. This is essential for performance management.', category: 'analytics-qa', tags: ['reports', 'performance', 'agents'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 12, downvotes: 0 },
      { id: 14, title: 'Live Monitoring with the Wallboard', content: 'The Wallboard view is a high-contrast dashboard designed for large screens. It displays live, up-to-the-second statistics like open tickets, today\'s resolved count, agents online, and the longest ticket wait time. It is perfect for keeping the entire team aware of the current support load.', category: 'analytics-qa', tags: ['wallboard', 'live stats', 'monitoring'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 10, downvotes: 0 },
      { id: 15, title: 'Ensuring Quality with the QA Module', content: 'The Quality Assurance (QA) view allows managers to review and score agent performance on resolved tickets. You can select a ticket from the "Awaiting Review" list, choose a scoring rubric, evaluate the agent on multiple criteria, and provide written feedback. This helps maintain high support standards.', category: 'analytics-qa', tags: ['qa', 'quality', 'reviews', 'scoring'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 13, downvotes: 0 },
      { id: 16, title: 'Using the Customer Portal', content: 'Customers can access their own support portal. Here, they can view the status and history of all their tickets, add new replies to ongoing conversations, and search the knowledge base for answers. The KB search in the portal is also powered by AI, providing direct answers to their questions to encourage self-service.', category: 'for-customers', tags: ['customer portal', 'self-service', 'kb'], lastUpdated: '2024-07-31T00:00:00Z', upvotes: 20, downvotes: 0 },
      { id: 17, title: 'How Customer Satisfaction (CSAT) Works', content: 'After a ticket you own is marked as "Resolved", the customer will be prompted to provide a satisfaction rating from 1 to 5 stars, along with an optional comment. These scores are aggregated and displayed in the Analytics Dashboard. Our AI tools can also analyze the comments to identify the key drivers behind customer satisfaction, helping you understand what you\'re doing well and where you can improve.', category: 'administration', tags: ['csat', 'analytics', 'feedback', 'surveys'], lastUpdated: '2024-08-01T00:00:00Z', upvotes: 8, downvotes: 0 },
      { id: 18, title: 'Understanding Automation Rules', content: 'Automation rules help you save time by performing actions on tickets automatically. Each rule consists of a trigger (an event that happens) and an action (what the system does). For example, you can set a rule that says "When a new ticket is created, assign it to the Support group via round-robin." Admins can manage these rules from the Automation settings.', category: 'administration', tags: ['automation', 'rules', 'workflow', 'efficiency'], lastUpdated: '2024-08-01T00:00:00Z', upvotes: 12, downvotes: 0 },
      { id: 19, title: 'Configuring SLAs for Ticket Prioritization', content: 'A Service Level Agreement (SLA) is a policy that defines how quickly you should respond to and resolve tickets. In our help desk, you can set different time limits based on a ticket\'s priority. For example, an "Urgent" ticket might have a 1-hour response SLA, while a "Low" priority ticket might have a 24-hour response SLA. These policies help agents prioritize their work and ensure important tickets are handled on time. The system will show warnings for tickets approaching an SLA breach.', category: 'administration', tags: ['sla', 'policy', 'priority', 'response time'], lastUpdated: '2024-08-01T00:00:00Z', upvotes: 10, downvotes: 0 },
      { id: 20, title: 'Using Custom Fields to Capture Data', content: 'Custom fields allow you to collect specific, structured information that isn\'t part of the default ticket form. For example, you could create a custom text field for "Order ID" or a dropdown for "Product Area". Admins can create and manage these fields. Once created, they will appear in the new ticket modal and in the ticket details sidebar, ensuring you get the exact information you need to resolve issues faster.', category: 'administration', tags: ['custom fields', 'forms', 'data', 'configuration'], lastUpdated: '2024-08-01T00:00:00Z', upvotes: 7, downvotes: 0 },
      { id: 21, title: 'Creating Dynamic Forms with the Form Builder', content: 'The Form Builder allows admins to create custom forms for different types of service requests. This ensures you collect the right information upfront, reducing back-and-forth with customers. You can add various field types (text, dropdowns, etc.), set validation rules, and use conditional logic to show or hide fields based on user input. These dynamic forms are then presented to users when they create a new ticket.', category: 'administration', tags: ['forms', 'form builder', 'customization', 'workflow'], lastUpdated: '2024-08-02T00:00:00Z', upvotes: 2, downvotes: 0 }
  ],
  knowledgeBaseCategories: [
      { id: 'getting-started', name: 'Getting Started' },
      { id: 'core-features', name: 'Core Features' },
      { id: 'channels', name: 'Channels' },
      { id: 'ai-tools', name: 'AI-Powered Tools' },
      { id: 'analytics-qa', name: 'Analytics & QA' },
      { id: 'administration', name: 'Administration' },
      { id: 'for-customers', name: 'For Customers' }
  ],
  automationRules: [],
  groups: [{ id: 1, name: 'Support' }],
  slaRules: { high: { responseTime: 30, resolutionTime: 240 } },
  emails: [],
  chatSessions: [],
  slackMessages: [],
  slackSettings: { channel: '#support', notificationsEnabled: true },
  wallboardData: { openTickets: 10, todaysResolved: 5, slaBreachRisks: 2, customerSatisfaction: 95, topAgents: [{ name: 'John Doe', resolved: 3 }], channelBreakdown: [{ channel: 'Email', count: 8 }] },
  qaRubrics: [{ id: 'standard', name: 'Standard Rubric', criteria: [{ id: 'greeting', name: 'Greeting', description: 'Agent used a proper greeting.', maxScore: 5 }] }],
  qaReviews: [],
  formDefinitions: [],
  availableTags: ['login', 'billing', 'bug', 'feature-request'],
  analyticsData: { ticketsCreated: 100, ticketsResolved: 80, firstResponseTime: 1.5, avgResolutionTime: 4.2, satisfactionScore: 92, ticketsByChannel: [{ channel: 'Email', count: 80 }], ticketsByPriority: [{ priority: 'high', count: 20 }], busiestTimeOfDay: [{ hour: 14, count: 15 }] }
};

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IconComponent,
    InboxComponent,
    TicketDetailComponent,
    AnalyticsDashboardComponent,
    NewTicketModalComponent,
    AutomationModalComponent,
    CsatModalComponent,
    BulkActionBarComponent,
    KnowledgeBaseComponent,
    MergeTicketModalComponent,
    LogTimeModalComponent,
    SlaManagementModalComponent,
    SplitTicketModalComponent,
    LinkTicketModalComponent,
    CustomerPortalComponent,
    SettingsModalComponent,
    ChatComponent,
    ChatWidgetComponent,
    ReportsComponent,
    SlackIntegrationComponent,
    WallboardComponent,
    QualityAssuranceComponent,
    KeyboardShortcutsModalComponent,
    CustomersComponent,
    FormBuilderComponent,
    FormRendererComponent,
    DevPlanComponent,
  ],
  template: `
    <div class="h-screen w-screen bg-gray-100 flex text-gray-800">
      <!-- Sidebar -->
      <aside class="w-64 bg-gray-800 text-white flex flex-col">
        <div class="p-4 border-b border-gray-700">
          <h1 class="text-xl font-bold flex items-center"><app-icon name="sparkles" class="mr-2"></app-icon> HelpDesk AI</h1>
        </div>
        <nav class="flex-grow p-2">
          @for (item of menuItems; track item.id) {
            <a href="#" 
               (click)="activeView.set(item.id); $event.preventDefault()"
               [class]="'flex items-center px-4 py-2 rounded-md hover:bg-gray-700 ' + (activeView() === item.id ? 'bg-gray-900' : '')">
              <app-icon [name]="item.icon" class="mr-3"></app-icon>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
        <div class="p-4 border-t border-gray-700">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white mr-3">
              {{ getInitials(currentAgent().name) }}
            </div>
            <div>
              <p class="font-semibold">{{ currentAgent().name }}</p>
              <p class="text-sm text-gray-400">Agent</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col">
        <div class="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-2xl font-bold capitalize">{{ activeView() === 'dev-plan' ? 'Development Plan' : activeView() }}</h2>
          <div>
            <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center" (click)="showNewTicketModal.set(true)">
              <app-icon name="plus" class="mr-2"></app-icon>
              New Ticket
            </button>
          </div>
        </div>

        <div class="flex-1 p-4 overflow-y-auto">
          @switch (activeView()) {
            @case ('tickets') {
              <div class="flex h-full">
                <!-- Ticket List -->
                <div class="w-1/3 bg-white rounded-lg shadow-md mr-4 overflow-y-auto">
                  <div class="p-4 border-b">
                    <h3 class="text-lg font-semibold">Tickets</h3>
                  </div>
                  <ul>
                    @for (ticket of tickets(); track ticket.id) {
                      <li (click)="selectedTicket.set(ticket)"
                          [class]="'p-4 border-b hover:bg-gray-50 cursor-pointer ' + (selectedTicket()?.id === ticket.id ? 'bg-indigo-100' : '')">
                        <p class="font-semibold">{{ ticket.subject }}</p>
                        <p class="text-sm text-gray-600">#{{ ticket.id }} &middot; {{ getContact(ticket.contactId)?.name }}</p>
                        <div class="mt-2 flex items-center">
                          <span [class]="'px-2 py-1 text-xs rounded-full ' + getStatusClass(ticket.status)">{{ ticket.status }}</span>
                          <span class="ml-2 text-xs text-gray-500">{{ ticket.priority }}</span>
                        </div>
                      </li>
                    }
                  </ul>
                </div>

                <!-- Ticket Detail -->
                <div class="w-2/3 bg-white rounded-lg shadow-md overflow-y-auto">
                  @if (selectedTicket(); as ticket) {
                    <app-ticket-detail 
                      [ticket]="ticket"
                      [cannedResponses]="cannedResponses()"
                      [macros]="macros()"
                      [contacts]="contacts()"
                      [organizations]="organizations()"
                      [currentAgent]="currentAgent()"
                      [customFieldDefinitions]="customFieldDefinitions()"
                      [availableTags]="availableTags()"
                      [agents]="agents()"
                      [knowledgeBaseArticles]="knowledgeBaseArticles()"
                      (close)="selectedTicket.set(null)"
                      (selectTicket)="selectTicketById($event)"
                    />
                  } @else {
                    <div class="flex items-center justify-center h-full text-gray-500">
                      <p>Select a ticket to view details</p>
                    </div>
                  }
                </div>
              </div>
            }
            @case ('customers') {
              <app-customers [organizations]="organizations()" [contacts]="contacts()" [tickets]="tickets()"></app-customers>
            }
            @case ('knowledge-base') {
                <app-knowledge-base [articles]="knowledgeBaseArticles()" [categories]="knowledgeBaseCategories()" (kbFeedback)="handleKbFeedback($event)"></app-knowledge-base>
            }
            @case ('reports') {
              <app-reports [tickets]="tickets()" [agents]="agents()"></app-reports>
            }
            @case ('analytics') {
              <app-analytics-dashboard [analytics]="analyticsData()"></app-analytics-dashboard>
            }
             @case ('quality-assurance') {
              <app-quality-assurance [tickets]="tickets()" [agents]="agents()" [qaRubrics]="qaRubrics()" [qaReviews]="qaReviews()" (saveReview)="handleSaveReview($event)"></app-quality-assurance>
            }
            @case ('dev-plan') {
              <app-dev-plan></app-dev-plan>
            }
          }
        </div>
      </main>

      @if (showNewTicketModal()) {
        <app-new-ticket-modal 
            [contacts]="contacts()"
            [organizations]="organizations()"
            [customFieldDefinitions]="customFieldDefinitions()"
            (close)="showNewTicketModal.set(false)"
            (create)="handleNewTicket($event)"
        ></app-new-ticket-modal>
      }
    </div>
  `
})
export class AppComponent {
  // All state signals
  tickets = signal<Ticket[]>(MOCK_DATA.tickets);
  contacts = signal<Contact[]>(MOCK_DATA.contacts);
  organizations = signal<Organization[]>(MOCK_DATA.organizations);
  agents = signal<Agent[]>(MOCK_DATA.agents);
  customFieldDefinitions = signal<CustomFieldDefinition[]>(MOCK_DATA.customFieldDefinitions);
  macros = signal<Macro[]>(MOCK_DATA.macros);
  cannedResponses = signal<CannedResponse[]>(MOCK_DATA.cannedResponses);
  knowledgeBaseArticles = signal<KnowledgeBaseArticle[]>(MOCK_DATA.knowledgeBaseArticles);
  knowledgeBaseCategories = signal<KnowledgeBaseCategory[]>(MOCK_DATA.knowledgeBaseCategories);
  automationRules = signal<AutomationRule[]>(MOCK_DATA.automationRules);
  groups = signal<Group[]>(MOCK_DATA.groups);
  slaRules = signal<SlaRules>(MOCK_DATA.slaRules);
  emails = signal<MockEmail[]>(MOCK_DATA.emails);
  chatSessions = signal<ChatSession[]>(MOCK_DATA.chatSessions);
  slackMessages = signal<SlackMessage[]>(MOCK_DATA.slackMessages);
  slackSettings = signal<SlackSettings>(MOCK_DATA.slackSettings);
  wallboardData = signal<WallboardData>(MOCK_DATA.wallboardData);
  qaRubrics = signal<QARubric[]>(MOCK_DATA.qaRubrics);
  qaReviews = signal<QAReview[]>(MOCK_DATA.qaReviews);
  formDefinitions = signal<FormDefinition[]>(MOCK_DATA.formDefinitions);
  availableTags = signal<string[]>(MOCK_DATA.availableTags);
  analyticsData = signal<AnalyticsData>(MOCK_DATA.analyticsData);

  currentAgent = signal<Agent>(this.agents()[0]);
  
  // UI state signals
  activeView = signal<'tickets' | 'customers' | 'knowledge-base' | 'reports' | 'analytics' | 'quality-assurance' | 'dev-plan'>('tickets');
  selectedTicket = signal<Ticket | null>(this.tickets()[0]);
  showNewTicketModal = signal(false);

  menuItems = [
    { id: 'tickets', label: 'Tickets', icon: 'inbox' },
    { id: 'customers', label: 'Customers', icon: 'users' },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: 'library' },
    { id: 'reports', label: 'Reports', icon: 'barchart3' },
    { id: 'analytics', label: 'Analytics', icon: 'trendingup' },
    { id: 'quality-assurance', label: 'QA', icon: 'checksquare' },
    { id: 'dev-plan', label: 'Dev Plan', icon: 'clipboard' },
  ];

  constructor() {
    // Effect to update viewing agents for demo purposes
    effect(() => {
        const ticket = this.selectedTicket();
        if (ticket) {
            this.tickets.update(tickets => tickets.map(t => {
                if (t.id === ticket.id) {
                    return {...t, viewingAgents: [this.currentAgent().name, 'Jane Doe']};
                }
                if (t.viewingAgents?.includes(this.currentAgent().name)) {
                    const viewingAgents = t.viewingAgents.filter(name => name !== this.currentAgent().name);
                    return {...t, viewingAgents };
                }
                return t;
            }));
        }
    }, { allowSignalWrites: true });
  }

  getInitials(name: string): string {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
  }

  getContact(contactId: number): Contact | undefined {
    return this.contacts().find(c => c.id === contactId);
  }

  getStatusClass(status: string): string {
    switch(status) {
        case 'open': return 'bg-blue-200 text-blue-800';
        case 'in-progress': return 'bg-yellow-200 text-yellow-800';
        case 'resolved': return 'bg-green-200 text-green-800';
        case 'closed': return 'bg-gray-200 text-gray-800';
        default: return 'bg-gray-200';
    }
  }

  selectTicketById(ticketId: number) {
    const ticket = this.tickets().find(t => t.id === ticketId);
    if (ticket) {
      this.selectedTicket.set(ticket);
    }
  }

  handleNewTicket(newTicketData: Partial<Ticket>) {
    const newTicket: Ticket = {
        id: Math.max(...this.tickets().map(t => t.id)) + 1,
        subject: newTicketData.subject || 'No Subject',
        contactId: newTicketData.contactId!,
        organizationId: this.contacts().find(c => c.id === newTicketData.contactId)?.organizationId || null,
        status: 'open',
        priority: newTicketData.priority || 'medium',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        messages: [{
            from: this.contacts().find(c => c.id === newTicketData.contactId)!.name,
            type: 'customer',
            content: newTicketData.messages![0].content,
            timestamp: new Date().toISOString()
        }],
        internalNotes: [],
        tags: newTicketData.tags || [],
        assignedTo: null,
        watchers: [],
        parentId: null,
        childTicketIds: [],
        customFields: newTicketData.customFields || {}
    };
    this.tickets.update(tickets => [newTicket, ...tickets]);
    this.selectedTicket.set(newTicket);
    this.showNewTicketModal.set(false);
  }

  handleKbFeedback(feedback: KbFeedback) {
      this.knowledgeBaseArticles.update(articles => articles.map(a => {
          if (a.id === feedback.articleId) {
              return {
                  ...a,
                  upvotes: a.upvotes + (feedback.vote === 'up' ? 1 : 0),
                  downvotes: a.downvotes + (feedback.vote === 'down' ? 1 : 0),
              };
          }
          return a;
      }));
  }

  handleSaveReview(review: QAReview) {
      this.qaReviews.update(reviews => [...reviews, review]);
  }
}
