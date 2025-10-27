import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-dev-plan',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-5xl">BoldDesk Development Plan</h1>
          <p class="mt-4 text-lg text-slate-600 dark:text-slate-400">An overview of our journey and what's next for our AI-powered customer service platform.</p>
        </div>

        <div class="space-y-16">
          
          <!-- Completed Features -->
          <div>
            <h2 class="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
              <app-icon name="check-circle" class="w-8 h-8 mr-3 text-emerald-500"></app-icon>
              Completed Features (Q3)
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 text-lg">Core Ticketing System</h3>
                <p class="text-slate-600 dark:text-slate-400 mt-2 text-sm">Multi-channel ticket creation, status management, assignments, and internal notes.</p>
              </div>
              <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 text-lg">AI-Powered Ticket Summarization</h3>
                <p class="text-slate-600 dark:text-slate-400 mt-2 text-sm">Gemini-powered summaries to quickly understand long ticket conversations.</p>
              </div>
              <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 text-lg">Knowledge Base & Customer Portal</h3>
                <p class="text-slate-600 dark:text-slate-400 mt-2 text-sm">Self-service portal for customers with AI-powered search and feedback mechanisms.</p>
              </div>
              <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 text-lg">Analytics Dashboard</h3>
                <p class="text-slate-600 dark:text-slate-400 mt-2 text-sm">AI insights for anomaly detection, deflection opportunities, and problem identification.</p>
              </div>
            </div>
          </div>

          <!-- In Progress -->
          <div>
            <h2 class="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
              <app-icon name="loader" class="w-8 h-8 mr-3 text-blue-500"></app-icon>
              In Progress (Q4)
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 text-lg">Advanced Workflow Automations</h3>
                <p class="text-slate-600 dark:text-slate-400 mt-2 text-sm">Building a robust rules engine for time-based and event-based triggers to automate repetitive tasks.</p>
              </div>
              <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 text-lg">Kanban Project Views</h3>
                <p class="text-slate-600 dark:text-slate-400 mt-2 text-sm">Visual project management boards to link tickets to development tasks and track progress.</p>
              </div>
              <div class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 class="font-semibold text-slate-800 dark:text-slate-200 text-lg">AI-Powered Agent Assist</h3>
                <p class="text-slate-600 dark:text-slate-400 mt-2 text-sm">Real-time suggestions for agents, including macro insertion, KB article recommendations, and tone analysis.</p>
              </div>
            </div>
          </div>

          <!-- Planned -->
          <div>
            <h2 class="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
              <app-icon name="calendar" class="w-8 h-8 mr-3 text-purple-500"></app-icon>
              Planned (Next Year)
            </h2>
            <ul class="space-y-4">
              <li class="bg-white dark:bg-slate-800/50 p-4 rounded-md flex items-center border border-slate-200 dark:border-slate-700/50">
                <app-icon name="users" class="w-5 h-5 mr-4 text-slate-500"></app-icon>
                <span class="text-slate-700 dark:text-slate-300">Advanced Roles & Permissions System</span>
              </li>
              <li class="bg-white dark:bg-slate-800/50 p-4 rounded-md flex items-center border border-slate-200 dark:border-slate-700/50">
                <app-icon name="pie-chart" class="w-5 h-5 mr-4 text-slate-500"></app-icon>
                <span class="text-slate-700 dark:text-slate-300">Customizable Reporting and Dashboards</span>
              </li>
              <li class="bg-white dark:bg-slate-800/50 p-4 rounded-md flex items-center border border-slate-200 dark:border-slate-700/50">
                <app-icon name="zap" class="w-5 h-5 mr-4 text-slate-500"></app-icon>
                <span class="text-slate-700 dark:text-slate-300">Marketplace for Third-Party Integrations</span>
              </li>
              <li class="bg-white dark:bg-slate-800/50 p-4 rounded-md flex items-center border border-slate-200 dark:border-slate-700/50">
                <app-icon name="message-circle" class="w-5 h-5 mr-4 text-slate-500"></app-icon>
                <span class="text-slate-700 dark:text-slate-300">Proactive Customer Messaging and Campaigns</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevPlanComponent {}
