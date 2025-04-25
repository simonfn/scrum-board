import { Component, inject, ViewChild } from '@angular/core';
import { ColumnComponent } from '../column/column.component';
import { Task } from '../task';
import { TasksService } from '../tasks.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-board',
  imports: [ColumnComponent, TaskFormComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
    private tasksService = inject(TasksService);
    states: string[] = ['To Do', 'In Progress', 'Done'];
    @ViewChild('taskFormApp') taskForm!: TaskFormComponent;

    getTasksByState(state: string): Task[] {
        return this.tasksService.getTasksByState(state);
    }

    showForm(defaultState: string){
        this.taskForm.toggleVisibility(defaultState);
    }

    submitTask(task: Task) {
        this.tasksService.addTask(task);
    }
}
