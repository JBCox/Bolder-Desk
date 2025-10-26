import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

interface Feature {
  title: string;
  description: string;
  status: 'Done' | 'In Progress' | 'Not Started';
}

interface Phase {
  name: string;
  description: string;
  icon: string;
  features: Feature[];
}

interface Roadmap {
  phases: Phase[];
}

@Component({
  selector: 'app-dev-plan',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
  templateUrl: './dev-plan.component.html'
})
export class DevPlanComponent {
  activeTab = signal<'helpdesk' | 'kanban' | 'synergy'>('helpdesk');

  helpdeskRoadmap: Roadmap = {
    phases: [
      {
        name: 'Completed Features',
        icon: 'check-circle',
        description: 'The powerful foundation we have already built.',
        features: [
          { title: 'Core Ticket Management', description: 'Centralized dashboard, ticket creation, status/priority management, and conversation view.', status: 'Done' },
          { title: 'Advanced Ticket Operations', description: 'Merge, split, link tickets, and perform bulk actions.', status: 'Done' },
          { title: 'AI-Powered Intelligence (Gemini)', description: 'Ticket summarization, reply suggestions, tone changer, sentiment analysis, and RAG-based KB answers.', status: 'Done' },
          { title: 'Omnichannel Support', description: 'Email-to-Ticket, Live Chat, and Slack integration simulations.', status: 'Done' },
          { title: 'Customer 360 & Self-Service', description: 'Customer portal, searchable knowledge base with feedback, and detailed customer/organization views.', status: 'Done' },
          { title: 'Analytics, Reporting & QA', description: 'Real-time dashboard, wallboard mode, agent performance reports, and a full QA module.', status: 'Done' },
          { title: 'Admin & Automation Foundation', description: 'Automation rules engine, SLA management, macros, canned responses, and custom fields.', status: 'Done' },
        ],
      },
      {
        name: 'Phase 1: Solidifying the Foundation (Enterprise Readiness)',
        icon: 'shield',
        description: 'Focus on security, scalability, administration, and reporting to make the platform robust for larger customers.',
        features: [
          { title: 'Dynamic Form Builder', description: 'Visual builder for custom ticket forms with conditional logic and validation.', status: 'In Progress' },
          { title: 'Granular Roles & Permissions', description: 'Create custom permission sets for agents beyond the basic roles.', status: 'Not Started' },
          { title: 'Comprehensive Audit Logs', description: 'A detailed, searchable trail of every action taken within the help desk.', status: 'Not Started' },
          { title: 'SSO & User Provisioning', description: 'Support for OIDC/SAML for single sign-on and SCIM for user/group provisioning.', status: 'Not Started' },
          { title: 'Sandbox Environment', description: 'A safe environment for admins to test new workflows and configurations.', status: 'Not Started' },
          { title: 'Contract & Entitlement Management', description: 'Manage customer support plans (e.g., Gold, Silver) and track their specific entitlements.', status: 'Not Started' },
          { title: 'Advanced Surveys (NPS, CES)', description: 'A flexible survey builder to capture Net Promoter Score, Customer Effort Score, and other feedback.', status: 'Not Started' },
          { title: 'Data Management APIs (GDPR/CCPA)', description: 'APIs for handling data access and deletion requests to meet compliance needs.', status: 'Not Started' },
          { title: 'PII Redaction Pipeline', description: 'Automated redaction of personally identifiable information before data is sent to AI models.', status: 'Not Started' },
          { title: 'Data Residency Options', description: 'Ability to choose the geographic region where data is stored.', status: 'Not Started' },
          { title: 'Scheduled & Exportable Reports', description: 'Automatically email key reports and allow for exporting raw data.', status: 'Not Started' },
          { title: 'Custom Dashboards & Reporting Builder', description: 'A drag-and-drop interface for admins to create and share their own custom reports and dashboards.', status: 'Not Started' },
          { title: 'Data Lifecycle Management Policies', description: 'Rules for automatically managing data retention (archiving, anonymizing) for compliance.', status: 'Not Started' },
          { title: 'Merge/Acquisition Data Tools', description: 'A toolkit for admins to merge two separate instances of the platform after an acquisition.', status: 'Not Started' },
        ],
      },
      {
        name: 'Phase 2: Supercharging the Agent (Productivity & AI)',
        icon: 'rocket',
        description: 'Making the agent\'s experience second to none with advanced productivity tools and next-generation AI.',
        features: [
          { title: 'Command Palette (CMD+K)', description: 'A searchable command bar to navigate and perform actions from the keyboard.', status: 'Not Started' },
          { title: 'Skills-Based Routing + Schedules (Workforce)', description: 'Route tickets based on agent skills, proficiency, availability, and working hours.', status: 'Not Started' },
          { title: 'Customizable Agent Statuses', description: 'Allow agents to set custom presence statuses (e.g., "In a Meeting").', status: 'Not Started' },
          { title: 'Real-time Collaboration Suite', description: 'Live typing indicators and one-click "Ticket Huddles" for audio calls.', status: 'Not Started' },
          { title: 'Advanced Scheduling & Calendaring', description: 'A full calendar view for agents to manage their availability, tasks, and OOO.', status: 'Not Started' },
          { title: 'Ticket Templates', description: 'Create tickets from predefined templates for common, repeatable issues.', status: 'Not Started' },
          { title: 'Internal Knowledge Base', description: 'A private, agent-only knowledge base for internal procedures and documentation.', status: 'Not Started' },
          { title: 'AI-Powered "Next Best Action"', description: 'Proactively suggest actions like merging tickets or applying macros.', status: 'Not Started' },
          { title: 'AI-Powered Auto-QA', description: 'Automatically score a percentage of tickets against a rubric to scale the QA process.', status: 'Not Started' },
          { title: 'AI-Powered Predictive CSAT', description: 'Use AI to flag tickets at risk of receiving a poor CSAT rating before they are resolved.', status: 'Not Started' },
          { title: 'AI Agent Coach', description: 'Provide real-time, private feedback on agent replies before they are sent.', status: 'Not Started' },
          { title: 'Multi-Modal Input with AI Vision', description: 'Allow users to paste images; use AI to transcribe text or identify issues.', status: 'Not Started' },
          { title: 'Voice-to-Text Transcription & Summarization', description: 'Allow users to leave voice notes that are automatically transcribed and summarized.', status: 'Not Started' },
          { title: 'Gamification & Achievements', description: 'Boost agent motivation with badges, points, and leaderboards.', status: 'Not Started' },
          { title: 'Agent Scripting & Guided Workflows', description: 'Provide agents with step-by-step guides for handling complex issues.', status: 'Not Started' },
          { title: '"Support Load Forecaster" AI', description: 'Predicts future ticket volume based on historical data and upcoming product releases.', status: 'Not Started' },
          { title: 'AI-Powered Burnout Detection', description: 'Privately alerts managers to agents showing signs of burnout based on performance and sentiment trends.', status: 'Not Started' },
          { title: 'Real-time Language Proficiency Routing', description: 'Intelligently route tickets to agents based on their language skills before falling back to AI translation.', status: 'Not Started' },
          { title: 'Agent "Focus Mode"', description: 'A distraction-free UI mode that presents agents with one ticket at a time.', status: 'Not Started' },
        ],
      },
      {
        name: 'Phase 3: Expanding the Ecosystem (Integrations & Channels)',
        icon: 'layers',
        description: 'Connecting the help desk to the outside world with new channels and integrations.',
        features: [
          { title: 'Platform: Event Bus + Webhooks + GraphQL API', description: 'A robust API foundation for building integrations and a future marketplace.', status: 'Not Started' },
          { title: 'Social Media Integration', description: 'Manage customer interactions from channels like Twitter and Facebook.', status: 'Not Started' },
          { title: 'Computer Telephony Integration (CTI)', description: 'Integrate phone systems for screen-pops, click-to-call, and call logging.', status: 'Not Started' },
          { title: 'Billing & Invoicing Integration', description: 'View customer subscription and payment history directly within the ticket view.', status: 'Not Started' },
          { title: 'Multi-Brand Support', description: 'Manage support for multiple brands from a single account, each with its own portal and KB.', status: 'Not Started' },
          { title: 'App Marketplace & Integrations Hub', description: 'A central place to manage integrations with tools like Jira, Salesforce, etc.', status: 'Not Started' },
          { title: 'In-Product Support SDK', description: 'A lightweight JS widget to capture context (console logs, screenshots) for bug reports.', status: 'Not Started' },
          { title: 'Native Mobile Apps (iOS/Android)', description: 'Provide agents with a powerful, on-the-go experience.', status: 'Not Started' },
        ],
      },
      {
        name: 'Phase 4: Advanced Service Management (ITSM & Workflows)',
        icon: 'server',
        description: 'Adding deep, specialized functionality for IT support and other complex, process-driven use cases.',
        features: [
          { title: 'Incident / Problem / Change Management (ITSM-lite)', description: 'Link tickets to incidents, manage problems with known workarounds, and handle change requests.', status: 'Not Started' },
          { title: 'Public Status Page', description: 'A page to communicate incidents, scheduled maintenance, and component status.', status: 'Not Started' },
          { title: 'Asset Management (ITSM)', description: 'Track hardware and software assigned to users, linking assets to tickets.', status: 'Not Started' },
          { title: 'Formal Change Management Workflows', description: 'Handle ITSM change requests with multi-step approval processes.', status: 'Not Started' },
          { title: 'Field Service Management', description: 'A dedicated module for companies with technicians who perform on-site work.', status: 'Not Started' },
          { title: 'Flow Builder (Low-code Automations)', description: 'A visual builder for non-devs to create powerful, multi-step workflows.', status: 'Not Started' },
          { title: 'Workflow Visualizer', description: 'A graphical tool to map out how automations interact.', status: 'Not Started' },
        ],
      },
      {
        name: 'Phase 5: Proactive & Community Support (The Future)',
        icon: 'target',
        description: 'Shifting support from being reactive to proactive and community-driven.',
        features: [
          { title: 'Community Forums', description: 'Enable peer-to-peer support, allowing agents to moderate and convert posts to tickets.', status: 'Not Started' },
          { title: 'Multi-Language Support with AI Translation', description: 'Real-time, two-way translation of tickets and chat messages.', status: 'Not Started' },
          { title: 'Conversational AI Agent (Tier 1 Bot)', description: 'A chatbot that can resolve common issues and escalate to a human agent.', status: 'Not Started' },
          { title: 'Customer Health Scoring', description: 'Proactively identify at-risk customers based on their support history and sentiment.', status: 'Not Started' },
          { title: 'Embeddable "Support Hub" Widget', description: 'A single widget for chat, KB search, and ticket submission within a customer\'s app.', status: 'Not Started' },
          { title: 'Proactive Support Triggers', description: 'Offer help automatically based on user behavior (e.g., rage-clicking).', status: 'Not Started' },
          { title: 'Customer Journey Mapping', description: 'Visualize every customer touchpoint (support tickets, website visits, purchases, etc.).', status: 'Not Started' },
        ],
      },
      {
        name: 'Phase 6: Platform Intelligence & Extensibility',
        icon: 'brain-circuit',
        description: 'Evolving from a help desk tool to an intelligent work platform with deep insights and customization.',
        features: [
          { title: 'AI-Powered Root Cause Analysis Engine', description: 'Analyze ticket data to identify the underlying causes of recurring issues.', status: 'Not Started' },
          { title: 'Unified Cross-Functional Reporting & BI', description: 'Create custom reports correlating help desk metrics with Kanban project data.', status: 'Not Started' },
          { title: 'Customer Journey & Proactive Engagement Engine', description: 'Map customer interactions to trigger proactive support actions based on behavior.', status: 'Not Started' },
          { title: 'Platform Development Kit (PDK) & Custom Objects', description: 'A toolkit for enterprise customers to build their own custom apps and UI widgets.', status: 'Not Started' },
          { title: 'Advanced Data Governance & Compliance', description: 'Features like eDiscovery, data loss prevention (DLP), and legal holds.', status: 'Not Started' },
          { title: 'AI-Powered "Agent Coach"', description: 'Provide real-time, private feedback on agent replies before they are sent.', status: 'Not Started' },
          { title: 'AI-Generated Report Narratives', description: 'Uses AI to write a natural-language summary of analytics dashboards and reports.', status: 'Not Started' },
          { title: 'Community App Marketplace', description: 'Allow third-party developers and customers to build and share their own integrations.', status: 'Not Started' },
        ],
      },
    ],
  };

