// Fix: Implement a placeholder FormBuilderComponent.
import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormDefinition, FormField } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-form-builder',
  template: `
    <div class="p-4 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4">Form Builder</h2>
        <p>This is a placeholder for the form builder UI.</p>
    </div>
  `,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class FormBuilderComponent {
  formDefinition = input<FormDefinition>();
  save = output<FormDefinition>();
}
