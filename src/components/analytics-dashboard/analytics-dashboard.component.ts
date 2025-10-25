
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsData } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IconComponent],
})
export class AnalyticsDashboardComponent {
  analytics = input.required<AnalyticsData>();
}