  kanbanRoadmap: Roadmap = {
    phases: [
      {
        name: 'Phase 1: Core Functionality & Collaboration',
        icon: 'package',
        description: 'Establishing the fundamental features of a flexible and powerful Kanban system.',
        features: [
          { title: 'Workspace & Board Management', description: 'Full CRUD for Workspaces and Boards, including archiving/restoring, duplication, customization (colors, images), favorite/starred boards, icons, and descriptions.', status: 'Not Started' },
          { title: 'Workspace & Board RBAC', description: 'Owner, Admin, Member, and Viewer roles at both the Workspace and Board level, with member management and online presence indicators.', status: 'Not Started' },
          { title: 'Board Visibility Controls', description: 'Support for Private, Workspace-wide, and Public (read-only) boards.', status: 'Not Started' },
          { title: 'List & Card Management', description: 'Full CRUD for lists and cards with inline renaming, drag-and-drop, custom list colors, archiving/restoring, and descriptions.', status: 'Not Started' },
          { title: 'Real-time Collaboration (WebSockets)', description: 'Live updates for all users on a board, with typing indicators and conflict resolution.', status: 'Not Started' },
          { title: 'Comments, @mentions, & Attachments', description: 'Threaded, markdown-enabled comments on cards with user notifications and full file attachment support with previews.', status: 'Not Started' },
          { title: 'Labels Management', description: 'Create and apply color-coded labels to cards, with a label legend and quick-add search.', status: 'Not Started' },
        ],
      },
      {
        name: 'Phase 2: Advanced Card & Board Features',
        icon: 'sliders',
        description: 'Adding depth to cards and providing powerful tools for managing work.',
        features: [
          { title: 'Rich Card Details', description: 'Support for markdown descriptions, due dates, start dates, priority levels, multiple assignees, and custom fields.', status: 'Not Started' },
          { title: 'Advanced Checklists & Sub-tasks', description: 'Create multiple checklists per card, convert items to new linked cards (sub-tasks), link items to other cards, and toggle visibility of completed items.', status: 'Not Started' },
          { title: 'Card Dependencies & Dependencies Dashboard', description: 'Define "blocks" and "related to" dependencies with visual indicators, warnings, circular dependency detection, and a global interactive graph.', status: 'Not Started' },
          { title: 'Card Visual Customization & Indicators', description: 'Set cover images/colors for cards, show checklist completion percentages, and display visual age indicators for due dates (overdue, due soon).', status: 'Not Started' },
          { title: 'Card Activity Log', description: 'A complete, timestamped audit trail of all changes made to a card, showing who did what and when.', status: 'Not Started' },
          { title: 'Bulk Operations', description: 'Multi-select cards via checkboxes or Shift+click to perform actions (move, assign, label, etc.) on them at once.', status: 'Not Started' },
          { title: 'Card Merging', description: 'Combine multiple cards into one, merging all properties. Source cards are archived but do not auto-complete linked checklist items.', status: 'Not Started' },
          { title: 'List Limits (WIP)', description: 'Set Work-in-Progress limits on lists to visually warn when capacity is exceeded.', status: 'Not Started' },
        ],
      },
      {
        name: 'Phase 3: Multiple Views & Powerful Search',
        icon: 'layers',
        description: 'Offering multiple ways to visualize data and find information quickly.',
        features: [
          { title: 'Multiple Board Views: Calendar', description: 'View cards on a calendar by due date, with drag-and-drop rescheduling.', status: 'Not Started' },
          { title: 'Multiple Board Views: Table', description: 'A spreadsheet-like grid with sortable columns, inline editing, and multi-select.', status: 'Not Started' },
          { title: 'Multiple Board Views: Gantt Chart', description: 'A timeline view with dependency arrows, progress bars, and critical path highlighting.', status: 'Not Started' },
          { title: 'Global Search & Command Palette (Cmd+K)', description: 'A keyboard-driven command palette to search for cards, boards, and actions across all workspaces.', status: 'Not Started' },
          { title: 'Advanced Filtering & Saved Filters', description: 'Filter cards by any property and allow users to save, pin, and share complex filter configurations.', status: 'Not Started' },
          { title: 'My Work Personal Dashboard', description: 'A personalized view showing all cards assigned to a user across all boards and workspaces, grouped by due date or priority.', status: 'Not Started' },
        ],
      },
      {
        name: 'Phase 4: Automation & Integrations',
        icon: 'zap',
        description: 'Automating repetitive tasks and connecting the Kanban board to external systems.',
        features: [
          { title: 'Automation Rules Engine', description: 'A trigger-condition-action system to automate workflows on the board (e.g., move card when label is added).', status: 'Not Started' },
          { title: 'Card & Board Templates', description: 'Create templates for frequently used cards (including checklists, labels, assignees) and pre-configured board structures.', status: 'Not Started' },
          { title: 'Recurring Cards', description: 'Set up cards to be created automatically on a recurring schedule (daily, weekly, monthly, or cron).', status: 'Not Started' },
          { title: 'Time Tracking & Reporting', description: 'Log estimated and actual time spent on cards, use a start/stop timer, and generate exportable time reports.', status: 'Not Started' },
          { title: 'Advanced Email Integration (OAuth)', description: 'Connect email to auto-comment on cards, with AI-powered matching, data extraction, email thread tracking, audit logs, and E2E encryption for privacy.', status: 'Not Started' },
          { title: 'Webhooks', description: 'Send data to external services with HMAC signature verification and automatic retry logic.', status: 'Not Started' },
        ],
      },
       {
        name: 'Phase 5: Enterprise & Project Management',
        icon: 'server',
        description: 'Adding features for complex project management, security, and user comfort.',
        features: [
          { title: 'Authentication & User Management', description: 'Full login/register flows with session management, password hashing, CSRF protection, and user profiles with preferences.', status: 'Not Started' },
          { title: 'Notifications (In-App & Email)', description: 'A notification center with actions (mark as read) and optional real-time or digest emails.', status: 'Not Started' },
          { title: 'Customization & Personalization', description: 'User-selectable light/dark themes, custom board/list/card colors, layout preferences, and a full suite of configurable keyboard shortcuts.', status: 'Not Started' },
          { title: 'Accessibility (WCAG AA)', description: 'Ensure the application is fully keyboard navigable, screen-reader friendly, and meets contrast standards.', status: 'Not Started' },
          { title: 'Performance Optimizations', description: 'Implement optimistic updates, virtual scrolling for long lists, intelligent caching, and lazy loading for a fast experience.', status: 'Not Started' },
          { title: 'In-App Documentation', description: 'A comprehensive, searchable help system explaining how to use all Kanban features, with step-by-step visual guides.', status: 'Not Started' },
        ],
      },
    ],
  };

