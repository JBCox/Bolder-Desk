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
                { name: 'Multi-language Support', description: 'Localize the help desk for global teams and customers.', status: 'Not Started' },
                { name: 'Audit Logs', description: 'Track all changes made within the system for security and compliance.', status: 'Not Started' },
                { name: 'Marketplace for 3rd Party Apps', description: 'Allow developers to build and share integrations.', status: 'Not Started' },
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
            { name: 'Slack Actions (Create/Update Ticket)', description: 'Allow agents to manage tickets directly from Slack.', status: 'Not Started' },
            { name: 'Facebook Messenger Integration', description: 'Manage customer conversations from Facebook Messenger.', status: 'Not Started' },
            { name: 'Twitter DM Integration', description: 'Respond to support requests from Twitter Direct Messages.', status: 'Not Started' },
            { name: 'WhatsApp Integration', description: 'Engage with customers on the world\'s most popular messaging app.', status: 'Not Started' },
          ]
        },
        {
          name: 'Phase 3: Platform Extensibility',
          icon: 'server',
          description: 'Opening up the platform for custom development and deep integrations.',
          features: [
            { name: 'Public REST API', description: 'Enable programmatic access to help desk data and actions.', status: 'Not Started' },
            { name: 'Webhook Support (Outgoing)', description: 'Send real-time notifications to external systems.', status: 'Not Started' },
            { name: 'Salesforce Integration', description: 'Sync customer and ticket data with Salesforce CRM.', status: 'Not Started' },
            { name: 'Jira Integration', description: 'Create and link Jira issues directly from help desk tickets.', status: 'Not Started' },
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
            { name: 'Tone Rewriting for Agent Replies', description: 'Adjust the tone of agent replies to be more formal or friendly.', status: 'Not Started' },
            { name: 'Predictive CSAT Analysis', description: 'Predict customer satisfaction scores before the survey is sent.', status: 'Not Started' },
            { name: 'Anomaly Detection', description: 'Get alerted to unusual spikes in ticket volume for specific topics.', status: 'Not Started' },
          ]
        },
        {
          name: 'Phase 3: Generative Insights (Gemini)',
          icon: 'sparkles',
          description: 'Leveraging generative AI to uncover deep insights from your support data.',
          features: [
            { name: 'Automated CSAT Comment Analysis', description: 'Categorize and summarize free-text CSAT feedback.', status: 'Done' },
            { name: 'Identify Ticket Deflection Opportunities', description: 'AI analysis to find common issues that could be solved with new KB articles.', status: 'Not Started' },
            { name: 'Generate Executive Summaries for Reports', description: 'Create natural language summaries of performance reports.', status: 'Not Started' },
            { name: 'Proactive Problem Management', description: 'Automatically identify multiple related incidents and suggest creating a problem ticket.', status: 'Not Started' },
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
            { name: 'Workspace & Board Management', description: 'Full CRUD for Workspaces and Boards, including customization (colors and images for backgrounds), icons, descriptions, duplication, and cascading deletion.', status: 'Not Started' },
            { name: 'Archive & Restore', description: 'Safely archive boards, lists, and cards, with the ability to restore them later.', status: 'Not Started' },
            { name: 'Favorite/Starred Boards', description: 'Pin frequently-used boards for quick access in the sidebar.', status: 'Not Started' },
            { name: 'Workspace & Board RBAC', description: 'Owner, Admin, Member, and Viewer roles at both the Workspace and Board level, with member management and online presence indicators.', status: 'Not Started' },
            { name: 'Board Visibility Controls', description: 'Support for Private, Workspace-wide, and Public (read-only) boards.', status: 'Not Started' },
            { name: 'List & Card Management', description: 'Full CRUD for lists (rename, reorder, copy, move, descriptions) and cards. Supports drag-and-drop, duplication, and moving/copying cards between boards.', status: 'Not Started' },
            { name: 'Collapsible Lists', description: 'Collapse and expand individual lists on a board to save space and focus on relevant columns.', status: 'Not Started' },
            { name: 'Inline Renaming', description: 'Rename boards, lists, and cards directly in place for a faster workflow.', status: 'Not Started' },
            { name: 'Real-time Collaboration (WebSockets)', description: 'Live updates for all users on a board, with typing indicators, conflict resolution, and automatic reconnection on disconnect.', status: 'Not Started' },
            { name: 'Comments, @mentions, & Attachments', description: 'Threaded, markdown-enabled comments on cards with user notifications and full file attachment support with previews.', status: 'Not Started' },
            { name: 'Labels Management', description: 'Create and apply color-coded labels to cards, with a label legend and quick-add search.', status: 'Not Started' }
          ]
        },
        {
          name: 'Phase 2: Advanced Card & Board Features',
          icon: 'sliders',
          description: 'Adding depth to cards and providing powerful tools for managing work.',
          features: [
            { name: 'Custom Fields', description: 'Create and manage workspace/board-scoped custom fields (text, number, date, dropdown, etc.) and apply them to cards.', status: 'Not Started' },
            { name: 'Rich Card Details', description: 'Support for markdown descriptions, due dates, start dates, priority levels, and multiple assignees.', status: 'Not Started' },
            { name: 'Card Visual Customization', description: 'Set cover images, solid colors, or full backgrounds on cards for better visual organization.', status: 'Not Started' },
            { name: 'Card Activity Log', description: 'View a complete, timestamped audit trail of all changes and comments on a card, including created/modified user and date stamps.', status: 'Not Started' },
            { name: 'Card Age & Due Date Indicators', description: 'Visual badges on cards to show if they are overdue, due soon, or approaching a deadline.', status: 'Not Started' },
            { name: 'Advanced Checklists & Sub-tasks', description: 'Create multiple checklists per card, convert items to new linked cards, and show completion progress bars. Includes a toggle to show/hide completed items.', status: 'Not Started' },
            { name: 'Card Dependencies & Dependencies Dashboard', description: 'Define \'Blocks\', \'Blocked by\', \'Relates to\', \'Duplicates\', and \'Parent/Child\' dependencies between cards, with visual indicators, dependency notes, and a global graph. Includes protection against circular dependencies.', status: 'Not Started' },
            { name: 'Bulk Operations', description: 'Multi-select cards via checkboxes or Shift+click to perform actions (move, assign, label, etc.) on them at once.', status: 'Not Started' },
            { name: 'Card Merging', description: 'Combine multiple cards into one, merging all properties. Source cards are archived but do not auto-complete linked checklist items.', status: 'Not Started' },
            { name: 'List Limits (WIP)', description: 'Set Work-in-Progress limits on lists to visually warn when capacity is exceeded.', status: 'Not Started' }
          ]
        },
        {
          name: 'Phase 3: Multiple Views & Powerful Search',
          icon: 'layout-template',
          description: 'Offering multiple ways to visualize data and find information quickly.',
          features: [
            { name: 'Multiple Board Views: Calendar', description: 'View cards on a calendar by due date, with drag-and-drop rescheduling.', status: 'Not Started' },
            { name: 'Multiple Board Views: Table', description: 'A spreadsheet-like grid with sortable columns, inline editing, multi-select, and export to CSV/Excel.', status: 'Not Started' },
            { name: 'Multiple Board Views: Gantt Chart', description: 'A timeline view with dependency arrows, progress bars, and critical path highlighting.', status: 'Not Started' },
            { name: 'Global Search & Command Palette (Cmd+K)', description: 'A keyboard-driven command palette (Cmd+K) to search for anything. Shows recent items first and supports quick actions like \'Create card\' or \'Navigate to board\'.', status: 'Not Started' },
            { name: 'Advanced Filtering & Saved Filters', description: 'Filter cards by any property (including custom fields) and allow users to save, pin, and share complex filter configurations.', status: 'Not Started' },
            { name: 'My Work Personal Dashboard', description: 'A personalized view showing all cards assigned to a user across all boards and workspaces, grouped by due date or priority.', status: 'Not Started' }
          ]
        },
        {
          name: 'Phase 4: Automation & Integrations',
          icon: 'zap',
          description: 'Automating repetitive tasks and connecting the Kanban board to external systems.',
          features: [
            { name: 'Automation Rules Engine', description: 'A trigger-condition-action system to automate workflows. Conditions act as optional filters (e.g., \'only if a certain label is present\').', status: 'Not Started' },
            { name: 'Card & Board Templates', description: 'Create and manage templates for cards and boards in a workspace-scoped library. Update existing templates from a card or board.', status: 'Not Started' },
            { name: 'Recurring Cards', description: 'Set up cards to be created automatically on a recurring schedule (daily, weekly, monthly, or cron).', status: 'Not Started' },
            { name: 'Time Tracking & Reporting', description: 'Log estimated and actual time spent on cards, use a start/stop timer, and generate exportable time reports.', status: 'Not Started' },
            { name: 'Advanced Email Integration (OAuth)', description: 'Connect email via per-user OAuth to auto-comment on cards. Features AI fuzzy matching, checklist item matching, data extraction with field mapping, selective scanning filters, audit logging, E2E encryption (AES-256), privacy controls, and intelligent thread tracking. Supports manual and scheduled scanning.', status: 'Not Started' },
            { name: 'Webhooks', description: 'Send data to external services with HMAC signature verification and automatic retry logic.', status: 'Not Started' }
          ]
        },
        {
          name: 'Phase 5: Enterprise & Project Management',
          icon: 'shield',
          description: 'Adding features for complex project management, security, and user comfort.',
          features: [
            { name: 'Authentication & User Management', description: 'Full login/register flows with session management, password hashing, CSRF protection, and user profiles with preferences.', status: 'Not Started' },
            { name: 'Notifications (In-App & Email)', description: 'A notification center for @mentions, assignments, due date reminders, etc. with actions like \'Mark as Read\', \'Navigate to Item\', and \'Delete\'.', status: 'Not Started' },
            { name: 'Customization & Personalization', description: 'User-selectable light/dark themes, custom board/list/card colors, layout preferences, and a suite of fixed keyboard shortcuts.', status: 'Not Started' },
            { name: 'Accessibility (WCAG AA)', description: 'Ensure the application is fully keyboard navigable, screen-reader friendly, and meets contrast standards.', status: 'Not Started' },
            { name: 'Performance Optimizations', description: 'Implement optimistic updates, virtual scrolling for long lists, intelligent caching, and lazy loading for a fast experience.', status: 'Not Started' },
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
            { name: 'One-Click: Convert Ticket to Kanban Card', description: 'Instantly create a new task on a Kanban board from a support ticket.', status: 'Not Started' },
            { name: 'Link Existing Tickets and Cards', description: 'Associate one or more tickets with a Kanban card, and vice-versa.', status: 'Not Started' },
            { name: 'Bi-directional Visibility', description: 'View linked tickets from the Kanban card and linked cards from the ticket UI.', status: 'Not Started' },
          ]
        },
        {
          name: 'Phase 2: Integrated Workflows',
          icon: 'zap',
          description: 'Synchronizing status and communication to create a unified workflow.',
          features: [
            { name: 'Status Synchronization', description: 'Automatically update ticket status when a linked Kanban card moves to "Done".', status: 'Not Started' },
            { name: 'Post Internal Notes Across Systems', description: 'Add an internal note to a ticket directly from the linked Kanban card.', status: 'Not Started' },
            { name: 'Expose Ticket SLA on Kanban Card', description: 'Show SLA status as a badge on the linked Kanban card.', status: 'Not Started' },
            { name: 'Aggregate Time Tracking', description: 'Roll up time tracked on tickets to the parent Kanban card.', status: 'Not Started' },
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
            { name: 'Asset Management (CMDB)', description: 'Track and manage hardware, software, and other company assets, and link them to tickets.', status: 'Not Started' },
            { name: 'Change & Release Management', description: 'Implement formal workflows for managing IT changes and software releases, including approval chains.', status: 'Not Started' },
          ]
        },
        {
          name: 'Phase 2: Deeper Customer Engagement',
          icon: 'heart-pulse',
          description: 'Building tools that foster community and increase motivation.',
          features: [
            { name: 'Community Forums', description: 'Enable customers to help each other, reducing ticket volume and building a user community.', status: 'Not Started' },
            { name: 'Agent Gamification', description: 'Introduce leaderboards, achievements, and badges for agents based on performance metrics like CSAT and resolution time.', status: 'Not Started' },
          ]
        },
        {
          name: 'Phase 3: Next-Gen Communications & AI',
          icon: 'mic',
          description: 'Integrating voice channels and applying AI for deeper analysis.',
          features: [
            { name: 'Telephony (Voice/CTI) Integration', description: 'Connect with phone systems to handle calls, create tickets from voicemails, and show customer context on incoming calls.', status: 'Not Started' },
            { name: 'AI Call Transcription & Analysis', description: 'Automatically transcribe calls and use Gemini to summarize them, analyze sentiment, and identify keywords.', status: 'Not Started' },
            { name: 'AI-Powered Spam Detection', description: 'Automatically identify and filter out spam tickets from any channel to keep queues clean.', status: 'Not Started' },
          ]
        },
        {
          name: 'Phase 4: Ecosystem & Developer Platform',
          icon: 'code',
          description: 'Expanding our reach by integrating with crucial third-party developer and business platforms.',
          features: [
            { name: 'Developer Tool Integrations', description: 'Link tickets and tasks to issues, commits, and pull requests in GitHub, GitLab, and other dev tools.', status: 'Not Started' },
            { name: 'E-commerce & Payments Integrations', description: 'Display customer order history and subscription data from platforms like Shopify and Stripe directly within the ticket view.', status: 'Not Started' },
            { name: 'In-App Mobile SDK', description: 'Provide an SDK for iOS and Android developers to embed support directly into their mobile applications.', status: 'Not Started' },
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