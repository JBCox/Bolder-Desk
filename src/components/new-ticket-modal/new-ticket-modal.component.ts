import { Component, ChangeDetectionStrategy, input, output, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomFieldDefinition, KnowledgeBaseArticle, ServiceRequestType } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-new-ticket-modal',
  templateUrl: './new-ticket-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class NewTicketModalComponent {
  availableTags = input.required<string[]>();
  customFieldDefinitions = input.required<CustomFieldDefinition[]>();
  knowledgeBaseArticles = input.required<KnowledgeBaseArticle[]>();
  serviceRequestTypes = input.required<ServiceRequestType[]>();
  close = output<void>();
  submit = output<any>();

  step = signal<'selectType' | 'fillForm'>('selectType');
  selectedServiceRequest = signal<ServiceRequestType | null>(null);

  formData = signal({
    customer: '',
    email: '',
    subject: '',
    description: '',
    priority: 'medium',
    tags: [] as string[],
    category: 'General',
    customFields: {} as { [key: string]: any },
    serviceRequestId: ''
  });

  suggestedArticles = computed(() => {
    const subject = this.formData().subject.toLowerCase().trim();
    if (this.step() === 'selectType' || subject.length < 4) {
      return [];
    }
    return this.knowledgeBaseArticles()
      .filter(article => 
        article.title.toLowerCase().includes(subject) ||
        article.content.toLowerCase().includes(subject)
      )
      .slice(0, 3);
  });

  visibleCustomFields = computed(() => {
    const request = this.selectedServiceRequest();
    if (!request) return [];
    const fieldIds = request.customFieldIds;
    return this.customFieldDefinitions().filter(def => fieldIds.includes(def.id));
  });

  constructor() {
    this.resetCustomFields();
  }

  selectRequestType(requestType: ServiceRequestType) {
    this.selectedServiceRequest.set(requestType);
    this.formData.update(data => ({
      ...data,
      serviceRequestId: requestType.id
    }));
    this.step.set('fillForm');
  }

  backToSelection() {
    this.step.set('selectType');
    this.selectedServiceRequest.set(null);
    this.formData.update(data => ({
      ...data,
      serviceRequestId: ''
    }));
    this.resetCustomFields();
  }

  private resetCustomFields() {
    const customFields: { [key: string]: any } = {};
    this.customFieldDefinitions().forEach(field => {
      customFields[field.id] = field.defaultValue;
    });
    this.formData.update(data => ({ ...data, customFields }));
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