  synergyRoadmap: Roadmap = {
    phases: [
      {
        name: 'Phase 1: Bridging the Gap',
        icon: 'link',
        description: 'Creating the core connections between the help desk and the Kanban board.',
        features: [
          { title: 'Promote Ticket to Task', description: 'One-click creation of a Kanban card from a help desk ticket, with pre-filled data and a link back.', status: 'Not Started' },
          { title: 'Two-Way Status Sync & Collaboration', description: 'Show Kanban card status in the ticket view and allow for synced comments between systems.', status: 'Not Started' },
          { title: 'Support-Driven Product Roadmaps', description: 'Link multiple tickets to a single feature request card on a Kanban board to quantify demand.', status: 'Not Started' },
          { title: 'Ticket Triage Kanban Boards', description: 'Use a Kanban board to visually manage the flow of support tickets from "New" to "Resolved".', status: 'Not Started' },
          { title: 'Automated Customer Updates', description: 'Trigger public replies on a ticket when a linked Kanban card reaches a certain milestone (e.g., "Done").', status: 'Not Started' },
        ],
      },
      {
        name: 'Phase 2: Unified Work Management',
        icon: 'users',
        description: 'Managing resources and work holistically across both support and project management.',
        features: [
           { title: 'Unified Resource Management', description: 'A master dashboard showing team capacity based on agent schedules and Kanban task estimates.', status: 'Not Started' },
           { title: 'Personalized Customer Onboarding Checklists', description: 'Automatically create a shared Kanban board with onboarding tasks for new customers.', status: 'Not Started' },
        ]
      },
      {
        name: 'Phase 3: Deep Integration & Business Intelligence',
        icon: 'pie-chart',
        description: 'Leveraging the combined dataset to produce insights that are impossible with separate systems.',
        features: [
          { title: '"Voice of the Customer" Dashboard', description: 'An analytics view that aggregates support data for a specific Kanban epic or feature.', status: 'Not Started' },
          { title: 'AI-Powered "Impact Score" for Prioritization', description: 'An AI model that scores Kanban cards based on the urgency and value of linked tickets.', status: 'Not Started' },
          { title: 'Proactive Customer Updates on Project Milestones', description: 'Allow CSMs to subscribe key customers to Kanban epics for proactive milestone updates.', status: 'Not Started' },
          { title: 'Cross-Functional SLA Management', description: 'Track how long an issue spends with internal teams after being escalated from support.', status: 'Not Started' },
          { title: 'Unified Time-Tracking & Billable Hours', description: 'A single report showing all time logged against a customer\'s tickets and linked Kanban cards.', status: 'Not Started' },
        ],
      },
      {
        name: 'Phase 4: Advanced Intelligence & Automation',
        icon: 'brain-circuit',
        description: 'Creating strategic business value by correlating data and proactively aligning cross-functional teams.',
        features: [
          { title: '"Quality & Churn" Correlation Engine', description: 'AI-powered analytics to find correlations between engineering quality (bugs) and customer business outcomes (satisfaction, churn).', status: 'Not Started' },
          { title: 'Proactive Support Playbooks for Product Launches', description: 'Automatically trigger a "Support Readiness" workflow and checklist when a new feature launch is planned on a Kanban board.', status: 'Not Started' },
          { title: 'Agent-Driven Bug Prioritization ("Impact Voting")', description: 'Allow agents to "vote" on existing bug cards with new customer tickets, adding weight based on customer tier (VIP).', status: 'Not Started' },
          { title: '"Cost of Poor Quality" Reporting', description: 'Generate financial reports by combining time-tracking data from support tickets and bug-fix cards.', status: 'Not Started' },
          { title: 'Automated Release Notes from Kanban', description: 'Use AI to scan completed Kanban cards in an Epic and generate customer-facing release notes.', status: 'Not Started' },
        ],
      },
    ],
  };

  getStatusClass(status: 'Done' | 'In Progress' | 'Not Started'): string {
    switch (status) {
      case 'Done':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-yellow-500';
      case 'Not Started':
        return 'bg-gray-400';
    }
  }
}
