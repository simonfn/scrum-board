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
  @Input() state: {id: string, name: string} = {id: '', name: ''};
  @Input() tasks: Task[] = [];
  @Output() showFormEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() updateTaskOrderEvent = new EventEmitter<{id: number, state: string, currIndex:number, newIndex: number}>();
  @Output() updateTaskStateOnMoveEvent = new EventEmitter<{id: number, currIndex: number, currState: string, newIndex: number, newState: string}>();

  addTask() {
    this.showFormEvent.emit(this.state.id);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
      this.updateTaskOrderEvent.emit({
        id: event.container.data[event.currentIndex].id,
        state: this.state.id,
        currIndex: event.previousIndex,
        newIndex: event.currentIndex
      });
      return;
    }
    const prevState = event.previousContainer.data[event.previousIndex].state;
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    this.updateTaskStateOnMoveEvent.emit({
      id: event.container.data[event.currentIndex].id,
      currIndex: event.previousIndex,
      currState: prevState,
      newIndex: event.currentIndex,
      newState: this.state.id
    });
  }
}
