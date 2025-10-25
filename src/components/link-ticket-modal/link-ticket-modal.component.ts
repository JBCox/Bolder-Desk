import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-link-ticket-modal',
  templateUrl: './link-ticket-modal.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
})
export class LinkTicketModalComponent {
  currentTicket = input.required<Ticket>();
  allTickets = input.required<Ticket[]>();
  close = output<void>();
  link = output<number>();

  searchQuery = signal('');
  selectedTicketId = signal<number | null>(null);

  availableTickets = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const currentId = this.currentTicket().id;
    const parentId = this.currentTicket().parentId;
    const childIds = this.currentTicket().childTicketIds || [];
    
    return this.allTickets()
      // Exclude current ticket, its parent, and its children
      .filter(t => t.id !== currentId && t.id !== parentId && !childIds.includes(t.id))
      // Exclude tickets that already have a parent
      .filter(t => !t.parentId)
      .filter(t => 
        query === '' ||
        t.id.toString().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.customer.toLowerCase().includes(query)
      );
  });
  
  handleLink() {
    if (this.selectedTicketId()) {
      this.link.emit(this.selectedTicketId()!);
    }
  }
}
