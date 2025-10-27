import { Component, ChangeDetectionStrategy, input, output, signal, computed, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket, Contact, KnowledgeBaseArticle, Command } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './command-palette.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteComponent {
  tickets = input.required<Ticket[]>();
  contacts = input.required<Contact[]>();
  kbArticles = input.required<KnowledgeBaseArticle[]>();
  
  close = output<void>();
  commandSelected = output<any>();

  searchQuery = signal('');
  selectedIndex = signal(0);

  constructor() {
    effect(() => {
      // When the search results change, reset the selection index to the top.
      this.searchResults(); // depend on searchResults
      this.selectedIndex.set(0);
    });
  }

  commands = signal<any[]>([
    { type: 'action', name: 'Create New Ticket', icon: 'plus-circle', action: 'newTicket' },
    { type: 'navigation', name: 'Go to My Inbox', icon: 'inbox', view: 'my-inbox' },
    { type: 'navigation', name: 'Go to Tickets', icon: 'mail', view: 'tickets' },
    { type: 'navigation', name: 'Go to Analytics', icon: 'bar-chart-3', view: 'analytics' },
    { type: 'navigation', name: 'Go to Knowledge Base', icon: 'library', view: 'kb' },
    { type: 'action', name: 'Toggle Dark Mode', icon: 'moon', action: 'toggleDarkMode' },
  ]);

  searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase();
    
    if (!query) {
      return [{ group: 'Commands', items: this.commands() }];
    }
    
    const filteredCommands = this.commands().filter(cmd => cmd.name.toLowerCase().includes(query));
    const filteredTickets = this.tickets()
      .filter(t => t.subject.toLowerCase().includes(query) || t.id.toString().includes(query))
      .map(t => ({...t, type: 'ticket', name: `#${t.id} ${t.subject}`, icon: 'mail'}));
    const filteredContacts = this.contacts()
      .filter(c => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query))
      .map(c => ({...c, type: 'contact', name: c.name, icon: 'user'}));
    const filteredKb = this.kbArticles()
      .filter(a => a.title.toLowerCase().includes(query))
      .map(a => ({...a, type: 'kb', name: a.title, icon: 'file-text'}));

    const results = [];
    if (filteredCommands.length > 0) results.push({ group: 'Commands', items: filteredCommands });
    if (filteredTickets.length > 0) results.push({ group: 'Tickets', items: filteredTickets });
    if (filteredContacts.length > 0) results.push({ group: 'Contacts', items: filteredContacts });
    if (filteredKb.length > 0) results.push({ group: 'Knowledge Base', items: filteredKb });

    return results;
  });

  flatResults = computed(() => this.searchResults().flatMap(group => group.items));

  @HostListener('document:keydown.arrowup', ['$event'])
  onArrowUp(event: KeyboardEvent) {
    event.preventDefault();
    this.selectedIndex.update(i => Math.max(0, i - 1));
    this.ensureSelectedItemVisible();
  }

  @HostListener('document:keydown.arrowdown', ['$event'])
  onArrowDown(event: KeyboardEvent) {
    event.preventDefault();
    this.selectedIndex.update(i => Math.min(this.flatResults().length - 1, i + 1));
    this.ensureSelectedItemVisible();
  }
  
  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    event.preventDefault();
    const selectedItem = this.flatResults()[this.selectedIndex()];
    if (selectedItem) {
      this.selectItem(selectedItem);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    event.preventDefault();
    this.close.emit();
  }

  selectItem(item: any) {
    this.commandSelected.emit(item);
  }
  
  private ensureSelectedItemVisible() {
    // In a real app with many results, you'd scroll the container
    // For now, this is a placeholder
  }
}