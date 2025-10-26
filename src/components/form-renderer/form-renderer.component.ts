// Fix: Implement a placeholder FormRendererComponent.
import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormDefinition } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-form-renderer',
  template: `
    <div class="p-4 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4">{{ formDefinition()?.name }}</h2>
        <p>This is a placeholder for the form renderer UI.</p>
    </div>
  `,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class FormRendererComponent {
  formDefinition = input.required<FormDefinition>();
  submit = output<any>();
}
