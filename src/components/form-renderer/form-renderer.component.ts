import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormTemplate, FormField } from '../../models';

@Component({
  selector: 'app-form-renderer',
  standalone: true,
  templateUrl: './form-renderer.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class FormRendererComponent {
  formTemplate = input.required<FormTemplate>();
  submit = output<any>();
  
  form!: FormGroup;
  visibleFields = signal<FormField[]>([]);

  constructor(private fb: FormBuilder) {
    effect(() => {
      this.buildForm();
    });
  }
  
  private buildForm() {
    const template = this.formTemplate();
    const group: { [key: string]: any } = {};

    template.fields.forEach(field => {
      const validators = field.required ? [Validators.required] : [];
      group[field.name] = new FormControl('', validators);
    });

    this.form = this.fb.group(group);
    this.updateVisibleFields();

    this.form.valueChanges.subscribe(() => {
        this.updateVisibleFields();
    });
  }

  private updateVisibleFields() {
    const template = this.formTemplate();
    const formValues = this.form.getRawValue();

    this.visibleFields.set(
        template.fields.filter(field => {
            if (!field.conditionalLogic) {
                return true;
            }
            const { fieldId, value } = field.conditionalLogic;
            const controllingField = template.fields.find(f => f.id === fieldId);
            if (!controllingField) return true; // Failsafe

            const actualValue = formValues[controllingField.name];
            return actualValue == value;
        })
    );
  }
  
  onSubmit() {
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    } else {
        this.form.markAllAsTouched();
    }
  }
}
