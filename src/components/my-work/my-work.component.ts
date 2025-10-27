import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket, Agent } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-my-work',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './my-work.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyWorkComponent {
  tickets = input.required<Ticket[]>();
  currentAgent = input.required<Agent>();
  viewTicket = output<number>();

  myOpenTickets = computed(() => 
    this.tickets().filter(t => t.assignedTo === this.currentAgent().name && (t.status === 'open' || t.status === 'pending'))
  );

  highPriorityTickets = computed(() => 
    this.myOpenTickets().filter(t => t.priority === 'high' || t.priority === 'urgent').sort((a,b) => new Date(a.created).getTime() - new Date(b.created).getTime())
  );

  otherTickets = computed(() =>
    this.myOpenTickets().filter(t => t.priority !== 'high' && t.priority !== 'urgent').sort((a,b) => new Date(a.created).getTime() - new Date(b.created).getTime())
  );

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}