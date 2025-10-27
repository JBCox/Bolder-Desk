import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket, Agent } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-my-inbox',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './my-inbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyInboxComponent {
  allTickets = input.required<Ticket[]>();
  currentAgent = input.required<Agent>();
  viewTicket = output<number>();

  myAssignedTickets = computed(() => 
    this.allTickets().filter(t => t.assignedTo === this.currentAgent().name && (t.status === 'open' || t.status === 'pending'))
    .sort((a,b) => new Date(b.created).getTime() - new Date(a.created).getTime())
  );
  
  myMentionedTickets = computed(() =>
    this.allTickets().filter(t => 
      (t.status === 'open' || t.status === 'pending') &&
      t.internalNotes.some(note => note.content.includes(`@${this.currentAgent().name}`)) &&
      t.assignedTo !== this.currentAgent().name
    )
    .sort((a,b) => new Date(b.created).getTime() - new Date(a.created).getTime())
  );


  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getPriorityClass(priority: Ticket['priority']) {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'low': return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  }
}
