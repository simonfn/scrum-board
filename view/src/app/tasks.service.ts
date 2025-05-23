import { inject, Injectable, resource, ResourceRef } from '@angular/core';
import { Task } from './task';
import { TaskState } from './task-state';
import { HttpClient } from '@angular/common/http';
import { CreateTask } from './create-task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private readonly http: HttpClient = inject(HttpClient);
  private apiUrl = '/api';
  private statesResourceRef: ResourceRef<TaskState[] | undefined>;
  private tasksResourceRef: ResourceRef<Map<string, Task[]> | undefined>;

  constructor() {
    this.statesResourceRef = resource({
      loader: (): Promise<TaskState[]> => {
        return fetch(`${this.apiUrl}/states`)
          .then(async response => {
            const res = await response.json();
            return res;
          });
      }
    });
    this.tasksResourceRef = resource({
      loader: (): Promise<Map<string, Task[]>> => {
        return fetch(`${this.apiUrl}/tasks`)
          .then(async response => {
            const res = await response.json();
            return new Map(Object.entries(res));
          });
      }
    });
  }

  getStates(): ResourceRef<TaskState[] | undefined> {
    return this.statesResourceRef;
  }
  
  getTasks(): ResourceRef<Map<string, Task[]> | undefined> {
    return this.tasksResourceRef;
  }

  addTask(taskInfo: CreateTask): void {
    this.http.post(`${this.apiUrl}/tasks`, taskInfo).subscribe({
      next: (confirmedTask) => { 
        const tasks = this.tasksResourceRef.value()?.get(taskInfo.state);
        if (tasks) {
          tasks.push(confirmedTask as Task);
        }
      },
      error: err => console.error('Add task failed', err)
    });
  }

  updateTaskOrder(id: string, state: string, currIndex:number, newIndex: number): void {
    this.http.put(`${this.apiUrl}/tasks/${id}`, { currState: state, currIndex, newState: state, newIndex }).subscribe({
      next: () => {},
      error: err => console.error('Update Order failed', err)
    });
  }

  updateTaskStateInArray(id: string, currIndex: number, currState: string, newIndex: number, newState: string): void {
    this.http.put(`${this.apiUrl}/tasks/${id}`, { currState, currIndex, newState, newIndex }).subscribe({
      next: () => {},
      error: err => console.error('Update order through states failed', err)
    });
  }
}
