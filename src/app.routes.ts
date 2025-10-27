import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'my-inbox', pathMatch: 'full' },
  { 
    path: 'my-inbox', 
    loadComponent: () => import('./components/my-inbox/my-inbox.component').then(m => m.MyInboxComponent) 
  },
  { 
    path: 'tickets', 
    loadComponent: () => import('./components/tickets/tickets.component').then(m => m.TicketsComponent) 
  },
  { 
    path: 'tickets/:id', 
    loadComponent: () => import('./components/tickets/tickets.component').then(m => m.TicketsComponent) 
  },
  { 
    path: 'analytics', 
    loadComponent: () => import('./components/analytics-dashboard/analytics-dashboard.component').then(m => m.AnalyticsDashboardComponent) 
  },
  { 
    path: 'kb', 
    loadComponent: () => import('./components/knowledge-base/knowledge-base.component').then(m => m.KnowledgeBaseComponent) 
  },
  { 
    path: 'customers', 
    loadComponent: () => import('./components/customers/customers.component').then(m => m.CustomersComponent) 
  },
  { 
    path: 'inbox', 
    loadComponent: () => import('./components/inbox/inbox.component').then(m => m.InboxComponent) 
  },
  { 
    path: 'chat', 
    loadComponent: () => import('./components/chat/chat.component').then(m => m.ChatComponent) 
  },
  { 
    path: 'reports', 
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent) 
  },
  { 
    path: 'slack', 
    loadComponent: () => import('./components/slack-integration/slack-integration.component').then(m => m.SlackIntegrationComponent) 
  },
  { 
    path: 'qa', 
    loadComponent: () => import('./components/quality-assurance/quality-assurance.component').then(m => m.QualityAssuranceComponent) 
  },
  { 
    path: 'wallboard', 
    loadComponent: () => import('./components/wallboard/wallboard.component').then(m => m.WallboardComponent) 
  },
  { 
    path: 'devplan', 
    loadComponent: () => import('./components/dev-plan/dev-plan.component').then(m => m.DevPlanComponent) 
  },
  { 
    path: 'portal', 
    loadComponent: () => import('./components/customer-portal/customer-portal.component').then(m => m.CustomerPortalComponent) 
  },
  { 
    path: 'facebook', 
    loadComponent: () => import('./components/facebook-integration/facebook-integration.component').then(m => m.FacebookIntegrationComponent) 
  },
  { 
    path: 'twitter', 
    loadComponent: () => import('./components/twitter-integration/twitter-integration.component').then(m => m.TwitterIntegrationComponent) 
  },
  { 
    path: 'whatsapp', 
    loadComponent: () => import('./components/whatsapp-integration/whatsapp-integration.component').then(m => m.WhatsAppIntegrationComponent) 
  },
  { 
    path: 'salesforce', 
    loadComponent: () => import('./components/salesforce-integration/salesforce-integration.component').then(m => m.SalesforceIntegrationComponent) 
  },
  { 
    path: 'jira', 
    loadComponent: () => import('./components/jira-integration/jira-integration.component').then(m => m.JiraIntegrationComponent) 
  },
  { 
    path: 'kanban', 
    loadComponent: () => import('./components/kanban/kanban.component').then(m => m.KanbanComponent) 
  },
  { path: '**', redirectTo: 'my-inbox' }
];
