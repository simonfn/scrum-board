import { Injectable } from '@angular/core';
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private states: string[] = ['To Do', 'In Progress', 'Done'];
  private mockTasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'Description 1', state: 'To Do'},
    { id: 2, title: 'Task 2', description: 'Description 2', state: 'In Progress'},
    { id: 3, title: 'Task 3', description: 'Description 3', state: 'Done'},
    { id: 4, title: 'Task 4', description: 'Description 4', state: 'To Do'},
    { id: 5, title: 'Task 5', description: 'Description 5', state: 'In Progress'},
    { id: 6, title: 'Task 6', description: 'Description 6', state: 'Done'}
  ];
  private tasksByState: Map<string, Task[]>;

  constructor() {
    this.tasksByState = this.states.reduce((acc, state) => {
      acc.set(state, this.mockTasks.filter(task => task.state === state));
      return acc;
    }, new Map<string, Task[]>());  
   }

  getStates(): string[] {
    return this.states;
  }

  getTasks(): Task[] {
    const acc: Task[] = [];
    for(const [state, tasks] of this.tasksByState.entries()) {
      acc.push(...tasks);
    }
    return acc;
  }
  getTaskById(id: number): Task | undefined {
    for(const [state, tasks] of this.tasksByState.entries()) {
      const task = tasks.find(task => task.id === id);
      if (task) {
        return task;
      }
    }
    return undefined;
  }
  addTask(task: Task): void {
    const tasks = this.getTasksByState(task.state);
    if (tasks.length) {
      task.id = new Date().getTime();
      tasks.push(task);
    }
  }
  getTasksByState(state: string): Task[] {
    return this.tasksByState.get(state) || [];
  }
  updateTaskInfo(id: number, updatedTask: Partial<Task>): void {
    const task = this.getTaskById(id);
    if (!task)
      return;
    if(task?.state && task?.state !== updatedTask.state!) {
      const tasks = this.getTasksByState(task.state);
      if(!tasks)
        return;
      // Remove the task from the old state
      const taskIndex = tasks.findIndex(t => t.id === id);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
      }

      this.tasksByState.get(updatedTask.state!)?.push(task);
    }
    Object.assign(task, updatedTask);
  }

  updateTaskOrder(id: number, state: string, currIndex:number, newIndex: number): void {
    const tasks = this.getTasksByState(state);
    if(!tasks)
      return;
    const task = tasks?.at(currIndex);
    if (task?.id !== id)
      return;
    tasks.splice(currIndex, 1);
    tasks.splice(newIndex, 0, task);
  }

  updateTaskStateInArray(id: number, currIndex: number, currState: string, newIndex: number, newState: string): void {
    const tasksInCurrState = this.getTasksByState(currState);
    if(!tasksInCurrState)
      return;
    const task = tasksInCurrState?.at(currIndex);
    if (task?.id !== id)
      return;
    const tasksInNewState = this.getTasksByState(newState);
    if(!tasksInNewState)
      return;
    tasksInCurrState.splice(currIndex, 1);
    task.state = newState;
    tasksInNewState.splice(newIndex, 0, task);
  }
}
