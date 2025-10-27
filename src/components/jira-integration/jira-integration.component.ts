import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JiraSettings } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-jira-integration',
  standalone: true,
  templateUrl: './jira-integration.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JiraIntegrationComponent {
  initialSettings = input.required<JiraSettings>({ alias: 'settings' });
  save = output<JiraSettings>();

  editableSettings = signal<JiraSettings>({
    connected: false,
    instanceUrl: '',
    projectKey: '',
    issueTypeId: '',
  });

  constructor() {
    effect(() => {
      this.editableSettings.set(JSON.parse(JSON.stringify(this.initialSettings())));
    });
  }

  handleSave() {
    this.save.emit(this.editableSettings());
    alert('Jira settings saved!');
  }

  toggleConnection() {
    this.editableSettings.update(s => ({...s, connected: !s.connected}));
  }
}