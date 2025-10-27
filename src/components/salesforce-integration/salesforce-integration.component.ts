import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesforceSettings } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-salesforce-integration',
  standalone: true,
  templateUrl: './salesforce-integration.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesforceIntegrationComponent {
  initialSettings = input.required<SalesforceSettings>({ alias: 'settings' });
  save = output<SalesforceSettings>();

  editableSettings = signal<SalesforceSettings>({
    connected: false,
    instanceUrl: '',
    sync: { accounts: false, contacts: false, cases: false },
  });

  constructor() {
    effect(() => {
      this.editableSettings.set(JSON.parse(JSON.stringify(this.initialSettings())));
    });
  }

  handleSave() {
    this.save.emit(this.editableSettings());
    alert('Salesforce settings saved!');
  }

  toggleConnection() {
    this.editableSettings.update(s => ({...s, connected: !s.connected}));
  }
}