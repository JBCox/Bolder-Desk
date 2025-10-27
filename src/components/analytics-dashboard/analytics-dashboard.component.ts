// Fix: Replaced invalid file content with a complete and valid Angular component.
import { Component, ChangeDetectionStrategy, input, output, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsData, Ticket, Anomaly, ProblemSuggestion } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { GeminiService } from '../../gemini.service';

type AiFeature = 'anomalies' | 'deflection' | 'problems';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class AnalyticsDashboardComponent {
  data = input.required<AnalyticsData>();
  tickets = input.required<Ticket[]>();
  createProblemTicket = output<ProblemSuggestion>();
  private geminiService = inject(GeminiService);

  anomalies = signal<Anomaly[]>([]);
  deflectionOpportunities = signal<string[]>([]);
  problemSuggestions = signal<ProblemSuggestion[]>([]);
  isLoading = signal<Set<AiFeature>>(new Set());
  aiError = signal<string | null>(null);

  constructor() {
    effect(async () => {
      const currentTickets = this.tickets();
      if (currentTickets.length > 0) {
        this.runAiAnalytics(currentTickets);
      }
    }, { allowSignalWrites: true });
  }

  async runAiAnalytics(tickets: Ticket[]) {
    this.isLoading.set(new Set(['anomalies', 'deflection', 'problems']));
    this.aiError.set(null);
    try {
        const insights = await this.geminiService.getAiAnalyticsInsights(tickets);
        this.anomalies.set(insights.anomalies || []);
        this.deflectionOpportunities.set(insights.deflectionOpportunities || []);
        this.problemSuggestions.set(insights.problemSuggestions || []);
    } catch (error) {
      console.error("Error running AI analytics:", error);
      this.aiError.set(error instanceof Error ? error.message : 'An unknown error occurred.');
      this.anomalies.set([]);
      this.deflectionOpportunities.set([]);
      this.problemSuggestions.set([]);
    } finally {
      this.isLoading.set(new Set());
    }
  }

  objectKeys(obj: object): string[] {
    return Object.keys(obj);
  }

  getTotalDrivers(drivers: { [key: string]: number }): number {
    if (!drivers) return 0;
    return Object.values(drivers).reduce((sum, count) => sum + count, 0);
  }

  formatIncidentIds(ids: number[]): string {
    return ids.map(id => `#${id}`).join(', ');
  }
}