import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanBoard, KanbanWorkspace } from '../../models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-kanban',
  standalone: true,
  templateUrl: './kanban.component.html',
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanComponent {
  workspaces = input.required<KanbanWorkspace[]>();
  boards = input.required<KanbanBoard[]>();
  createBoardRequest = output<void>();
  viewBoard = output<string>(); // board id

  getBoardsForWorkspace(workspaceId: string): KanbanBoard[] {
    return this.boards().filter(b => b.workspaceId === workspaceId);
  }
}