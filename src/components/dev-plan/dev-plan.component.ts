import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

interface Feature {
  name: string;
  description: string;
  status: 'Done' | 'In Progress' | 'Not Started';
}

interface Phase {
  name: string;
  icon: string;
  description: string;
  features: Feature[];
}

interface Tab {
  name: string;
  phases: Phase[];
}

@Component({
  selector: 'app-dev-plan',
  template: `
    <div class="p-6 bg-slate-50 dark:bg-slate-800/50 h-full overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Development Plan</h2>
        <div class="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
          <app-icon name="rocket" class="w-5 h-5"></app-icon>
          <span>Feature Roadmap & Progress</span>
        </div>
      </div>

      <div class="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        @for(tab of plan(); track tab.name) {
          <button 
            (click)="activeTab.set(tab.name)"
            class="px-4 py-2 text-sm font-medium whitespace-nowrap"
            [class]="activeTab() === tab.name 
              ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
          >
            {{ tab.name }}
          </button>
        }
      </div>

      <div class="mt-6">
        @for(tab of plan(); track tab.name) {
          @if (activeTab() === tab.name) {
            @for(phase of tab.phases; track phase.name) {
              <div class="mb-8 p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                 <div class="flex items-start space-x-4 mb-4">
                    <app-icon [name]="phase.icon" class="w-8 h-8 text-indigo-500 flex-shrink-0 mt-1"></app-icon>
                    <div>
                        <h2 class="text-xl font-bold text-gray-900 dark:text-slate-100">{{ phase.name }}</h2>
                        <p class="text-sm text-gray-600 dark:text-slate-400">{{ phase.description }}</p>
                    </div>
                </div>
                <div class="space-y-3">
                  @for(feature of phase.features; track feature.name) {
                    <div class="p-3 rounded-md border border-gray-200 dark:border-slate-700 flex items-start justify-between"
                         [class]="getStatusClass(feature.status).bg">
                      <div class="flex items-start">
                         <div class="w-5 h-5 mr-3 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" [class]="getStatusClass(feature.status).iconBg">
                            <app-icon [name]="getStatusClass(feature.status).icon" class="w-3 h-3" [class]="getStatusClass(feature.status).iconColor"></app-icon>
                         </div>
                         <div>
                           <p class="font-semibold text-slate-800 dark:text-slate-100">{{ feature.name }}</p>
                           <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">{{ feature.description }}</p>
                         </div>
                      </div>
                      <div class="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ml-4" [class]="getStatusClass(feature.status).badge">
                        {{ feature.status }}
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          }
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class DevPlanComponent {
  activeTab = signal('Help Desk Platform');

  plan = signal<Tab[]>([
    {
      name: 'Help Desk Platform',
      phases: [
        {
          name: 'Phase 1: Foundation (Core Ticketing)',
          icon: 'package',
          description: 'The essential building blocks of our support system.',
          features: [
            { name: 'Ticket Management (CRUD)', description: 'Core functionality for creating, viewing, and managing tickets.', status: 'Done' },
            { name: 'Contact & Organization CRM', description: 'Store and manage customer and company information.', status: 'Done' },
            { name: 'UI/UX Foundation (Layout, Theming)', description: 'Establish the core UI, layout, and dark/light mode switching.', status: 'Done' },
            { name: 'Agent Roles & Permissions', description: 'Control access to different parts of the application.', status: 'Done' },
            { name: 'Customer Portal', description: 'A dedicated portal for customers to view their tickets and the KB.', status: 'Done' },
          ]
        },
        {
          name: 'Phase 2: Agent Productivity & Collaboration',
          icon: 'rocket',
          description: 'Features designed to make agents faster, smarter, and more collaborative.',
          features: [
            { name: 'Internal Notes', description: 'Collaborate with team members privately on tickets.', status: 'Done' },
            { name: 'Ticket Merging', description: 'Combine duplicate tickets into a single thread.', status: 'Done' },
            { name: 'Ticket Splitting', description: 'Create a new ticket from an existing message.', status: 'Done' },
            { name: 'Parent/Child Ticket Linking', description: 'Link related tickets for complex problem management.', status: 'Done' },
            { name: 'Time Tracking', description: 'Log time spent on tickets for reporting and billing.', status: 'Done' },
            { name: 'Bulk Ticket Actions', description: 'Perform actions on multiple tickets at once.', status: 'Done' },
            { name: 'Knowledge Base (Authoring & Voting)', description: 'Create and manage support articles for agents and customers.', status: 'Done' },
            { name: 'Keyboard Shortcuts', description: 'Boost agent speed with keyboard navigation and actions.', status: 'Done' },
            { name: 'Advanced Filtering (AND/OR Logic)', description: 'Build complex queries with nested condition groups using AND/OR logic to precisely target tickets.', status: 'Done' },
            { name: 'Saved Views (Private & Shared)', description: 'Save complex filter combinations as views for quick access. Create private views or share them with teams.', status: 'Done' },
            { name: 'Customizable Views (Columns, Sort, Group)', description: 'Customize saved views by choosing columns to display, setting default sorting, and grouping tickets.', status: 'Done' },
          ]
        },
        {
            name: 'Phase 3: Enterprise & Automation',
            icon: 'briefcase',
            description: 'Adding advanced features for large teams and complex workflows.',
            features: [
                { name: 'SLA Management & Tracking', description: 'Define and track service level agreements to meet response targets.', status: 'Done' },
                { name: 'Service Catalog & Dynamic Form Builder', description: 'Create custom forms for different types of service requests.', status: 'Done' },
                { name: 'Automation Rules Engine', description: 'Automate repetitive tasks like ticket assignment and status changes.', status: 'Done' },
                { name: 'Advanced Reporting Suite', description: 'A dedicated module for analyzing help desk performance.', status: 'Done' },
                { name: 'Quality Assurance (QA) Module', description: 'Review and score agent interactions against custom rubrics.', status: 'Done' },
                { name: 'Single Sign-On (SSO/SAML)', description: 'Allow users to log in with their corporate identity provider.', status: 'Done' },
                { name: 'Wallboard / Live Dashboard', description: 'A real-time, high-level view of help desk activity.', status: 'Done' },
                { name: 'Multi-language Support', description: 'Localize the help desk for global teams and customers.', status: 'Done' },
                { name: 'Audit Logs', description: 'Track all changes made within the system for security and compliance.', status: 'Done' },
                { name: 'Custom Fields', description: 'Define custom data fields (text, number, dropdowns) to capture business-specific information on tickets.', status: 'Done' },
                { name: 'Automated Tagging Rules', description: 'Create rules to automatically add tags based on ticket properties like subject, content, or source.', status: 'Done' },
            ]
        }
      ]
    },
    {
      name: 'Omnichannel & Integrations',
      phases: [
        {
          name: 'Phase 1: Core Channels',
          icon: 'inbox',
          description: 'Connecting with customers through essential communication channels.',
          features: [
            { name: 'Email to Ticket (Inbox)', description: 'Convert incoming emails into trackable support tickets.', status: 'Done' },
            { name: 'Live Chat for Agents & Customers', description: 'Provide real-time support through a dedicated chat interface.', status: 'Done' },
            { name: 'Embeddable Customer Chat Widget', description: 'Add a chat widget to any website or application.', status: 'Done' },
          ]
        },
        {
          name: 'Phase 2: Social & Messaging',
          icon: 'users',
          description: 'Expanding our reach to popular social media and messaging platforms.',
          features: [
            { name: 'Slack Integration (Message Streaming)', description: 'Pipe Slack messages from a support channel into the app.', status: 'Done' },
            { name: 'Slack Actions (Create/Update Ticket)', description: 'Allow agents to manage tickets directly from Slack.', status: 'Done' },
            { name: 'Facebook Messenger Integration', description: 'Manage customer conversations from Facebook Messenger.', status: 'Done' },
            { name: 'Twitter DM Integration', description: 'Respond to support requests from Twitter Direct Messages.', status: 'Done' },
            { name: 'WhatsApp Integration', description: 'Engage with customers on the world\'s most popular messaging app.', status: 'Done' },
          ]
        },
        {
          name: 'Phase 3: Platform Extensibility',
          icon: 'server',
          description: 'Opening up the platform for custom development and deep integrations.',
          features: [
            { name: 'Public REST API', description: 'Enable programmatic access to help desk data and actions.', status: 'Done' },
            { name: 'Webhook Support (Outgoing)', description: 'Send real-time notifications to external systems.', status: 'Done' },
            { name: 'Salesforce Integration', description: 'Sync customer and ticket data with Salesforce CRM.', status: 'Done' },
            { name: 'Jira Integration', description: 'Create and link Jira issues directly from help desk tickets.', status: 'Done' },
          ]
        },
      ],
    },
    {
      name: 'AI & Intelligence',
      phases: [
        {
          name: 'Phase 1: Agent Assistance (Gemini)',
          icon: 'brain-circuit',
          description: 'AI-powered tools to help agents work faster and provide better answers.',
          features: [
            { name: 'AI Ticket Summarization', description: 'Instantly get the gist of long ticket conversations.', status: 'Done' },
            { name: 'AI Reply Suggestions', description: 'Generate context-aware reply suggestions for agents.', status: 'Done' },
            { name: 'AI Ticket Tag Suggestions', description: 'Automatically suggest relevant tags based on ticket content.', status: 'Done' },
            { name: 'AI Sentiment Analysis', description: 'Gauge customer sentiment to prioritize and tailor responses.', status: 'Done' },
            { name: 'AI Intelligent Ticket Routing', description: 'Automatically assign tickets to the best agent based on skills and content.', status: 'Done' },
          ]
        },
        {
          name: 'Phase 2: Proactive Support (Gemini)',
          icon: 'shield',
          description: 'Using AI to solve problems before they escalate and improve self-service.',
          features: [
            { name: 'Automated Knowledge Base Creation', description: 'Generate KB article drafts from resolved tickets.', status: 'Done' },
            { name: 'Natural Language KB Search', description: 'Get direct answers to questions by searching the KB with natural language.', status: 'Done' },
            { name: 'Tone Rewriting for Agent Replies', description: 'Adjust the tone of agent replies to be more formal or friendly.', status: 'Done' },
            { name: 'Predictive CSAT Analysis', description: 'Predict customer satisfaction scores before the survey is sent.', status: 'Done' },
            { name: 'Anomaly Detection', description: 'Get alerted to unusual spikes in ticket volume for specific topics.', status: 'Done' },
          ]
        },
        {
          name: 'Phase 3: Generative Insights (Gemini)',
          icon: 'sparkles',
          description: 'Leveraging generative AI to uncover deep insights from your support data.',
          features: [
            { name: 'Automated CSAT Comment Analysis', description: 'Categorize and summarize free-text CSAT feedback.', status: 'Done' },
            { name: 'Generate Executive Summaries for Reports', description: 'Create natural language summaries of performance reports.', status: 'Done' },
            { name: 'Identify Ticket Deflection Opportunities', description: 'AI analysis to find common issues that could be solved with new KB articles.', status: 'Done' },
            { name: 'Proactive Problem Management', description: 'Automatically identify multiple related incidents and suggest creating a problem ticket.', status: 'Done' },
          ]
        },
      ],
    },
    {
      name: 'Kanban Project Management',
      phases: [
        {
          name: 'Phase 1: Core Functionality & Collaboration',
          icon: 'clipboard-check',
          description: 'Establishing the fundamental features of a flexible and powerful Kanban system.',
          features: [
            { name: 'Workspace & Board Management', description: 'Full CRUD for Workspaces and Boards. Customize boards with colors and background images. Duplicate boards to quickly set up new projects. Safely delete workspaces and boards with cascading deletion.', status: 'In Progress' },
            { name: 'Archive & Restore', description: 'Safely archive boards, lists, and cards to remove them from active view without permanent deletion. Browse the archive to restore items at any time.', status: 'Not Started' },
            { name: 'Favorite/Starred Boards', description: 'Pin frequently-used boards for quick access from a dedicated "Favorites" section in the main navigation sidebar.', status: 'Not Started' },
            { name: 'Workspace & Board RBAC', description: 'Granular role-based access control with Owner, Admin, Member, and Viewer roles. Manage members at both the workspace and board level. See online presence indicators for active collaborators.', status: 'Not Started' },
            { name: 'Board Visibility Controls', description: 'Set board visibility to Private (invite-only), Workspace-wide (visible to all members of the workspace), or Public (read-only for anyone with the link).', status: 'Not Started' },
            { name: 'List & Card Management', description: 'Full CRUD for lists and cards. Drag-and-drop to reorder items. Move or copy cards between lists and boards. Inline renaming for fast edits.', status: 'Not Started' },
            { name: 'Collapsible Lists', description: 'Collapse and expand individual lists on a board to save horizontal space and focus on relevant workflow stages.', status: 'Not Started' },
            { name: 'Real-time Collaboration (WebSockets)', description: 'Live updates for all users on a board, showing changes to cards, lists, and comments in real-time. See typing indicators in comments. Smart conflict resolution for simultaneous edits.', status: 'Not Started' },
            { name: 'Comments, @mentions, & Attachments', description: 'Full Markdown support in comments. Use @mentions to notify team members. Threaded replies for organized discussions. Attach files with previews for common image types.', status: 'Not Started' },
            { name: 'Labels Management', description: 'Create and manage a library of color-coded labels. Apply multiple labels to cards for categorization. Filter the board by one or more labels.', status: 'Not Started' }
          ]
        },
        {
          name: 'Phase 2: Advanced Card & Board Features',
          icon: 'sliders',
          description: 'Adding depth to cards and providing powerful tools for managing work.',
          features: [
            { name: 'Custom Fields', description: 'Define workspace-scoped custom fields (Text, Number, Date, Dropdown, User Picker, Checkbox) and apply them to cards to capture structured, domain-specific data.', status: 'Not Started' },
            { name: 'Rich Card Details', description: 'Utilize Markdown in card descriptions, set due dates with reminders, define start dates for planning, set priority levels (Urgent, High, Medium, Low), and assign multiple users to a single card.', status: 'Not Started' },
            { name: 'Card Visual Customization', description: 'Enhance visual organization by setting cover images from attachments, choosing solid colors, or applying full-card background patterns.', status: 'Not Started' },
            { name: 'Card Activity Log', description: 'Access a complete, filterable, timestamped audit trail of all changes and comments on a card. Easily see who did what and when.', status: 'Not Started' },
            { name: 'Card Age & Due Date Indicators', description: 'Visual badges on cards to show if they are overdue, due soon, or have been inactive (stale) in a list for a long time.', status: 'Not Started' },
            { name: 'Advanced Checklists & Sub-tasks', description: 'Create multiple named checklists per card. Convert checklist items into new, linked cards. Assign users and due dates to individual checklist items. See completion progress bars on the card face.', status: 'Not Started' },
            { name: 'Card Dependencies & Dependencies Dashboard', description: 'Define relationships between cards: \'Blocks\', \'Is Blocked By\', \'Relates to\', and \'Duplicates\'. Visualize dependencies on the board and prevent moving a card if its blocking dependency is incomplete.', status: 'Not Started' },
            { name: 'Bulk Operations', description: 'Use multi-select (checkboxes or Shift+click) to perform actions like moving, assigning, labeling, or setting due dates on many cards at once.', status: 'Not Started' },
            { name: 'Card Merging', description: 'Combine multiple cards into a single one, intelligently merging all properties like comments, attachments, and activity logs. Source cards are automatically archived.', status: 'Not Started' },
            { name: 'List Limits (WIP)', description: 'Set Work-in-Progress (WIP) limits on lists to visually highlight bottlenecks when the number of cards in a list exceeds its configured capacity.', status: 'Not Started' }
          ]
        },
        {
          name: 'Phase 3: Multiple Views & Powerful Search',
          icon: 'layout-template',
          description: 'Offering multiple ways to visualize data and find information quickly.',
          features: [
            { name: 'Multiple Board Views: Calendar', description: 'View cards on a monthly or weekly calendar based on their start and due dates. Drag-and-drop cards to reschedule.', status: 'Not Started' },
            { name: 'Multiple Board Views: Table', description: 'A spreadsheet-like grid view of all cards. Customize, sort, and filter columns. Inline edit any field. Multi-select rows for bulk actions and export to CSV/Excel.', status: 'Not Started' },
            { name: 'Multiple Board Views: Gantt Chart', description: 'A timeline view for project planning. Visualize card durations and dependencies with arrows, track progress, and identify the critical path.', status: 'Not Started' },
            { name: 'Global Search & Command Palette (Cmd+K)', description: 'A fast, keyboard-driven command palette (Cmd+K) to search for boards, cards, users, and labels across the entire workspace. Supports quick actions like \'Create card\' or \'Go to board\'.', status: 'Not Started' },
            { name: 'Advanced Filtering & Saved Filters', description: 'Filter cards on any view by any property (including custom fields) using complex AND/OR logic. Save filter combinations for personal use or share with the team.', status: 'Not Started' },
            { name: 'My Work Personal Dashboard', description: 'A personalized dashboard showing all cards assigned to a user across all boards, grouped by due date, priority, or project.', status: 'Not Started' }
          ]
        },
        {
          name: 'Phase 4: Automation & Integrations',
          icon: 'zap',
          description: 'Automating repetitive tasks and connecting the Kanban board to external systems.',
          features: [
            { name: 'Automation Rules Engine', description: 'A "Butler"-style trigger-condition-action system. Example: "When a card with label \'Bug\' is moved to \'Done\', post a comment \'Resolved!\' and archive the card."', status: 'Not Started' },
            { name: 'Card & Board Templates', description: 'Create templates for frequently used cards (e.g., \'Bug Report\') with predefined checklists, labels, and custom fields. Create board templates for common workflows (e.g., \'Agile Sprint\').', status: 'Not Started' },
            { name: 'Recurring Cards', description: 'Set up cards to be created automatically on a recurring schedule (daily, weekly, monthly, or a custom cron schedule).', status: 'Not Started' },
            { name: 'Time Tracking & Reporting', description: 'Log estimated and actual time spent on cards using a start/stop timer. Generate reports on time spent per user, per board, or per label.', status: 'Not Started' },
            { name: 'Advanced Email Integration (OAuth)', description: 'Connect email via per-user OAuth to automate card actions. Features AI fuzzy matching for cards and checklist items, data extraction with field mapping, and intelligent thread tracking with E2E encryption.', status: 'Not Started' },
            { name: 'Webhooks', description: 'Send outgoing webhooks for various events (card created, moved, comment added, etc.) to integrate with external systems. Support for HMAC signature verification and automatic retries.', status: 'Not Started' }
          ]
        },
        {
          name: 'Phase 5: Enterprise & Project Management',
          icon: 'shield',
          description: 'Adding features for complex project management, security, and user comfort.',
          features: [
            { name: 'Authentication & User Management', description: 'Full login/register flows with session management, password hashing (bcrypt), CSRF protection, and user profiles with preferences.', status: 'Not Started' },
            { name: 'Notifications (In-App & Email)', description: 'A real-time notification center for @mentions, assignments, and due date reminders, with actions like \'Mark as Read\' and \'Navigate\'. Granular user controls for email notifications.', status: 'Not Started' },
            { name: 'Customization & Personalization', description: 'User-selectable light/dark themes, custom board backgrounds, layout preferences (e.g., compact vs. comfortable), and a suite of fixed keyboard shortcuts.', status: 'Not Started' },
            { name: 'Accessibility (WCAG AA)', description: 'Ensure the application is fully keyboard navigable, screen-reader friendly (ARIA labels), and meets color contrast standards.', status: 'Not Started' },
            { name: 'Performance Optimizations', description: 'Implement optimistic UI updates for a snappy feel, virtual scrolling for boards with thousands of cards, intelligent caching, and lazy loading of components.', status: 'Not Started' },
            { name: 'In-App Documentation', description: 'A comprehensive, searchable help system explaining how to use all Kanban features, with step-by-step visual guides.', status: 'Not Started' }
          ]
        }
      ],
    },
    {
      name: 'Synergy (Help Desk + Kanban)',
      phases: [
        {
          name: 'Phase 1: Seamless Linking',
          icon: 'link',
          description: 'Creating a direct and visible connection between customer issues and development tasks.',
          features: [
            { name: 'One-Click: Convert Ticket to Kanban Card', description: 'Instantly create a new task on a Kanban board from a support ticket. Automatically carries over ticket title, description, and a permanent link back to the original ticket.', status: 'Not Started' },
            { name: 'Link Existing Tickets and Cards', description: 'From a ticket or a card, search and link to one or more existing items in the other system. Supports many-to-many relationships.', status: 'Not Started' },
            { name: 'Bi-directional Visibility', description: 'A dedicated section on the ticket view shows linked Kanban cards with their status, list, and assignee. The Kanban card shows a list of linked tickets with their status and priority.', status: 'Not Started' },
          ]
        },
        {
          name: 'Phase 2: Integrated Workflows',
          icon: 'zap',
          description: 'Synchronizing status and communication to create a unified workflow.',
          features: [
            { name: 'Status Synchronization', description: 'Automatically update ticket status (e.g., to \'Resolved\') and optionally notify the customer when a linked Kanban card moves to a "Done" list.', status: 'Not Started' },
            { name: 'Post Internal Notes Across Systems', description: 'From a Kanban card, write a comment that gets posted as an internal note on all linked tickets, keeping support agents in the loop on development progress.', status: 'Not Started' },
            { name: 'Expose Ticket SLA on Kanban Card', description: 'Show a visual SLA status badge (OK, At Risk, Breached) on the linked Kanban card so developers can prioritize work based on customer urgency.', status: 'Not Started' },
            { name: 'Aggregate Time Tracking', description: 'Time logged on support tickets can optionally be rolled up and added to the total time tracked on the parent Kanban card, providing a full picture of effort.', status: 'Not Started' },
          ]
        },
      ],
    },
    {
      name: 'Next Frontiers & Platform Enhancements',
      phases: [
        {
          name: 'Phase 1: Advanced IT Service Management (ITSM)',
          icon: 'layers',
          description: 'Expanding beyond help desk to support mature ITIL processes.',
          features: [
            { name: 'Asset Management (CMDB)', description: 'Track and manage hardware, software, and other company assets in a configuration management database. Link assets to tickets to understand impact and history.', status: 'Not Started' },
            { name: 'Change & Release Management', description: 'Implement formal workflows for managing IT changes and software releases, including planning, multi-step approval chains, and release scheduling to minimize service disruption.', status: 'Not Started' },
          ]
        },
        {
          name: 'Phase 2: Deeper Customer Engagement',
          icon: 'heart-pulse',
          description: 'Building tools that foster community and increase motivation.',
          features: [
            { name: 'Community Forums', description: 'Enable customers to help each other, reducing ticket volume and building a user community. Allows agents to moderate and convert posts into tickets or KB articles.', status: 'Not Started' },
            { name: 'Agent Gamification', description: 'Introduce leaderboards, achievements, and badges for agents based on performance metrics like CSAT, first response time, and tickets resolved, fostering friendly competition.', status: 'Not Started' },
          ]
        },
        {
          name: 'Phase 3: Next-Gen Communications & AI',
          icon: 'mic',
          description: 'Integrating voice channels and applying AI for deeper analysis.',
          features: [
            { name: 'Telephony (Voice/CTI) Integration', description: 'Connect with phone systems (e.g., via Twilio) to handle calls, automatically create tickets from voicemails, and show a \'screen pop\' with customer context on incoming calls.', status: 'Not Started' },
            { name: 'AI Call Transcription & Analysis', description: 'Automatically transcribe calls and use Gemini to summarize them, analyze sentiment, and identify keywords for automatic tagging and routing.', status: 'Not Started' },
            { name: 'AI-Powered Spam Detection', description: 'Train a model to automatically identify and filter out spam tickets from any channel (email, portal, etc.) to keep queues clean and focused.', status: 'Not Started' },
          ]
        },
        {
          name: 'Phase 4: Ecosystem & Developer Platform',
          icon: 'code',
          description: 'Expanding our reach by integrating with crucial third-party developer and business platforms.',
          features: [
            { name: 'Developer Tool Integrations', description: 'Bi-directional sync with GitHub, GitLab, and other dev tools. Link tickets and cards to issues, commits, and pull requests. See PR status directly from the ticket.', status: 'Not Started' },
            { name: 'E-commerce & Payments Integrations', description: 'Display customer order history and subscription data from platforms like Shopify and Stripe directly within the ticket view.', status: 'Not Started' },
            { name: 'In-App Mobile SDK', description: 'Provide an SDK for iOS and Android developers to embed a native support experience (KB search, ticket submission, chat) directly into their mobile applications.', status: 'Not Started' },
          ]
        }
      ]
    }
  ]);
  
  getStatusClass(status: Feature['status']) {
    switch (status) {
      case 'Done':
        return {
          bg: 'bg-green-50 dark:bg-green-500/10',
          badge: 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300',
          icon: 'check-circle',
          iconBg: 'bg-green-100 dark:bg-green-500/20',
          iconColor: 'text-green-600 dark:text-green-400',
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-50 dark:bg-blue-500/10',
          badge: 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300',
          icon: 'loader',
          iconBg: 'bg-blue-100 dark:bg-blue-500/20',
          iconColor: 'text-blue-600 dark:text-blue-400',
        };
      case 'Not Started':
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-800/50',
          badge: 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
          icon: 'circle',
          iconBg: 'bg-slate-200 dark:bg-slate-700',
          iconColor: 'text-slate-500 dark:text-slate-400',
        };
    }
  }
}
