import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { developmentPlanData } from '../../data/dev-plan.data';

interface Feature {
  name: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
  subItems: string[];
}

interface Phase {
  name: string;
  features: Feature[];
}

export interface DevPlanTab {
  id: string;
  name: string;
  icon: string;
  phases: Phase[];
}


@Component({
  selector: 'app-dev-plan',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-5xl">BoldDesk Development Plan</h1>
          <p class="mt-4 text-lg text-slate-600 dark:text-slate-400">Our strategic roadmap for building the future of AI-powered customer service.</p>
        </div>

        <!-- Tabs -->
        <div class="border-b border-slate-200 dark:border-slate-700 mb-8">
          <nav class="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            @for(tab of developmentPlan; track tab.id) {
              <button 
                (click)="activeTabId.set(tab.id)"
                [class]="'flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ' + (activeTabId() === tab.id ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600')">
                <app-icon [name]="tab.icon" class="w-5 h-5"></app-icon>
                {{ tab.name }}
              </button>
            }
          </nav>
        </div>

        <!-- Tab Content -->
        @if(activeTab(); as tab) {
          <div class="animate-fade-in">
            @for(phase of tab.phases; track phase.name) {
              <div class="mb-16">
                <h2 class="text-2xl font-semibold text-slate-700 dark:text-slate-300 border-b-2 border-slate-200 dark:border-slate-700 pb-3 mb-8">{{ phase.name }}</h2>
                <div class="border-l-2 border-slate-200 dark:border-slate-700 ml-4">
                  @for (feature of phase.features; track feature.name) {
                    <div class="mb-12 pl-8 relative">
                      <!-- FIX: Use class binding instead of ngClass -->
                      <div class="absolute -left-[11px] top-1 w-5 h-5 rounded-full ring-4 ring-slate-50 dark:ring-slate-900" [class]="getStatusDotClass(feature.status)"></div>
                      <h3 class="font-semibold text-slate-800 dark:text-slate-200 text-xl">{{ feature.name }}</h3>
                      <p class="text-slate-600 dark:text-slate-400 mt-1">{{ feature.description }}</p>
                      @if (feature.subItems && feature.subItems.length > 0) {
                        <ul class="mt-4 pl-2 space-y-2 text-slate-600 dark:text-slate-400">
                          @for(item of feature.subItems; track item) {
                            <li class="flex items-start gap-3">
                              <app-icon name="check-square" class="w-4 h-4 mt-1 text-emerald-500 flex-shrink-0"></app-icon>
                              <span>{{ item }}</span>
                            </li>
                          }
                        </ul>
                      }
                      <!-- FIX: Use class binding instead of ngClass -->
                      <span class="text-xs font-semibold py-0.5 px-2 rounded-full mt-4 inline-block" [class]="getStatusPillClass(feature.status)">
                        {{ feature.status }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
     <style>
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fade-in 0.5s ease-out forwards;
      }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevPlanComponent {
  activeTabId = signal<string>('core');
  
  developmentPlan: DevPlanTab[] = developmentPlanData;

  activeTab = computed(() => {
    return this.developmentPlan.find(t => t.id === this.activeTabId());
  });

  getStatusDotClass(status: Feature['status']): string {
    switch (status) {
      case 'Completed': return 'bg-emerald-500';
      case 'In Progress': return 'bg-blue-500 animate-pulse';
      case 'Not Started': return 'bg-slate-300 dark:bg-slate-600';
    }
  }

  getStatusPillClass(status: Feature['status']): string {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Not Started': return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  }
}
