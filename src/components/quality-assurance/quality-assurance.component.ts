import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket, Agent, QARubric, QAReview, QACriterion } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-quality-assurance',
  templateUrl: './quality-assurance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, IconComponent],
})
export class QualityAssuranceComponent {
  tickets = input.required<Ticket[]>();
  agents = input.required<Agent[]>();
  rubrics = input.required<QARubric[]>({ alias: 'qaRubrics' });
  reviews = input.required<QAReview[]>({ alias: 'qaReviews' });
  saveReview = output<QAReview>();

  selectedTicket = signal<Ticket | null>(null);
  selectedRubricId = signal<string | null>(null);
  currentReviewScores = signal<{ [key: string]: number }>({});
  currentReviewFeedback = signal('');

  ticketsToReview = computed(() => {
    const reviewedTicketIds = this.reviews().map(r => r.ticketId);
    return this.tickets().filter(t => t.status === 'resolved' && !reviewedTicketIds.includes(t.id));
  });
  
  selectedRubric = computed(() => {
    const id = this.selectedRubricId();
    if (!id) return null;
    return this.rubrics().find(r => r.id === id);
  });

  totalScore = computed(() => {
    let sum = 0;
    for (const score of Object.values(this.currentReviewScores())) {
        sum += Number(score) || 0;
    }
    return sum;
  });

  maxScore = computed(() => {
    return this.selectedRubric()?.criteria.reduce((sum, crit) => sum + crit.maxScore, 0) || 0;
  });

  selectTicket(ticket: Ticket) {
    this.selectedTicket.set(ticket);
    this.selectedRubricId.set(null);
    this.currentReviewScores.set({});
    this.currentReviewFeedback.set('');
  }
  
  handleRubricChange(event: Event) {
    const rubricId = (event.target as HTMLSelectElement).value;
    this.selectedRubricId.set(rubricId);
    this.currentReviewScores.set({});
    this.selectedRubric()?.criteria.forEach(c => {
        this.updateScore(c.id, 0);
    });
  }

  updateScore(criterionId: string, score: number) {
    const criterion = this.selectedRubric()?.criteria.find(c => c.id === criterionId);
    if (!criterion) return;

    const newScore = Math.max(0, Math.min(score, criterion.maxScore));
    this.currentReviewScores.update(scores => ({
      ...scores,
      [criterionId]: newScore
    }));
  }
  
  handleScoreInput(criterionId: string, event: Event) {
    const score = (event.target as HTMLInputElement).valueAsNumber;
    this.updateScore(criterionId, score);
  }

  handleSaveReview() {
    const ticket = this.selectedTicket();
    const rubricId = this.selectedRubricId();
    const agent = this.agents().find(a => a.name === ticket?.assignedTo);

    if (!ticket || !rubricId || !agent) {
        // Should show an error to the user
        console.error("Cannot save review, missing data.", {ticket, rubricId, agent});
        return;
    }
    
    const newReview: QAReview = {
        id: `review-${Date.now()}`,
        ticketId: ticket.id,
        rubricId: rubricId,
        reviewerId: 1, // Hardcoded for now, would be current user
        agentId: agent.id,
        scores: this.currentReviewScores(),
        feedback: this.currentReviewFeedback(),
        reviewDate: new Date().toISOString(),
        totalScore: this.totalScore()
    };
    
    this.saveReview.emit(newReview);
    this.selectTicket(null); // Reset form
  }
  
  getAgentName(agentId: number): string {
    return this.agents().find(a => a.id === agentId)?.name || 'Unknown Agent';
  }
  
  getRubricName(rubricId: string): string {
    return this.rubrics().find(r => r.id === rubricId)?.name || 'Unknown Rubric';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}