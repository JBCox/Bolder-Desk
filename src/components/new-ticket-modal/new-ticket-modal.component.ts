import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFieldDefinition } from '../../models';

@Component({
  selector: 'app-new-ticket-modal',
  templateUrl: './new-ticket-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class NewTicketModalComponent {
  availableTags = input.required<string[]>();
  customFieldDefinitions = input.required<CustomFieldDefinition[]>();
  close = output<void>();
  submit = output<any>();

  formData = signal({
    customer: '',
    email: '',
    subject: '',
    description: '',
    priority: 'medium',
    tags: [] as string[],
    category: 'General',
    customFields: {} as { [key: string]: any }
  });

  constructor() {
    effect(() => {
        const customFields: { [key: string]: any } = {};
        this.customFieldDefinitions().forEach(field => {
            customFields[field.id] = field.defaultValue;
        });
        this.formData.update(data => ({ ...data, customFields }));
    }, { allowSignalWrites: true });
  }

  handleSubmit() {
    this.submit.emit(this.formData());
  }

  toggleTag(tag: string) {
    this.formData.update(data => {
      const newTags = data.tags.includes(tag)
        ? data.tags.filter(t => t !== tag)
        : [...data.tags, tag];
      return { ...data, tags: newTags };
    });
  }
}