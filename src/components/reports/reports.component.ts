import { Component, ChangeDetectionStrategy, input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket, Agent } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { GeminiService } from '../../gemini.service';

interface AgentReport {
    agentName: string;
    resolvedCount: number;
    avgResolutionTime: string; // in hours
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
})
export class ReportsComponent {
  tickets = input.required<Ticket[]>();
  agents = input.required<Agent[]>();

  private geminiService = inject(GeminiService);

  dateFrom = signal('');
  dateTo = signal('');
  
  aiSummary = signal<string>('');
  isGeneratingSummary = signal(false);

  reportData = computed<AgentReport[]>(() => {
    // Reset AI summary when data changes
    this.aiSummary.set('');

    const from = this.dateFrom() ? new Date(this.dateFrom()).getTime() : 0;
    // Set to end of day
    const to = this.dateTo() ? new Date(this.dateTo()).setHours(23, 59, 59, 999) : Infinity;

    const filteredTickets = this.tickets().filter(t => {
        if (t.status !== 'resolved' || !t.resolvedAt) return false;
        const resolvedTime = new Date(t.resolvedAt).getTime();
        return resolvedTime >= from && resolvedTime <= to;
    });

    return this.agents().map(agent => {
        const agentTickets = filteredTickets.filter(t => t.assignedTo === agent.name);
        const resolvedCount = agentTickets.length;
        
        let avgResolutionTime = 'N/A';
        if (resolvedCount > 0) {
            const totalResolutionSeconds = agentTickets.reduce((acc, t) => {
                const created = new Date(t.created).getTime();
                const resolved = new Date(t.resolvedAt!).getTime();
                return acc + (resolved - created) / 1000;
            }, 0);
            const avgSeconds = totalResolutionSeconds / resolvedCount;
            const avgHours = (avgSeconds / 3600).toFixed(1);
            avgResolutionTime = `${avgHours} hrs`;
        }

        return {
            agentName: agent.name,
            resolvedCount,
            avgResolutionTime
        };
    }).sort((a, b) => b.resolvedCount - a.resolvedCount);
  });

  async handleGenerateSummary() {
    if (this.reportData().length === 0) {
        return;
    }
    this.isGeneratingSummary.set(true);
    this.aiSummary.set('');
    try {
        const summary = await this.geminiService.summarizeReportData(this.reportData());
        this.aiSummary.set(summary);
    } catch (e) {
        this.aiSummary.set('An error occurred while generating the summary.');
        console.error(e);
    } finally {
        this.isGeneratingSummary.set(false);
    }
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  applyDatePreset(preset: 'thisweek' | 'thismonth' | 'lastmonth') {
      const today = new Date();
      let fromDate: Date;
      let toDate: Date = new Date(today);

      switch(preset) {
          case 'thisweek':
              fromDate = new Date(today);
              fromDate.setDate(today.getDate() - today.getDay());
              break;
          case 'thismonth':
              fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
              break;
          case 'lastmonth':
              fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
              toDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month
              break;
      }
      
      this.dateFrom.set(this.formatDateForInput(fromDate));
      this.dateTo.set(this.formatDateForInput(toDate));
  }
}