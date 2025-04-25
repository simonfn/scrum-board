import { Injectable } from '@angular/core';
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private tasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'Description 1', state: 'To Do' },
    { id: 2, title: 'Task 2', description: 'Description 2', state: 'In Progress' },
    { id: 3, title: 'Task 3', description: 'Description 3', state: 'Done' },
    { id: 4, title: 'Task 4', description: 'Description 4', state: 'To Do' },
    { id: 5, title: 'Task 5', description: 'Description 5', state: 'In Progress' },
    { id: 6, title: 'Task 6', description: 'Description 6', state: 'Done' }
  ];

  constructor() { }

  getTasks(): Task[] {
    return this.tasks;
  }
  getTaskById(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }
  addTask(task: Task): void {
    this.tasks.push(task);
  }
  getTasksByState(state: string): Task[] {
    return this.tasks.filter(task => task.state === state);
  }
  updateTaskState(id: number, newState: string): void {
    const task = this.getTaskById(id);
    if (task) {
      task.state = newState;
    }
  }
}
