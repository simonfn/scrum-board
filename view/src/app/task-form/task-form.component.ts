import { Component, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../task';
import { TaskState } from '../task-state';
import { CreateTask } from '../create-task';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  @ViewChild('modalForm') modalForm: any;
  @ViewChild('selectState') selectState!: any;
  @Input() states: TaskState[] | void = [];
  @Output() submitEvent: EventEmitter<CreateTask> = new EventEmitter<CreateTask>();

  taskForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required)
  });

  toggleVisibility(defaultState: string) {
    this.taskForm.get('state')?.setValue(defaultState);
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const task: CreateTask = { ...this.taskForm.value };
    this.submitEvent.emit(task);
    this.taskForm.reset();
  }

  onClose() {
    this.taskForm.reset();
  }
}
