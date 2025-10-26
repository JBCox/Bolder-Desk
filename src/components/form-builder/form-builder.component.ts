import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormTemplate, FormField } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
})
export class FormBuilderComponent {
  initialTemplates = input.required<FormTemplate[]>({ alias: 'initialTemplates'});
  save = output<FormTemplate[]>();

  templates = signal<FormTemplate[]>([]);
  selectedTemplate = signal<FormTemplate | null>(null);
  selectedField = signal<FormField | null>(null);

  constructor() {
    effect(() => {
      this.templates.set(JSON.parse(JSON.stringify(this.initialTemplates())));
    });
  }

  selectTemplate(template: FormTemplate) {
    this.selectedTemplate.set(JSON.parse(JSON.stringify(template))); // Deep copy for editing
    this.selectedField.set(null);
  }

  createNewTemplate() {
    const newTemplate: FormTemplate = {
      id: `form_${Date.now()}`,
      name: 'New Form Template',
      fields: [],
    };
    this.templates.update(t => [...t, newTemplate]);
    this.selectTemplate(newTemplate);
  }

  selectField(field: FormField) {
    this.selectedField.set(field);
  }

  addField(type: FormField['type']) {
    const template = this.selectedTemplate();
    if (!template) return;

    const newField: FormField = {
      id: `field_${Date.now()}`,
      name: `field_${Date.now()}`,
      label: `New ${type} field`,
      type: type,
      required: false,
      options: type === 'dropdown' || type === 'radio' ? ['Option 1', 'Option 2'] : [],
      conditionalLogic: null,
    };
    template.fields.push(newField);
    this.selectField(newField);
  }

  removeField(fieldId: string) {
    const template = this.selectedTemplate();
    if (!template) return;
    template.fields = template.fields.filter(f => f.id !== fieldId);
    if (this.selectedField()?.id === fieldId) {
      this.selectedField.set(null);
    }
  }
  
  addOption(field: FormField) {
    field.options?.push(`Option ${field.options.length + 1}`);
  }

  removeOption(field: FormField, index: number) {
    field.options?.splice(index, 1);
  }

  updateOption(field: FormField, index: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    if(field.options) {
        field.options[index] = value;
    }
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }
  
  handleSave() {
    const currentTpl = this.selectedTemplate();
    if (currentTpl) {
       this.templates.update(tpls => tpls.map(t => t.id === currentTpl.id ? currentTpl : t));
    }
    this.save.emit(this.templates());
  }
}
