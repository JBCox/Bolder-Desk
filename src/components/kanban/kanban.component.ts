import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';

import { KanbanBoard, KanbanColumn, KanbanTask, Agent, KanbanLabel, KanbanComment, KanbanActivity } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { AppComponent } from '../../app.component';
import { NewKanbanBoardModalComponent } from '../new-kanban-board-modal/new-kanban-board-modal.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, NewKanbanBoardModalComponent, CdkDropListGroup, CdkDropList, CdkDrag, DatePipe],
  templateUrl: './kanban.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanComponent {
  app = inject(AppComponent);
  
  workspaces = this.app.kanbanWorkspaces;
  boards = this.app.kanbanBoards;
  agents = this.app.agents;
  tasks = this.app.kanbanTasks;

  selectedWorkspaceId = signal<string | null>(null);
  selectedBoardId = signal<string | null>(null);

  // Modal State
  showCardDetailModal = signal(false);
  selectedCardForDetail = signal<KanbanTask | null>(null);
  editableCard = signal<Partial<KanbanTask> | null>(null);
  newComment = signal('');

  selectedBoard = computed<KanbanBoard | null>(() => {
    const boardId = this.selectedBoardId();
    if (!boardId) return null;
    return this.boards().find(b => b.id === boardId) || null;
  });

  columnsForSelectedBoard = computed(() => {
    return this.selectedBoard()?.columns || [];
  });
  
  selectedCardColumnName = computed(() => {
    const card = this.selectedCardForDetail();
    if (!card) return '';
    const column = this.columnsForSelectedBoard().find(c => c.taskIds.includes(card.id));
    return column ? column.title : '';
  });

  boardsInSelectedWorkspace = computed(() => {
    const wsId = this.selectedWorkspaceId();
    if (!wsId) return [];
    const workspace = this.workspaces().find(ws => ws.id === wsId);
    if (!workspace) return [];
    return this.boards().filter(b => workspace.boardIds.includes(b.id));
  });

  timeline = computed(() => {
    const card = this.selectedCardForDetail();
    if (!card) return [];
    const items: (KanbanComment | KanbanActivity)[] = [
      ...(card.comments || []),
      ...(card.activities || []),
    ];
    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  });

  ngOnInit() {
    if (this.workspaces().length > 0) {
      this.selectedWorkspaceId.set(this.workspaces()[0].id);
      const firstWs = this.workspaces()[0];
      if (firstWs.boardIds.length > 0) {
        this.selectedBoardId.set(firstWs.boardIds[0]);
      }
    }
  }

  getTasksForColumn(column: KanbanColumn): KanbanTask[] {
    const allTasks = this.tasks();
    if (!allTasks) return [];
    return column.taskIds.map(taskId => allTasks[taskId]).filter(Boolean).sort((a,b) => a.order - b.order);
  }

  getAgent(agentId: number): Agent | undefined {
    return this.agents().find(a => a.id === agentId);
  }

  drop(event: CdkDragDrop<KanbanTask[]>, columnId: string) {
    const task = event.item.data as KanbanTask;
    const previousColumn = this.columnsForSelectedBoard().find(c => c.id === event.previousContainer.id);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.app.updateKanbanColumnTasks(this.selectedBoardId()!, columnId, event.container.data.map(t => t.id));
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const sourceColumnId = event.previousContainer.id;
      const targetColumnId = event.container.id;
      
      this.app.moveKanbanTask(
        this.selectedBoardId()!,
        sourceColumnId,
        targetColumnId,
        event.previousContainer.data.map(t => t.id),
        event.container.data.map(t => t.id)
      );
      
      const targetColumn = this.columnsForSelectedBoard().find(c => c.id === targetColumnId);
      if (previousColumn && targetColumn) {
          const activity: KanbanActivity = {
              id: `act_${Date.now()}`,
              agentId: this.app.currentAgent().id,
              content: `moved this card from "${previousColumn.title}" to "${targetColumn.title}"`,
              timestamp: new Date().toISOString()
          };
          
          this.app.kanbanTasks.update(tasks => {
              const currentTask = tasks[task.id];
              if (currentTask) {
                  return { ...tasks, [task.id]: { ...currentTask, activities: [...(currentTask.activities || []), activity]}};
              }
              return tasks;
          });
      }
    }
  }

  handleCreateBoard(event: { title: string; workspaceId: string }) {
    this.app.handleCreateKanbanBoard(event);
  }

  // Card Detail Methods
  openCardDetail(task: KanbanTask) {
    this.selectedCardForDetail.set(task);
    this.editableCard.set(JSON.parse(JSON.stringify(task)));
    this.showCardDetailModal.set(true);
  }

  closeCardDetail() {
    this.showCardDetailModal.set(false);
    this.selectedCardForDetail.set(null);
    this.editableCard.set(null);
    this.newComment.set('');
  }

  handleCardUpdate() {
    const updatedCard = this.editableCard();
    if (updatedCard && updatedCard.id) {
      this.app.handleKanbanCardUpdate(updatedCard as KanbanTask);
      this.closeCardDetail();
    }
  }
  
  handleAddComment() {
    const content = this.newComment().trim();
    const card = this.selectedCardForDetail();
    if (!content || !card) return;

    const newComment: KanbanComment = {
      id: `comm_${Date.now()}`,
      agentId: this.app.currentAgent().id,
      content,
      timestamp: new Date().toISOString()
    };

    this.app.handleKanbanCardComment({ cardId: card.id, comment: newComment });
    
    this.selectedCardForDetail.update(currentCard => {
      if (!currentCard) return null;
      return { ...currentCard, comments: [...(currentCard.comments || []), newComment] };
    });
    this.editableCard.update(currentCard => {
        if (!currentCard) return null;
        return { ...currentCard, comments: [...(currentCard.comments || []), newComment] };
    });

    this.newComment.set('');
  }

  getLabel(labelId: string): KanbanLabel | undefined {
    return this.app.kanbanLabels().find(l => l.id === labelId);
  }

  isOverdue(dueDate: string | null): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }
  
  isAssigned(agentId: number): boolean {
    return this.editableCard()?.assigneeIds?.includes(agentId) ?? false;
  }
  
  toggleAssignee(agentId: number) {
    this.editableCard.update(card => {
        if (!card) return null;
        const currentAssignees = card.assigneeIds || [];
        const newAssignees = currentAssignees.includes(agentId) 
            ? currentAssignees.filter(id => id !== agentId)
            : [...currentAssignees, agentId];
        return { ...card, assigneeIds: newAssignees };
    });
  }
  
  hasLabel(labelId: string): boolean {
    return this.editableCard()?.labels?.includes(labelId) ?? false;
  }

  toggleLabel(labelId: string) {
    this.editableCard.update(card => {
        if (!card) return null;
        const currentLabels = card.labels || [];
        const newLabels = currentLabels.includes(labelId)
            ? currentLabels.filter(id => id !== labelId)
            : [...currentLabels, labelId];
        return { ...card, labels: newLabels };
    });
  }
}