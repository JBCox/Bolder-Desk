// Fix: Implement the NewTicketModalComponent to replace placeholder content.
import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact, Organization, CustomFieldDefinition, Ticket } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-new-ticket-modal',
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div class="p-6 border-b flex justify-between items-center">
          <h2 class="text-2xl font-bold">New Ticket</h2>
          <button (click)="close.emit()" class="text-gray-500 hover:text-gray-800">
            <app-icon name="x"></app-icon>
          </button>
        </div>
        <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label class="block text-sm font-medium text-gray-700">Contact</label>
            <select [ngModel]="selectedContactId()" (ngModelChange)="selectedContactId.set($event)" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option [ngValue]="null" disabled>Select a contact</option>
              @for (contact of contacts(); track contact.id) {
                <option [value]="contact.id">{{ contact.name }} ({{ contact.email }})</option>
              }
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Subject</label>
            <input type="text" [ngModel]="subject()" (ngModelChange)="subject.set($event)" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea rows="4" [ngModel]="description()" (ngModelChange)="description.set($event)" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Priority</label>
              <select [ngModel]="priority()" (ngModelChange)="priority.set($event)" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
              <input type="text" [ngModel]="tags()" (ngModelChange)="tags.set($event)" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            </div>
          </div>
          @if(customFieldDefinitions().length > 0) {
            <hr class="my-4">
            <h3 class="text-lg font-medium text-gray-900">Custom Fields</h3>
            <div class="space-y-4">
              @for (field of customFieldDefinitions(); track field.id) {
                <div>
                  <label class="block text-sm font-medium text-gray-700">{{ field.name }}</label>
                  @if(field.type === 'text') {
                    <input type="text" [ngModel]="customFields()[field.id]" (ngModelChange)="handleCustomFieldChange(field.id, $event)" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  }
                  @if(field.type === 'number') {
                    <input type="number" [ngModel]="customFields()[field.id]" (ngModelChange)="handleCustomFieldChange(field.id, $event)" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  }
                  @if(field.type === 'date') {
                    <input type="date" [ngModel]="customFields()[field.id]" (ngModelChange)="handleCustomFieldChange(field.id, $event)" class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                  }
                </div>
              }
            </div>
          }
        </div>
        <div class="p-6 bg-gray-50 text-right">
          <button type="button" (click)="close.emit()" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="button" (click)="handleSubmit()" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Create Ticket</button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class NewTicketModalComponent {
  contacts = input.required<Contact[]>();
  organizations = input.required<Organization[]>();
  customFieldDefinitions = input.required<CustomFieldDefinition[]>();
  close = output<void>();
  create = output<Partial<Ticket>>();

  selectedContactId = signal<number | null>(null);
  subject = signal('');
  description = signal('');
  priority = signal<'low' | 'medium' | 'high' | 'urgent'>('medium');
  tags = signal('');
  customFields = signal<{[key: string]: any}>({});

  handleSubmit() {
    if (this.subject().trim() && this.description().trim() && this.selectedContactId()) {
      this.create.emit({
        contactId: this.selectedContactId()!,
        subject: this.subject(),
        messages: [{ content: this.description() }] as any, // Simplified for creation
        priority: this.priority(),
        tags: this.tags().split(',').map(t => t.trim()).filter(Boolean),
        customFields: this.customFields()
      });
    }
  }

  handleCustomFieldChange(fieldId: string, value: any) {
    this.customFields.update(fields => ({ ...fields, [fieldId]: value }));
  }
}
