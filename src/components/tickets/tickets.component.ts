import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AppComponent } from '../../app.component';
import * as models from '../../models';

import { IconComponent } from '../icon/icon.component';
import { TicketDetailComponent } from '../ticket-detail/ticket-detail.component';
import { BulkActionBarComponent } from '../bulk-action-bar/bulk-action-bar.component';
import { ChatWidgetComponent } from '../chat-widget/chat-widget.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, TicketDetailComponent, BulkActionBarComponent, ChatWidgetComponent],
  templateUrl: './tickets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketsComponent {
  public app = inject(AppComponent);
  // FIX: Explicitly type injected ActivatedRoute to fix "Property 'paramMap' does not exist on type 'unknown'" error.
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // UI State local to the tickets view
  showFilterPanel = signal(false);
  panelFilters = signal<models.TicketFilters>([]);
  newViewName = signal('');
  newViewVisibility = signal<'private' | 'shared'>('private');
  newViewSharedGroups = signal<number[]>([]);
  tempViewOptions = signal<models.TicketView['displayOptions'] | null>(null);
  isEditingView = signal(false);
  showViewsDropdown = signal(false);
  showViewActions = signal(false);
  editingCell = signal<{ ticketId: number, columnId: string } | null>(null);

  selectedTicketId = signal<number | null>(null);

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const numericId = id ? Number(id) : null;
      this.selectedTicketId.set(numericId);
      this.app.selectedTicketId.set(numericId);
    });
  }
  
  // === COMPUTED SIGNALS ===
  
  selectedTicket = computed(() => {
    const id = this.selectedTicketId();
    return id ? this.app.tickets().find(t => t.id === id) ?? null : null;
  });

  selectedContact = computed(() => {
    const ticket = this.selectedTicket();
    if (!ticket) return undefined;
    return this.app.contacts().find(c => c.id === ticket.contactId);
  });

  privateViews = computed(() => this.app.ticketViews().filter(v => v.visibility === 'private' && v.ownerId === this.app.currentAgent().id));
  
  teamViews = computed(() => {
    const agentGroups = this.app.groups().filter(g => g.memberIds.includes(this.app.currentAgent().id)).map(g => g.id);
    if (agentGroups.length === 0) return [];
    return this.app.ticketViews().filter(v => 
      v.visibility === 'shared' && 
      v.sharedWithGroupIds && 
      v.sharedWithGroupIds.length > 0 &&
      v.sharedWithGroupIds.some(gId => agentGroups.includes(gId))
    );
  });
  
  sharedViews = computed(() => this.app.ticketViews().filter(v => v.visibility === 'shared' && (!v.sharedWithGroupIds || v.sharedWithGroupIds.length === 0)));

  canEditActiveView = computed(() => {
    const view = this.activeView();
    return view.ownerId === this.app.currentAgent().id && view.id !== 'all';
  });

  availableFilterFields = computed(() => {
    const standardFields = [
        { id: 'status', name: 'Status', type: 'dropdown', options: ['open', 'pending', 'resolved', 'closed'] },
        { id: 'priority', name: 'Priority', type: 'dropdown', options: ['low', 'medium', 'high', 'urgent'] },
        { id: 'assignedTo', name: 'Assignee', type: 'agent_dropdown' },
        { id: 'tags', name: 'Tags', type: 'text_contains' },
        { id: 'created', name: 'Created Date', type: 'date' },
        { id: 'timeSinceLastUpdate', name: 'Hours Since Last Update', type: 'number' },
        { id: 'slaStatus', name: 'SLA Status', type: 'dropdown', options: ['ok', 'risk', 'breached'] },
        { id: 'source', name: 'Source Channel', type: 'dropdown', options: ['email', 'portal', 'chat', 'api', 'slack'] },
    ];
    const custom = this.app.customFieldDefs().map(cf => ({
        id: cf.id,
        name: cf.name,
        type: cf.type,
        options: cf.options
    }));
    return [...standardFields, ...custom];
  });

  availableColumns = computed(() => {
      const standard = [
        { id: 'id', name: 'ID' }, { id: 'subject', name: 'Subject'}, { id: 'contact', name: 'Contact' }, { id: 'status', name: 'Status'},
        { id: 'priority', name: 'Priority'}, { id: 'created', name: 'Created'}, { id: 'assignedTo', name: 'Assignee' }
      ];
      const custom = this.app.customFieldDefs().map(cf => ({ id: cf.id, name: cf.name }));
      return [...standard, ...custom];
  });

  activeView = computed(() => {
    const viewId = this.app.activeViewId();
    return this.app.ticketViews().find(v => v.id === viewId) || this.app.ticketViews()[0];
  });

  filteredTickets = computed(() => {
    const filters = this.app.activeFilters();
    const allTickets = this.app.tickets();
    const query = this.app.searchQuery().toLowerCase();

    const searchFiltered = allTickets.filter(ticket => query === '' ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.id.toString().includes(query) ||
        this.app.getContact(ticket.contactId)?.name.toLowerCase().includes(query)
    );

    if (filters.length === 0) return searchFiltered;

    return searchFiltered.filter(ticket => {
        return filters.every(group => {
            const conditionsInGroup = group.conditions.filter(c => c.field && c.operator);
            if (conditionsInGroup.length === 0) return true;

            const checkCondition = (cond: models.TicketFilterCondition) => {
                let ticketValue: any;
                switch(cond.field) {
                    case 'slaStatus': ticketValue = ticket.sla?.status; break;
                    case 'timeSinceLastUpdate':
                        const lastMessage = ticket.messages[ticket.messages.length - 1];
                        const lastTimestamp = lastMessage ? new Date(lastMessage.timestamp).getTime() : new Date(ticket.created).getTime();
                        ticketValue = (Date.now() - lastTimestamp) / (1000 * 60 * 60); // hours
                        break;
                    case 'assignedTo': ticketValue = ticket.assignedTo || 'unassigned'; break;
                    case 'tags': ticketValue = ticket.tags; break;
                    default: ticketValue = cond.field.startsWith('cf_') ? ticket.customFields?.[cond.field] : (ticket as any)[cond.field];
                }
                const val = cond.value;
                switch (cond.operator) {
                    case 'is': return ticketValue?.toString().toLowerCase() == val?.toString().toLowerCase();
                    case 'is_not': return ticketValue?.toString().toLowerCase() != val?.toString().toLowerCase();
                    case 'contains': return Array.isArray(ticketValue) ? ticketValue.some(item => item.toLowerCase().includes(val.toLowerCase())) : ticketValue?.toString().toLowerCase().includes(val.toLowerCase());
                    case 'does_not_contain': return Array.isArray(ticketValue) ? !ticketValue.some(item => item.toLowerCase().includes(val.toLowerCase())) : !ticketValue?.toString().toLowerCase().includes(val.toLowerCase());
                    case 'starts_with': return ticketValue?.toString().toLowerCase().startsWith(val.toLowerCase());
                    case 'ends_with': return ticketValue?.toString().toLowerCase().endsWith(val.toLowerCase());
                    case 'is_set': return ticketValue !== undefined && ticketValue !== null && ticketValue !== '';
                    case 'is_not_set': return ticketValue === undefined || ticketValue === null || ticketValue === '';
                    case 'greater_than': return cond.field === 'timeSinceLastUpdate' ? ticketValue > parseFloat(val) : new Date(ticketValue) > new Date(val);
                    case 'less_than': return cond.field === 'timeSinceLastUpdate' ? ticketValue < parseFloat(val) : new Date(ticketValue) < new Date(val);
                    case 'last_x_days':
                        const targetDate = new Date();
                        targetDate.setDate(targetDate.getDate() - parseInt(val, 10));
                        targetDate.setHours(0, 0, 0, 0);
                        return new Date(ticketValue) >= targetDate;
                    case 'is_one_of':
                        const values = val.split(',').map((v: string) => v.trim().toLowerCase());
                        return values.includes(ticketValue?.toString().toLowerCase());
                    default: return true;
                }
            };
            return group.matchType === 'all' ? conditionsInGroup.every(checkCondition) : conditionsInGroup.some(checkCondition);
        });
    });
  });

  groupedAndSortedTickets = computed(() => {
    const tickets = this.filteredTickets();
    const { sortBy, sortDirection, groupBy } = this.activeView().displayOptions;

    const sorted = [...tickets].sort((a, b) => {
        let valA = (a as any)[sortBy] ?? (a.customFields as any)?.[sortBy];
        let valB = (b as any)[sortBy] ?? (b.customFields as any)?.[sortBy];
        if (sortBy === 'contact') {
            valA = this.app.getContact(a.contactId)?.name;
            valB = this.app.getContact(b.contactId)?.name;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    if (!groupBy) return { 'All Tickets': sorted };

    return sorted.reduce((acc, ticket) => {
        let groupKey = (ticket as any)[groupBy] ?? (ticket.customFields as any)?.[groupBy] ?? 'Uncategorized';
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(ticket);
        return acc;
    }, {} as { [key: string]: models.Ticket[] });
  });

  objectKeys = (obj: object) => Object.keys(obj);
  
  isViewModified = computed(() => {
    const activeId = this.app.activeViewId();
    if (activeId === 'custom') return true;
    const currentView = this.app.ticketViews().find(v => v.id === activeId);
    if (!currentView) return true;
    const filtersMatch = JSON.stringify(currentView.filters) === JSON.stringify(this.app.activeFilters());
    return !filtersMatch;
  });
  
  showSaveActions = computed(() => this.isViewModified() || this.app.activeViewId() === 'custom');
  
  areAllSelected = computed(() => {
    const filteredIds = this.filteredTickets().map(t => t.id);
    return filteredIds.length > 0 && filteredIds.every(id => this.app.selectedTicketIds().includes(id));
  });

  // == METHODS ==
  
  toggleFilterPanel() {
    if (!this.showFilterPanel()) {
      const currentFilters = this.app.activeFilters();
      const filtersToSet = currentFilters.length > 0 ? currentFilters : [{ id: `g_${Date.now()}`, matchType: 'all', conditions: [{id: `c_${Date.now()}`, field: '', operator: 'is', value: ''}]}];
      this.panelFilters.set(JSON.parse(JSON.stringify(filtersToSet)));
    }
    this.showFilterPanel.update(v => !v);
  }

  applyFilters() {
    const newFilters = this.panelFilters().map(g => ({ ...g, conditions: g.conditions.filter(c => c.field && c.operator) })).filter(g => g.conditions.length > 0);
    this.app.activeFilters.set(newFilters);
    const matchingView = this.app.ticketViews().find(v => JSON.stringify(v.filters) === JSON.stringify(newFilters));
    this.app.activeViewId.set(matchingView ? matchingView.id : 'custom');
    this.showFilterPanel.set(false);
  }

  clearFilters() {
    this.panelFilters.set([]);
    this.app.selectView(this.app.ticketViews()[0]);
    this.showFilterPanel.set(false);
  }
  
  addConditionGroup = () => this.panelFilters.update(f => [...f, { id: `g_${Date.now()}`, matchType: 'all', conditions: [{id: `c_${Date.now()}`, field: '', operator: 'is', value: ''}]}]);
  removeConditionGroup = (index: number) => this.panelFilters.update(f => f.filter((_, i) => i !== index));
  updateGroupMatchType = (index: number, event: Event) => this.panelFilters.update(f => { f[index].matchType = (event.target as HTMLSelectElement).value as 'all' | 'any'; return [...f]; });
  addCondition = (groupIndex: number) => this.panelFilters.update(f => { f[groupIndex].conditions.push({id: `c_${Date.now()}`, field: '', operator: 'is', value: ''}); return [...f]; });
  removeCondition = (groupIndex: number, condIndex: number) => this.panelFilters.update(f => { f[groupIndex].conditions = f[groupIndex].conditions.filter((_, i) => i !== condIndex); return [...f]; });

  updateConditionField(groupIndex: number, condIndex: number, event: Event) {
    const fieldId = (event.target as HTMLSelectElement).value;
    this.panelFilters.update(f => {
      f[groupIndex].conditions[condIndex].field = fieldId;
      f[groupIndex].conditions[condIndex].value = '';
      return [...f];
    });
  }
  updateConditionOperator(groupIndex: number, condIndex: number, event: Event) {
    const operator = (event.target as HTMLSelectElement).value as models.FilterOperator;
    this.panelFilters.update(f => { f[groupIndex].conditions[condIndex].operator = operator; return [...f]; });
  }
  updateConditionValue(groupIndex: number, condIndex: number, value: any) {
    this.panelFilters.update(f => { f[groupIndex].conditions[condIndex].value = value; return [...f]; });
  }

  getFieldDef = (fieldId: string) => this.availableFilterFields().find(f => f.id === fieldId);
  
  getOperatorsForFieldType(fieldType?: string): {id: models.FilterOperator, name: string}[] {
    const general: {id: models.FilterOperator, name: string}[] = [{id: 'is_set', name: 'is set'}, {id: 'is_not_set', name: 'is not set'}];
    const text: {id: models.FilterOperator, name: string}[] = [{id: 'is', name: 'is'}, {id: 'is_not', name: 'is not'}, {id: 'contains', name: 'contains'}, {id: 'does_not_contain', name: 'does not contain'}, {id: 'starts_with', name: 'starts with'}, {id: 'ends_with', name: 'ends with'}];
    const number: {id: models.FilterOperator, name: string}[] = [{id: 'is', name: 'is'}, {id: 'is_not', name: 'is not'}, {id: 'greater_than', name: 'is greater than'}, {id: 'less_than', name: 'is less than'}];
    const date: {id: models.FilterOperator, name: string}[] = [{id: 'is_on', name: 'is on'}, {id: 'is_before', name: 'is before'}, {id: 'is_after', name: 'is after'}, {id: 'last_x_days', name: 'in the last X days'}];
    const dropdown: {id: models.FilterOperator, name: string}[] = [{id: 'is', name: 'is'}, {id: 'is_not', name: 'is not'}, {id: 'is_one_of', name: 'is one of'}];

    switch(fieldType) {
        case 'number': return [...number, ...general];
        case 'date': return [...date, ...general];
        case 'dropdown': case 'agent_dropdown': return [...dropdown, ...general];
        default: return [...text, ...general];
    }
  }

  selectView(view: models.TicketView) {
    this.app.selectView(view);
    this.showViewsDropdown.set(false);
    this.showViewActions.set(false);
  }
  
  resetViewChanges() { this.selectView(this.activeView()); }

  openSaveViewModal(isCloning = false) {
    this.isEditingView.set(false);
    this.tempViewOptions.set(JSON.parse(JSON.stringify(this.activeView().displayOptions)));
    this.newViewName.set(isCloning ? `${this.activeView().name} (Copy)` : '');
    this.newViewVisibility.set('private');
    this.newViewSharedGroups.set([]);
    this.app.openModal.set('saveView');
  }
  
  cloneView() {
    this.openSaveViewModal(true);
    this.showViewActions.set(false);
    this.app.addToast('View cloned. You can now save it as a new view.', 'info');
  }

  renameView(viewId: string) {
    const view = this.app.ticketViews().find(v => v.id === viewId);
    if (!view) return;
    const newName = prompt('Enter a new name for the view:', view.name);
    if (newName && newName.trim()) {
        this.app.ticketViews.update(views => views.map(v => v.id === viewId ? {...v, name: newName.trim()} : v));
        this.app.addToast(`View renamed to "${newName.trim()}"`, 'success');
    }
    this.showViewActions.set(false);
  }
  
  setDefaultView(viewId: string) {
    localStorage.setItem('bolddesk_default_view', viewId);
    this.app.defaultViewId.set(viewId);
    this.showViewActions.set(false);
    const viewName = this.app.ticketViews().find(v=>v.id === viewId)?.name;
    this.app.addToast(`"${viewName}" is now your default view.`, 'success');
  }

  openEditViewModal() {
    const view = this.activeView();
    if (!this.canEditActiveView()) return;
    this.isEditingView.set(true);
    this.newViewName.set(view.name);
    this.newViewVisibility.set(view.visibility);
    this.newViewSharedGroups.set(view.sharedWithGroupIds || []);
    this.tempViewOptions.set(JSON.parse(JSON.stringify(view.displayOptions)));
    this.app.openModal.set('saveView');
    this.showViewActions.set(false);
  }

  toggleViewColumn(columnId: string) {
    this.tempViewOptions.update(opts => {
      if (!opts) return null;
      const newCols = opts.columns.includes(columnId) ? opts.columns.filter(c => c !== columnId) : [...opts.columns, columnId];
      return { ...opts, columns: newCols };
    });
  }
  
  toggleSharedGroup(groupId: number) {
    this.newViewSharedGroups.update(groups => groups.includes(groupId) ? groups.filter(g => g !== groupId) : [...groups, groupId]);
  }

  updateCurrentView() {
    const viewId = this.app.activeViewId();
    if (!this.isViewModified() || !this.canEditActiveView()) return;
    this.app.ticketViews.update(views => views.map(v => v.id === viewId ? { ...v, filters: JSON.parse(JSON.stringify(this.app.activeFilters())) } : v));
    this.app.addToast(`View "${this.activeView().name}" updated.`, 'success');
  }

  deleteView(viewId: string) {
    if (confirm('Are you sure you want to delete this view?')) {
        const viewName = this.app.ticketViews().find(v => v.id === viewId)?.name;
        this.app.ticketViews.update(views => views.filter(v => v.id !== viewId));
        this.selectView(this.app.ticketViews()[0]);
        this.app.addToast(`View "${viewName}" deleted.`, 'success');
    }
    this.showViewActions.set(false);
  }

  saveCurrentView() {
    const viewName = this.newViewName().trim();
    if (!viewName || !this.tempViewOptions()) return;

    if (this.isEditingView()) {
        const viewId = this.app.activeViewId();
        this.app.ticketViews.update(views => views.map(v => v.id === viewId ? { ...v, name: viewName, visibility: this.newViewVisibility(), sharedWithGroupIds: this.newViewVisibility() === 'shared' ? this.newViewSharedGroups() : [], displayOptions: this.tempViewOptions()! } : v));
        this.app.addToast(`View "${viewName}" saved.`, 'success');
    } else {
        const newView: models.TicketView = {
            id: `view_${Date.now()}`, name: viewName, ownerId: this.app.currentAgent().id, visibility: this.newViewVisibility(),
            sharedWithGroupIds: this.newViewVisibility() === 'shared' ? this.newViewSharedGroups() : [],
            filters: this.app.activeFilters(), displayOptions: this.tempViewOptions()!
        };
        this.app.ticketViews.update(views => [...views, newView]);
        this.app.activeViewId.set(newView.id);
        this.app.addToast(`View "${viewName}" created.`, 'success');
    }
    this.app.openModal.set(null);
  }

  getColumnName = (columnId: string): string => this.availableColumns().find(c => c.id === columnId)?.name || columnId;
  getColumnValue = (ticket: models.Ticket, columnId: string): string => {
    if (columnId.startsWith('cf_')) return ticket.customFields?.[columnId] || '';
    switch (columnId) {
        case 'contact': return this.app.getContact(ticket.contactId)?.name || 'Unknown';
        case 'created': return new Date(ticket.created).toLocaleDateString();
        default: return (ticket as any)[columnId]?.toString() || '';
    }
  }

  startEditing = (ticketId: number, columnId: string, event: MouseEvent) => { event.stopPropagation(); this.editingCell.set({ ticketId, columnId }); }
  stopEditing = () => this.editingCell.set(null);

  handleInlineUpdate(ticketId: number, columnId: 'status' | 'priority' | 'assignedTo', event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.app.tickets.update(tickets => tickets.map(t => t.id === ticketId ? { ...t, [columnId]: value === 'unassigned' ? undefined : value } : t));
    this.stopEditing();
  }
  
  toggleSelectTicket(ticketId: number) {
    this.app.selectedTicketIds.update(ids => ids.includes(ticketId) ? ids.filter(id => id !== ticketId) : [...ids, ticketId]);
  }

  toggleSelectAll() {
    if (this.areAllSelected()) {
      this.app.selectedTicketIds.set([]);
    } else {
      this.app.selectedTicketIds.set(this.filteredTickets().map(t => t.id));
    }
  }
  
  handleBulkAction(event: { action: string, value: any }) {
    this.app.tickets.update(tickets => tickets.map(t => {
      if (this.app.selectedTicketIds().includes(t.id)) {
        switch (event.action) {
          case 'status': return { ...t, status: event.value };
          case 'priority': return { ...t, priority: event.value };
          case 'assign': return { ...t, assignedTo: event.value === 'unassigned' ? undefined : event.value };
          case 'addTag': return { ...t, tags: [...new Set([...t.tags, event.value])] };
          default: return t;
        }
      }
      return t;
    }));
    this.app.addToast(`${this.app.selectedTicketIds().length} tickets updated.`, 'success');
    this.app.selectedTicketIds.set([]);
  }
}