import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SsoSettings } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-sso-settings',
  templateUrl: './sso-settings.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
})
export class SsoSettingsComponent {
  initialSettings = input.required<SsoSettings>({ alias: 'settings' });
  save = output<SsoSettings>();

  editableSettings = signal<SsoSettings>({ enabled: false, providerUrl: '', clientId: '', clientSecret: '' });

  constructor() {
    effect(() => {
      this.editableSettings.set({ ...this.initialSettings() });
    });
  }

  toggleSsoEnabled() {
    this.editableSettings.update(s => ({...s, enabled: !s.enabled}));
  }

  handleSave() {
    this.save.emit(this.editableSettings());
  }
}