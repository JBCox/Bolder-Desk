import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-customer-portal',
  templateUrl: './customer-portal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class CustomerPortalComponent {
  tickets = input.required<Ticket[]>();
  selectedTicket = signal<Ticket | null>(null);

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  viewTicket(ticket: Ticket) {
    this.selectedTicket.set(ticket);
  }

  goBackToList() {
    this.selectedTicket.set(null);
  }
}
