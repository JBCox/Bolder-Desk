import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KanbanWorkspace } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-new-kanban-board-modal',
  standalone: true,
  templateUrl: './new-kanban-board-modal.component.html',
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewKanbanBoardModalComponent {
  workspaces = input.required<KanbanWorkspace[]>();
  close = output<void>();
  create = output<{ title: string; workspaceId: string }>();

  boardTitle = signal('');
  selectedWorkspaceId = signal<string>('');

  ngOnInit() {
    // Pre-select the first workspace if available
    if (this.workspaces().length > 0) {
      this.selectedWorkspaceId.set(this.workspaces()[0].id);
    }
  }

  handleCreate() {
    if (this.boardTitle().trim() && this.selectedWorkspaceId()) {
      this.create.emit({ title: this.boardTitle(), workspaceId: this.selectedWorkspaceId() });
    }
  }
}
