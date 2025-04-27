import { Component, inject, ViewChild } from '@angular/core';
import { ColumnComponent } from '../column/column.component';
import { Task } from '../task';
import { TasksService } from '../tasks.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  imports: [ColumnComponent, TaskFormComponent, CdkDropListGroup],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
    private tasksService = inject(TasksService);
    states = this.tasksService.getStates();
    
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

    updateTask({id, task}: {id: number, task: Partial<Task>}) {
        this.tasksService.updateTaskInfo(id, task);
    }

    updateTaskOrder({id, state, currIndex, newIndex}: {id: number, state: string, currIndex:number, newIndex: number}): void {
        this.tasksService.updateTaskOrder(id, state, currIndex, newIndex);
    }
    updateTaskStateOnMove({id, currIndex, currState, newIndex, newState}: {id: number, currIndex: number, currState: string, newIndex: number, newState: string}): void {
        this.tasksService.updateTaskStateInArray(id, currIndex, currState, newIndex, newState);
    }
}
