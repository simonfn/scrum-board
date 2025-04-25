import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../task';

@Component({
  selector: 'app-column',
  imports: [],
  templateUrl: './column.component.html',
  styleUrl: './column.component.css'
})
export class ColumnComponent {
  @Input() state: string = '';
  @Input() tasks: Task[] = [];
  @Output() showFormEvent: EventEmitter<string> = new EventEmitter<string>();

  addTask() {
    this.showFormEvent.emit(this.state);
  }
}
