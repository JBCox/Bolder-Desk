import { Component, ChangeDetectionStrategy, input, signal, OnInit, OnDestroy, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WallboardData } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-wallboard',
  standalone: true,
  templateUrl: './wallboard.component.html',
  imports: [CommonModule, IconComponent],
})
export class WallboardComponent implements OnInit, OnDestroy {
  private app = inject(AppComponent);
  data = this.app.wallboardData;
  
  private dataFluctuationIntervalId: any;
  private timeUpdateIntervalId: any;

  currentTime = signal(new Date());

  displayOpenTickets = signal(0);
  displayResolved = signal(0);
  displaySlaRisks = signal(0);

  constructor() {
    effect(() => {
        this.displayOpenTickets.set(this.data().openTickets);
        this.displayResolved.set(this.data().todaysResolved);
        this.displaySlaRisks.set(this.data().slaBreachRisks);
    });
  }

  ngOnInit() {
    this.timeUpdateIntervalId = setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);

    this.dataFluctuationIntervalId = setInterval(() => {
      this.displayOpenTickets.update(v => this.fluctuate(v));
      this.displayResolved.update(v => this.fluctuate(v, 0.05));
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.timeUpdateIntervalId);
    clearInterval(this.dataFluctuationIntervalId);
  }

  private fluctuate(value: number, amount = 0.1): number {
    if (value === 0) return 0;
    const change = Math.random() > 0.5 ? 1 : -1;
    const fluctuation = Math.round(Math.random() * (value * amount));
    return Math.max(0, value + (change * fluctuation));
  }
}