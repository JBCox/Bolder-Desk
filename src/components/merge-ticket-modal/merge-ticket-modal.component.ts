import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket, Contact } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-merge-ticket-modal',
  standalone: true,
  templateUrl: './merge-ticket-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class MergeTicketModalComponent {
  currentTicket = input.required<Ticket>();
  allTickets = input.required<Ticket[]>();
  contacts = input.required<Contact[]>();
  close = output<void>();
  merge = output<number>();

  searchQuery = signal('');
  selectedTicketId = signal<number | null>(null);

  availableTickets = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const allContacts = this.contacts();
    return this.allTickets()
      .filter(t => t.id !== this.currentTicket().id && t.status !== 'closed')
      .filter(t => {
        const contact = allContacts.find(c => c.id === t.contactId);
        if (!contact) return false;

        return query === '' ||
          t.id.toString().includes(query) ||
          t.subject.toLowerCase().includes(query) ||
          contact.name.toLowerCase().includes(query);
      });
  });
  
  getContactForTicket(ticket: Ticket): Contact | undefined {
    return this.contacts().find(c => c.id === ticket.contactId);
  }

  handleMerge() {
    if (this.selectedTicketId()) {
      this.merge.emit(this.selectedTicketId()!);
    }
  }
}