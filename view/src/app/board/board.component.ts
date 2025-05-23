import { Component, computed, effect, inject, ResourceRef, Signal, ViewChild } from '@angular/core';
import { ColumnComponent } from '../column/column.component';
import { Task } from '../task';
import { TasksService } from '../tasks.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { TaskState } from '../task-state';
import { CreateTask } from '../create-task';

@Component({
  selector: 'app-board',
  imports: [ColumnComponent, TaskFormComponent, CdkDropListGroup],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
    private tasksService = inject(TasksService);
    public statesResource: ResourceRef<TaskState[] | void>;
    public tasksResource: ResourceRef<Map<string, Task[]> | void>;
    public states: Signal<TaskState[]> = computed(() => {
        const states = this.statesResource.value();
        if (states) {
            return states;
        }
        return [];
    });
    public tasks: Signal<Map<string, Task[]>> = computed(() => {
        const tasks = this.tasksResource.value();
        if (tasks) {
            return tasks;
        }
        return new Map<string, Task[]>();
    });
    
    @ViewChild('taskFormApp') taskForm!: TaskFormComponent;

    constructor() {
        this.statesResource = this.tasksService.getStates();
        this.tasksResource = this.tasksService.getTasks();
    }



    getTasksByState(state: string): Task[] {
        const tasksMap = this.tasks();
        
        if (tasksMap instanceof Map) {
            return tasksMap.get(state) || [];
        }
        return [];
    }

    showForm(defaultState: string){
        this.taskForm.toggleVisibility(defaultState);
    }

    submitTask(task: CreateTask) {
        const tasks = this.getTasksByState(task.state);
        this.tasksService.addTask(task);
    }

    updateTaskOrder({id, state, currIndex, newIndex}: {id: string, state: string, currIndex:number, newIndex: number}): void {
        const tasks = this.getTasksByState(state);
        if(!tasks.length)
            return;
        const task = tasks?.at(newIndex);
        if (task?.id !== id)
            return; // should revert
        this.tasksService.updateTaskOrder(id, state, currIndex, newIndex);
    }
    updateTaskStateOnMove({id, currIndex, currState, newIndex, newState}: {id: string, currIndex: number, currState: string, newIndex: number, newState: string}): void {
        const tasks = this.getTasksByState(newState);
        if(!tasks.length)
            return;
        const task = tasks?.at(newIndex);
        if (task?.id !== id)
            return; // should revert
        this.tasksService.updateTaskStateInArray(id, currIndex, currState, newIndex, newState);
    }
}
