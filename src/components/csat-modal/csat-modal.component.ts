import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-csat-modal',
  standalone: true,
  templateUrl: './csat-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class CsatModalComponent {
  ticket = input.required<Ticket>();
  close = output<void>();
  submit = output<{ rating: number; comment: string }>();

  rating = signal(0);
  comment = signal('');
  hoveredRating = signal(0);
  
  ratingText = ['Very Poor', 'Poor', 'Okay', 'Good', 'Excellent!'];

  handleSubmit() {
    if (this.rating() > 0) {
      this.submit.emit({ rating: this.rating(), comment: this.comment() });
    }
  }
}