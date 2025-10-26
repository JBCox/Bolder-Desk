import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Organization, Contact, Ticket, Message, InternalNote, Activity } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
})
export class CustomersComponent {
  organizations = input.required<Organization[]>();
  contacts = input.required<Contact[]>();
  tickets = input.required<Ticket[]>();

  searchQuery = signal('');
  selectedOrganization = signal<Organization | null>(null);
  selectedContact = signal<Contact | null>(null);

  filteredOrganizations = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.organizations();
    return this.organizations().filter(org => org.name.toLowerCase().includes(query));
  });

  contactsForSelectedOrg = computed(() => {
    const org = this.selectedOrganization();
    if (!org) return [];
    return this.contacts().filter(c => c.organizationId === org.id);
  });

  timelineForSelectedContact = computed(() => {
    const contact = this.selectedContact();
    if (!contact) return [];
    
    const contactTickets = this.tickets().filter(t => t.contactId === contact.id);
    let events: any[] = [];
    
    for (const ticket of contactTickets) {
      events.push({ 
        itemType: 'activity', 
        type: 'created',
        ticketId: ticket.id, 
        subject: ticket.subject, 
        timestamp: new Date(ticket.created), 
        user: contact.name,
        details: `Ticket #${ticket.id} created: "${ticket.subject}"`
      });
      
      for (const message of ticket.messages) {
        events.push({ ...message, itemType: 'message', ticketId: ticket.id, timestamp: new Date(message.timestamp) });
      }
      
      for (const note of ticket.internalNotes) {
        events.push({ ...note, itemType: 'note', ticketId: ticket.id, timestamp: new Date(note.timestamp) });
      }
    }
    
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  selectOrganization(org: Organization) {
    this.selectedOrganization.set(org);
    this.selectedContact.set(null);
  }

  selectContact(contact: Contact) {
    this.selectedContact.set(contact);
    this.selectedOrganization.set(this.organizations().find(o => o.id === contact.organizationId) || null);
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString();
  }

  getInitials(name: string): string {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
  }
}
