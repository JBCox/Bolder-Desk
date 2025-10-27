import { DevPlanTab } from '../components/dev-plan/dev-plan.component';

export const developmentPlanData: DevPlanTab[] = [
  {
    id: 'core',
    name: 'Core Help Desk',
    icon: 'mail',
    phases: [
      {
        name: 'Phase 1: Foundation (Q1-Q2 2024)',
        features: [
          { name: 'Ticket Management', description: 'Centralized system for tracking, managing, and resolving customer inquiries.', status: 'Completed', subItems: ['Email to Ticket', 'Ticket Statuses & Priorities', 'Custom Fields', 'Internal Notes'] },
          { name: 'Contact & Organization Management', description: 'A unified view of every customer and their history.', status: 'Completed', subItems: ['Contact Profiles', 'Organization Grouping', 'Interaction History'] },
          { name: 'Basic Reporting', description: 'Initial set of dashboards to track key support metrics.', status: 'In Progress', subItems: ['Ticket Volume Report', 'Agent Performance Overview'] },
        ],
      },
      {
        name: 'Phase 2: Efficiency (Q3 2024)',
        features: [
          { name: 'Knowledge Base', description: 'A self-service portal for customers to find answers on their own.', status: 'In Progress', subItems: ['Article Editor', 'Categorization', 'Customer-facing Portal'] },
          { name: 'Automation Rules', description: 'Automate repetitive tasks and workflows.', status: 'Not Started', subItems: [] },
          { name: 'Service Level Agreements (SLAs)', description: 'Set and track response and resolution time targets.', status: 'Not Started', subItems: [] },
        ],
      },
    ],
  },
  {
    id: 'ai',
    name: 'AI & Generative Features',
    icon: 'sparkles',
    phases: [
      {
        name: 'Phase 1: Agent Assistance (Q3 2024)',
        features: [
          { name: 'AI Ticket Summary', description: 'Instantly get the gist of long ticket conversations.', status: 'Completed', subItems: [] },
          { name: 'AI Reply Suggestions', description: 'Generate context-aware reply suggestions for agents.', status: 'In Progress', subItems: [] },
          { name: 'Sentiment Analysis', description: 'Automatically detect customer sentiment in messages.', status: 'In Progress', subItems: [] },
        ],
      },
      {
        name: 'Phase 2: Proactive Support (Q4 2024)',
        features: [
          { name: 'AI Analytics & Anomaly Detection', description: 'Identify trends and unusual spikes in ticket volume automatically.', status: 'Not Started', subItems: [] },
          { name: 'Predictive CSAT', description: 'Forecast customer satisfaction to identify at-risk customers.', status: 'Not Started', subItems: [] },
          { name: 'AI-Powered KB Search', description: 'Use generative search to provide direct answers from the knowledge base.', status: 'Not Started', subItems: [] },
        ],
      },
    ],
  },
  {
    id: 'channels',
    name: 'Omnichannel Support',
    icon: 'message-square',
    phases: [
      {
        name: 'Phase 1: Core Channels (Q3 2024)',
        features: [
          { name: 'Live Chat', description: 'Engage with customers in real-time on your website.', status: 'In Progress', subItems: ['Agent Chat Console', 'Customer-facing Widget'] },
          { name: 'Social Media Integration (Twitter/Facebook)', description: 'Manage support requests from social media in one place.', status: 'Not Started', subItems: [] },
        ],
      },
      {
        name: 'Phase 2: Expanded Channels (Q1 2025)',
        features: [
          { name: 'WhatsApp Integration', description: 'Provide support through the world\'s most popular messaging app.', status: 'Not Started', subItems: [] },
          { name: 'Telephony Integration (VoIP)', description: 'Handle calls and voicemails directly within BoldDesk.', status: 'Not Started', subItems: [] },
        ],
      },
    ],
  },
];
