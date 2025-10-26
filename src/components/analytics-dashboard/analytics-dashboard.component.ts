// Fix: Replaced invalid file content with a complete and valid Angular component.
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsData } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-analytics-dashboard',
  template: `
    <div class="p-6 bg-slate-50 dark:bg-slate-800/50 h-full">
      <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Analytics Dashboard</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <!-- Tickets Created -->
        <div class="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="bg-blue-100 dark:bg-blue-500/20 p-3 rounded-full">
              <app-icon name="plus-circle" class="w-6 h-6 text-blue-600 dark:text-blue-300"></app-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm text-slate-500 dark:text-slate-400">Tickets Created</p>
              <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ data().ticketsCreated }}</p>
            </div>
          </div>
        </div>

        <!-- Tickets Resolved -->
        <div class="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="bg-green-100 dark:bg-green-500/20 p-3 rounded-full">
              <app-icon name="check-circle" class="w-6 h-6 text-green-600 dark:text-green-300"></app-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm text-slate-500 dark:text-slate-400">Tickets Resolved</p>
              <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ data().ticketsResolved }}</p>
            </div>
          </div>
        </div>

        <!-- Avg First Response Time -->
        <div class="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="bg-yellow-100 dark:bg-yellow-500/20 p-3 rounded-full">
              <app-icon name="clock" class="w-6 h-6 text-yellow-600 dark:text-yellow-300"></app-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm text-slate-500 dark:text-slate-400">Avg 1st Response</p>
              <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ data().avgFirstResponseTime }} min</p>
            </div>
          </div>
        </div>
        
        <!-- Avg Resolution Time -->
        <div class="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="bg-purple-100 dark:bg-purple-500/20 p-3 rounded-full">
              <app-icon name="history" class="w-6 h-6 text-purple-600 dark:text-purple-300"></app-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm text-slate-500 dark:text-slate-400">Avg Resolution</p>
              <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ data().avgResolutionTime.toFixed(1) }} hrs</p>
            </div>
          </div>
        </div>

        <!-- Satisfaction Score -->
        <div class="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
          <div class="flex items-center">
            <div class="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full">
              <app-icon name="smile" class="w-6 h-6 text-indigo-600 dark:text-indigo-300"></app-icon>
            </div>
            <div class="ml-4">
              <p class="text-sm text-slate-500 dark:text-slate-400">Satisfaction (CSAT)</p>
              <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{{ data().satisfactionScore.toFixed(1) }}%</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Top Performing Agent</h3>
        <div class="flex items-center">
            <div class="bg-slate-200 dark:bg-slate-700 rounded-full h-12 w-12 flex items-center justify-center">
                <app-icon name="award" class="w-6 h-6 text-slate-600 dark:text-slate-300"></app-icon>
            </div>
            <p class="ml-4 text-xl font-medium text-slate-700 dark:text-slate-200">{{ data().topPerformingAgent }}</p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class AnalyticsDashboardComponent {
  data = input.required<AnalyticsData>();
}
