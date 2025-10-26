import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

interface Feature {
  title: string;
  description: string;
  status: 'Done' | 'In Progress' | 'Not Started';
}

interface RoadmapPhase {
  title: string;
  description: string;
  icon: string;
  iconClass: string;
  features: Feature[];
}

@Component({
  selector: 'app-dev-plan',
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 overflow-y-auto bg-gray-50 dark:bg-slate-900 h-full">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-slate-100">Development Roadmap</h2>
            <p class="mt-2 text-gray-600 dark:text-slate-400">A strategic overview of implemented features and our plan for the future.</p>
        </div>

        <!-- Module Tabs -->
        <div class="mb-8 border-b border-gray-200 dark:border-slate-700">
            <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                <button (click)="activeModule.set('helpdesk')" [class]="'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-lg ' + (activeModule() === 'helpdesk' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300')">
                    Help Desk Platform
                </button>
                <button (click)="activeModule.set('kanban')" [class]="'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-lg ' + (activeModule() === 'kanban' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300')">
                    Kanban Project Management
                </button>
            </nav>
        </div>

        @if(activeModule() === 'helpdesk') {
            <!-- Implemented Features -->
            <div class="mb-12">
                <h3 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-6 flex items-center">
                    <app-icon name="check-circle" class="w-7 h-7 mr-3 text-green-500"></app-icon>
                    Completed Features
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    @for(feature of completedFeatures; track feature) {
                        <div class="bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center">
                            <app-icon name="checksquare" class="w-4 h-4 mr-2 text-green-500 flex-shrink-0"></app-icon>
                            <span class="text-gray-700 dark:text-slate-300">{{ feature }}</span>
                        </div>
                    }
                </div>
            </div>

            <!-- Roadmap Phases -->
            <div class="space-y-12">
                @for(phase of helpdeskRoadmapPhases; track phase.title) {
                    <div>
                        <h3 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-6 flex items-center">
                            <app-icon [name]="phase.icon" class="w-7 h-7 mr-3" [class]="phase.iconClass"></app-icon>
                            {{ phase.title }}
                        </h3>
                        <p class="mb-6 text-gray-600 dark:text-slate-400">{{ phase.description }}</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            @for(feature of phase.features; track feature.title) {
                                <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-5 flex flex-col">
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between mb-2">
                                            <h4 class="font-bold text-gray-800 dark:text-slate-200">{{ feature.title }}</h4>
                                            <span [class]="'px-2 py-0.5 text-xs font-semibold rounded-full ' + getStatusClass(feature.status)">
                                                {{ feature.status }}
                                            </span>
                                        </div>
                                        <p class="text-sm text-gray-600 dark:text-slate-400">{{ feature.description }}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        } @else {
             <div class="space-y-12">
                @for(phase of kanbanRoadmapPhases; track phase.title) {
                    <div>
                        <h3 class="text-2xl font-semibold text-gray-900 dark:text-slate-100 mb-6 flex items-center">
                            <app-icon [name]="phase.icon" class="w-7 h-7 mr-3" [class]="phase.iconClass"></app-icon>
                            {{ phase.title }}
                        </h3>
                        <p class="mb-6 text-gray-600 dark:text-slate-400">{{ phase.description }}</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            @for(feature of phase.features; track feature.title) {
                                <div class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-5 flex flex-col">
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between mb-2">
                                            <h4 class="font-bold text-gray-800 dark:text-slate-200">{{ feature.title }}</h4>
                                            <span [class]="'px-2 py-0.5 text-xs font-semibold rounded-full ' + getStatusClass(feature.status)">
                                                {{ feature.status }}
                                            </span>
                                        </div>
                                        <p class="text-sm text-gray-600 dark:text-slate-400">{{ feature.description }}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        }
      </div>
    </div>
  `
})
export class DevPlanComponent {
  activeModule = signal<'helpdesk' | 'kanban'>('helpdesk');

  completedFeatures = [
    'Core Ticket Management', 'Customer 360 View', 'Internal Notes & Collaboration',
    'Agent Collision Detection', 'Canned Responses & Macros', 'Merge, Split, & Link Tickets',
    'AI Ticket Summarization', 'AI Reply Suggestions', 'AI Tone Changer',
    'AI Knowledge Base Generation', 'AI Answer from KB (RAG)', 'Analytics & Reporting',
    'Live Wallboard View', 'Quality Assurance Module', 'Knowledge Base & Customer Portal'
  ];

  helpdeskRoadmapPhases: RoadmapPhase[] = [
    {
      title: 'Phase 1: Solidifying the Foundation (Enterprise Readiness)',
      description: 'Focus on security, scalability, and administration to make the platform robust and ready for larger customers.',
      icon: 'shield',
      iconClass: 'text-blue-500',
      features: [
        { title: 'Platform API & Webhooks', description: 'Enable deep integrations with a robust event bus, signed webhooks, and a comprehensive API.', status: 'Not Started' },
        { title: 'Granular Roles & Permissions', description: 'Go beyond basic roles and allow admins to create custom permission sets for agents.', status: 'Not Started' },
        { title: 'Comprehensive Audit Logs', description: 'Provide a detailed, searchable trail of every action taken for security and compliance.', status: 'Not Started' },
        { title: 'SSO & SCIM Provisioning', description: 'Unblock larger deals with Single Sign-On and user provisioning.', status: 'Not Started' },
        { title: 'Sandbox Environment', description: 'A safe, isolated environment for admins to test new workflows and configurations before deploying to production.', status: 'Not Started' },
        { title: 'Multi-Brand Support', description: 'Manage support for multiple brands from a single account, each with its own portal and KB.', status: 'Not Started' },
        { title: 'Multi-language Support (Static)', description: 'Localize the agent and customer portals into multiple languages.', status: 'Not Started' },
        { title: 'Custom Dashboards & Reporting', description: 'A drag-and-drop interface for admins to create and schedule their own reports.', status: 'Not Started' },
        { title: 'Data Residency Options', description: 'Allow customers to choose the geographic region (e.g., US, EU) where their data is stored.', status: 'Not Started' },
        { title: 'Data Management APIs (GDPR/CCPA)', description: 'APIs for customers to export or request deletion of their data to meet compliance requirements.', status: 'Not Started' },
      ]
    },
    {
      title: 'Phase 2: Supercharging the Agent (Productivity & AI)',
      description: 'Once the platform is solid, we\'ll make the agent\'s experience second to none with advanced productivity tools and next-generation AI.',
      icon: 'zap',
      iconClass: 'text-yellow-500',
      features: [
        { title: 'Dynamic Form Builder', description: 'A drag-and-drop interface for creating custom ticket forms with conditional logic.', status: 'In Progress' },
        { title: 'Command Palette (CMD+K)', description: 'Navigate the app and perform actions instantly from the keyboard.', status: 'Not Started' },
        { title: 'Real-time Collaboration Suite', description: 'Enable live typing indicators and in-ticket audio huddles for seamless teamwork.', status: 'Not Started' },
        { title: 'Ticket Templates', description: 'Create new tickets from predefined templates for common, repeatable issues.', status: 'Not Started' },
        { title: 'Internal Knowledge Base', description: 'A private, agent-only knowledge base for internal procedures and troubleshooting guides.', status: 'Not Started' },
        { title: 'Agent Scripting & Guided Workflows', description: 'Provide agents with step-by-step guides for handling complex or regulated issues.', status: 'Not Started' },
        { title: 'Advanced Scheduling & Calendaring', description: 'A full calendar view for agents to manage availability, shifts, and out-of-office.', status: 'Not Started' },
        { title: 'Customizable Agent Statuses', description: 'Allow agents to set custom presence statuses (e.g., "In a Meeting", "Training").', status: 'Not Started' },
        { title: 'Gamification & Achievements', description: 'Boost agent motivation with badges, leaderboards, and performance-based achievements.', status: 'Not Started' },
        { title: 'Native Mobile Apps (iOS/Android)', description: 'Provide a fully-featured, native mobile experience for agents on the go.', status: 'Not Started' },
        { title: 'AI-Powered "Next Best Action"', description: 'Proactively suggest context-aware actions to agents, such as applying a macro or merging a ticket.', status: 'Not Started' },
        { title: 'AI-Powered Predictive CSAT', description: 'Use AI to analyze in-progress tickets and flag those at risk of receiving a poor satisfaction score.', status: 'Not Started' },
        { title: 'AI-Powered Quality Assurance (Auto-QA)', description: 'Automatically score ticket interactions against QA rubrics to identify coaching opportunities.', status: 'Not Started' },
        { title: 'Root Cause Analysis AI', description: 'Analyze groups of tickets to automatically identify the underlying root cause of recurring issues.', status: 'Not Started' },
      ]
    },
    {
      title: 'Phase 3: Expanding the Ecosystem (Integrations & Channels)',
      description: 'This phase is about connecting the help desk to the outside world with new channels, integrations, and a richer context.',
      icon: 'trendingup',
      iconClass: 'text-indigo-500',
      features: [
        { title: 'Computer Telephony Integration (CTI)', description: 'Integrate phone systems for screen-pops on inbound calls and click-to-call functionality.', status: 'Not Started' },
        { title: 'Voice-to-Text Transcription', description: 'Automatically transcribe and summarize voice calls and voicemails attached to tickets.', status: 'Not Started' },
        { title: 'Social Media Integration', description: 'Convert DMs and mentions from platforms like Twitter and Facebook into manageable tickets.', status: 'Not Started' },
        { title: 'In-Product Support SDK', description: 'Capture rich context like console logs and network traces directly from your product for faster bug resolution.', status: 'Not Started' },
        { title: 'Multi-Modal Input with AI Vision', description: 'Allow customers to upload screenshots that AI can analyze and transcribe.', status: 'Not Started' },
        { title: 'AI-Powered Multi-Language Translation', description: 'Provide real-time, two-way translation for ticket messages and live chat.', status: 'Not Started' },
        { title: 'Billing & Invoicing Integration', description: 'View customer subscription and payment history from services like Stripe directly in the ticket view.', status: 'Not Started' },
        { title: 'App Marketplace & Integrations Hub', description: 'A central place to discover, install, and manage third-party integrations like Jira and Salesforce.', status: 'Not Started' },
      ]
    },
    {
        title: 'Phase 4: Advanced Service Management (ITSM & Workflows)',
        description: 'Adding deep, specialized functionality for IT support and other complex, process-driven use cases.',
        icon: 'sliders',
        iconClass: 'text-purple-500',
        features: [
            { title: 'Low-Code Automation Flow Builder', description: 'A visual, drag-and-drop builder for creating powerful, multi-step automation workflows.', status: 'Not Started' },
            { title: 'Workflow Visualizer', description: 'A graphical tool to map out how different automations, macros, and flows interact.', status: 'Not Started' },
            { title: 'ITSM Suite (Incident, Problem, Change)', description: 'Handle recurring issues by linking tickets to incidents, tracking problems, and managing changes with approvals.', status: 'Not Started' },
            { title: 'Asset Management (ITSM)', description: 'Allow IT teams to track hardware, software licenses, and other assets assigned to employees.', status: 'Not Started' },
            { title: 'Contract & Entitlement Management', description: 'Manage customer support plans (e.g., Gold, Silver) and track their specific entitlements.', status: 'Not Started' },
            { title: 'Field Service Management', description: 'A dedicated module for companies with technicians who perform on-site work, including scheduling and mobile access.', status: 'Not Started' },
        ]
    },
    {
        title: 'Phase 5: Proactive & Community Support (The Future)',
        description: 'The final phase focuses on next-generation features that shift support from being reactive to proactive and community-driven.',
        icon: 'sparkles',
        iconClass: 'text-pink-500',
        features: [
            { title: 'Community Forums', description: 'Enable peer-to-peer support and create a user-generated knowledge base.', status: 'Not Started' },
            { title: 'Public Status Page', description: 'Build customer trust with a public page to communicate incidents and scheduled maintenance.', status: 'Not Started' },
            { title: 'Advanced Surveys (NPS, CES)', description: 'A flexible survey builder to capture Net Promoter Score, Customer Effort Score, and other feedback.', status: 'Not Started' },
            { title: 'Customer Health Scoring', description: 'Proactively identify at-risk customers with a health score based on their support history and other signals.', status: 'Not Started' },
            { title: 'Proactive Support Triggers', description: 'Offer help automatically based on user behavior (e.g., rage-clicking in your app).', status: 'Not Started' },
            { title: 'Customer Journey Mapping', description: 'Visualize every customer touchpoint in a chronological timeline for the ultimate context.', status: 'Not Started' },
        ]
    }
  ];

  kanbanRoadmapPhases: RoadmapPhase[] = [
    {
      title: 'Phase 1: Core Kanban Foundation',
      description: 'Building the fundamental features of a robust Kanban board, focusing on core user interactions and management.',
      icon: 'inbox',
      iconClass: 'text-blue-500',
      features: [
          { title: 'Board, List, & Card Management', description: 'Full CRUD operations for boards, lists, and cards with drag-and-drop reordering.', status: 'Not Started'},
          { title: 'Card Details & Properties', description: 'Support for descriptions (Markdown), due dates, priorities, assignees, and labels.', status: 'Not Started'},
          { title: 'Attachments & File Management', description: 'Upload, preview, and manage files on cards, with image cover support.', status: 'Not Started'},
          { title: 'Checklists & Sub-tasks', description: 'Create multiple checklists on cards to track granular tasks and progress.', status: 'Not Started'},
          { title: 'Label Management', description: 'Workspace and board-scoped colored labels for categorization and filtering.', status: 'Not Started'},
          { title: 'Basic Filtering & Search', description: 'Filter cards by label, assignee, and due date. Implement a global command palette search.', status: 'Not Started'},
      ]
    },
    {
      title: 'Phase 2: User & Workspace Management',
      description: 'Establishing a secure, multi-user environment with proper access controls and workspace organization.',
      icon: 'users',
      iconClass: 'text-green-500',
      features: [
          { title: 'Authentication & User Management', description: 'Secure login/register flows with session management and user profile pages.', status: 'Not Started'},
          { title: 'Workspace Management', description: 'Full CRUD for workspaces with robust Role-Based Access Control (Owner, Admin, Member, Viewer).', status: 'Not Started'},
          { title: 'Board Visibility & Permissions', description: 'Set boards as private, workspace-visible, or public, with board-level member management.', status: 'Not Started'},
          { title: 'In-App Notifications', description: 'A notification center for @mentions, assignments, and due date reminders.', status: 'Not Started'},
      ]
    },
     {
      title: 'Phase 3: Advanced Visualization & Data Handling',
      description: 'Moving beyond a simple Kanban board to provide multiple ways to view, manage, and interact with project data.',
      icon: 'barchart3',
      iconClass: 'text-yellow-500',
      features: [
          { title: 'Multiple Board Views', description: 'Implement Calendar, Table, and Gantt Chart views for the same underlying data.', status: 'Not Started'},
          { title: 'Bulk Operations', description: 'Enable multi-select for cards to perform bulk actions like moving, assigning, or labeling.', status: 'Not Started'},
          { title: 'Advanced Filtering & Saved Filters', description: 'Create and save complex filter configurations for one-click access.', status: 'Not Started'},
          { title: 'Custom Fields', description: 'Define workspace-scoped custom fields (text, number, date, dropdown) for cards.', status: 'Not Started'},
          { title: 'Time Tracking', description: 'Log estimated and actual time spent on cards, with reporting capabilities.', status: 'Not Started'},
          { title: 'My Work Dashboard', description: 'A personal dashboard aggregating all cards assigned to a user across all workspaces.', status: 'Not Started'},
      ]
    },
    {
      title: 'Phase 4: Collaboration & Automation',
      description: 'Enhancing teamwork with real-time updates and powerful automation to reduce manual work.',
      icon: 'zap',
      iconClass: 'text-indigo-500',
      features: [
          { title: 'Real-time Collaboration (WebSockets)', description: 'Live updates for card movements, edits, and comments, with presence indicators.', status: 'Not Started'},
          { title: 'Comments & Collaboration', description: 'Threaded, markdown-enabled comments with @mentions for notifying team members.', status: 'Not Started'},
          { title: 'Automation Rules Engine', description: 'A Trigger-Action-Condition system to automate workflows like moving cards or adding labels.', status: 'Not Started'},
          { title: 'Card & Board Templates', description: 'Create reusable templates for common cards and project board structures.', status: 'Not Started'},
          { title: 'Recurring Cards', description: 'Set up cards to be created automatically on a recurring schedule (daily, weekly, monthly).', status: 'Not Started'},
      ]
    },
     {
      title: 'Phase 5: Complex Workflows & Integrations',
      description: 'Supporting advanced project management methodologies and connecting the Kanban board to external systems.',
      icon: 'settings',
      iconClass: 'text-purple-500',
      features: [
          { title: 'Advanced Checklists & Sub-task Linking', description: 'Convert checklist items into new cards and create parent-child relationships.', status: 'Not Started'},
          { title: 'Card Dependencies', description: 'Define "Blocks" and "Blocked By" relationships between cards, with visual indicators.', status: 'Not Started'},
          { title: 'Webhooks', description: 'Send real-time data to external services based on events like card creation or movement.', status: 'Not Started'},
          { title: 'Email Integration (OAuth)', description: 'Connect a personal email to automatically convert matching emails into card comments (AI-powered).', status: 'Not Started'},
          { title: 'Card Merging', description: 'Combine multiple cards into a single target card, consolidating all details and history.', status: 'Not Started'},
      ]
    },
    {
      title: 'Phase 6: Enterprise Polish & Customization',
      description: 'Adding the final layer of features required for large teams, focusing on accessibility, performance, and personalization.',
      icon: 'briefcase',
      iconClass: 'text-pink-500',
      features: [
        { title: 'Customization & Personalization', description: 'User-specific themes (light/dark), layout preferences, and extensive keyboard shortcuts.', status: 'Not Started'},
        { title: 'Accessibility (WCAG AA)', description: 'Ensure the application is fully usable via keyboard and screen readers.', status: 'Not Started'},
        { title: 'Performance Optimizations', description: 'Implement lazy loading, virtual scrolling, and intelligent caching for a snappy experience.', status: 'Not Started'},
        { title: 'In-App Help & Documentation', description: 'A searchable, in-app guide to help users discover and learn all features.', status: 'Not Started'},
      ]
    }
  ];

  getStatusClass(status: string): string {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'Not Started':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
    }
  }
}
