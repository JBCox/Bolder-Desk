import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-log-time-modal',
  standalone: true,
  templateUrl: './log-time-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class LogTimeModalComponent {
  close = output<void>();
  logTime = output<number>();

  hours = signal(0);
  minutes = signal(0);

  handleLogTime() {
    const totalSeconds = (this.hours() * 3600) + (this.minutes() * 60);
    if (totalSeconds > 0) {
      this.logTime.emit(totalSeconds);
    }
  }
}