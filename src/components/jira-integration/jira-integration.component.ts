import { Component, ChangeDetectionStrategy, input, output, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JiraSettings } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-jira-integration',
  standalone: true,
  templateUrl: './jira-integration.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JiraIntegrationComponent {
  private app = inject(AppComponent);
  initialSettings = this.app.jiraSettings;

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
    this.app.handleSaveJiraSettings(this.editableSettings());
    alert('Jira settings saved!');
  }

  toggleConnection() {
    this.editableSettings.update(s => ({...s, connected: !s.connected}));
  }
}