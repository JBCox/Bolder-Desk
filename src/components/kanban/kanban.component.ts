import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KanbanBoard, KanbanList, KanbanCard, KanbanWorkspace, Agent } from '../../models';
import { IconComponent } from '../icon/icon.component';
import { AppComponent } from '../../app.component';
import { NewKanbanBoardModalComponent } from '../new-kanban-board-modal/new-kanban-board-modal.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, NewKanbanBoardModalComponent],
  templateUrl: './kanban.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanComponent {
  private app = inject(AppComponent);

  workspaces = this.app.kanbanWorkspaces;
  boards = this.app.kanbanBoards;
  lists = this.app.kanbanLists;
  cards = this.app.kanbanCards;
  agents = this.app.agents;

  selectedBoard = signal<KanbanBoard | null>(null);
  draggedCard = signal<KanbanCard | null>(null);
  showNewBoardModal = signal(false);

  // UI state for inline forms
  showAddCardForm = signal<string | null>(null);
  showAddListForm = signal<boolean>(false);
  newCardTitle = signal('');
  newListTitle = signal('');

  boardsByWorkspace = computed(() => (workspaceId: string) => {
    return this.boards().filter(b => b.workspaceId === workspaceId);
  });

  listsForBoard = computed(() => {
    const board = this.selectedBoard();
    if (!board) return [];
    return this.lists().filter(l => l.boardId === board.id).sort((a, b) => a.order - b.order);
  });
  
  listsWithCards = computed(() => {
    const lists = this.listsForBoard();
    const allCards = this.cards();
    return lists.map(list => ({
      ...list,
      cards: allCards
        .filter(card => card.listId === list.id)
        .sort((a, b) => a.order - b.order)
    }));
  });

  selectBoard(board: KanbanBoard | null) {
    this.selectedBoard.set(board);
  }

  addList(title: string) {
    const boardId = this.selectedBoard()?.id;
    if (!title.trim() || !boardId) return;

    const newList: KanbanList = {
      id: `list_${Date.now()}`,
      title,
      boardId,
      order: this.listsForBoard().length,
      cards: [],
    };
    this.lists.update(lists => [...lists, newList]);
  }

  addCard(listId: string, title: string) {
    const boardId = this.selectedBoard()?.id;
    if (!title.trim() || !boardId) return;
    
    const newCard: KanbanCard = {
      id: `card_${Date.now()}`,
      title,
      listId,
      boardId,
      order: this.cards().filter(c => c.listId === listId).length,
    };
    this.cards.update(cards => [...cards, newCard]);
  }

  handleAddList() {
    if (this.newListTitle().trim()) {
      this.addList(this.newListTitle());
      this.newListTitle.set('');
      this.showAddListForm.set(false);
    }
  }

  handleAddCard(listId: string) {
    if (this.newCardTitle().trim()) {
      this.addCard(listId, this.newCardTitle());
      this.newCardTitle.set('');
      // Keep the form open to add another card quickly, if desired
      // this.showAddCardForm.set(null);
    }
  }
  
  handleCreateBoard(data: { title: string; workspaceId: string }) {
    const newBoard: KanbanBoard = {
      id: `board_${Date.now()}`,
      title: data.title,
      workspaceId: data.workspaceId,
      lists: []
    };
    this.boards.update(boards => [...boards, newBoard]);
    this.selectBoard(newBoard);
    this.showNewBoardModal.set(false);
  }

  // --- Drag and Drop ---
  handleDragStart(event: DragEvent, card: KanbanCard) {
    this.draggedCard.set(card);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', card.id);
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  handleDrop(event: DragEvent, targetListId: string) {
    event.preventDefault();
    const card = this.draggedCard();
    if (!card || card.listId === targetListId) {
      this.draggedCard.set(null);
      return;
    }

    this.cards.update(cards => 
      cards.map(c => c.id === card.id ? { ...c, listId: targetListId } : c)
    );
    
    this.draggedCard.set(null);
  }
  
  // --- Helpers ---
  getAgent(id: number): Agent | undefined {
      return this.agents().find(a => a.id === id);
  }

  getAgentName(id: number): string {
    return this.getAgent(id)?.name || 'Unknown';
  }

  getAgentInitials(id: number): string {
    const name = this.getAgentName(id);
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}