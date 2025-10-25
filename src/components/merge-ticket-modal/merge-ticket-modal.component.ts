import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-merge-ticket-modal',
  templateUrl: './merge-ticket-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class MergeTicketModalComponent {
  currentTicket = input.required<Ticket>();
  allTickets = input.required<Ticket[]>();
  close = output<void>();
  merge = output<number>();

  searchQuery = signal('');
  selectedTicketId = signal<number | null>(null);

  availableTickets = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.allTickets()
      .filter(t => t.id !== this.currentTicket().id && t.status !== 'closed')
      .filter(t => 
        query === '' ||
        t.id.toString().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.customer.toLowerCase().includes(query)
      );
  });
  
  handleMerge() {
    if (this.selectedTicketId()) {
      this.merge.emit(this.selectedTicketId()!);
    }
  }
}
