import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact, Organization, CustomFieldDefinition, Ticket, FormTemplate, KnowledgeBaseArticle } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { FormRendererComponent } from '../form-renderer/form-renderer.component';

@Component({
  selector: 'app-new-ticket-modal',
  templateUrl: './new-ticket-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent, FormRendererComponent],
})
export class NewTicketModalComponent {
  contacts = input.required<Contact[]>();
  organizations = input.required<Organization[]>();
  customFieldDefinitions = input.required<CustomFieldDefinition[]>();
  formTemplates = input.required<FormTemplate[]>();
  knowledgeBaseArticles = input.required<KnowledgeBaseArticle[]>();
  
  close = output<void>();
  create = output<Partial<Ticket> & { formValues?: any }>();

  selectedContactId = signal<number | null>(null);
  selectedTemplateId = signal<string | null>(null);
  
  formValues = signal<{[key: string]: any}>({});
  
  selectedTemplate = computed(() => {
    const id = this.selectedTemplateId();
    if (!id) return null;
    return this.formTemplates().find(t => t.id === id);
  });

  handleFormSubmit(values: any) {
    this.formValues.set(values);
    this.handleSubmit();
  }

  handleSubmit() {
    const template = this.selectedTemplate();
    if (!template || !this.selectedContactId()) return;

    // A real app would have more robust mapping
    const subject = this.formValues()['subject'] || template.name;
    const description = this.formValues()['description'] || 'No description provided.';
    
    this.create.emit({
      contactId: this.selectedContactId()!,
      subject: subject,
      messages: [{ content: description }] as any,
      priority: 'medium', // Could be set by form
      tags: [],
      formValues: this.formValues()
    });
  }
}
