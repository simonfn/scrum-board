import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../task';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-column',
  imports: [CdkDropList, CdkDrag],
  templateUrl: './column.component.html',
  styleUrl: './column.component.css'
})
export class ColumnComponent {
  @Input() state: string = '';
  @Input() tasks: Task[] = [];
  @Output() showFormEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() updateTaskStateEvent = new EventEmitter<{id: number, state: string}>();

  addTask() {
    this.showFormEvent.emit(this.state);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    this.updateTaskStateEvent.emit({
      id: event.container.data[event.currentIndex].id,
      state: this.state,
    });
  }
}
