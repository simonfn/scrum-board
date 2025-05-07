from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel


class Task(BaseModel):
    id: int
    name: str
    description: str
    state: str


app = FastAPI()

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client.scrumboard
student_collection = db.get_collection("tasks")

tasksByState: dict = {
    "todo": [],
    "in-progress": [],
    "done": []
}

@app.get("/tasks", response_model=list[Task])
async def get_tasks() -> list[Task]:
    pass
    # acc: list[Task] = []
    # for state, tasks in tasksByState.items():
    #     for task in tasks:
    #         acc.append(task)
    # return acc
  
async def getTaskById(id: int) -> Task | None:
    pass
#     for(const [state, tasks] of this.tasksByState.entries()) {
#       const task = tasks.find(task => task.id === id);
#       if (task) {
#         return task;
#       }
#     }
#     return undefined;

async def addTask(task: Task) -> None:
    pass
    # const tasks = this.getTasksByState(task.state);
    # if (tasks.length) {
    #   task.id = new Date().getTime();
    #   tasks.push(task);
    # }

async def getTasksByState(state: str) -> list[Task]:
    pass
    # return this.tasksByState.get(state) || [];

async def updateTaskInfo(id: number, updatedTask: Task) -> None:
    pass
    # const task = this.getTaskById(id);
    # if (!task)
    #   return;
    # if(task?.state && task?.state !== updatedTask.state!) {
    #   const tasks = this.getTasksByState(task.state);
    #   if(!tasks)
    #     return;
    #   // Remove the task from the old state
    #   const taskIndex = tasks.findIndex(t => t.id === id);
    #   if (taskIndex !== -1) {
    #     tasks.splice(taskIndex, 1);
    #   }

    #   this.tasksByState.get(updatedTask.state!)?.push(task);
    # }
    # Object.assign(task, updatedTask);


async def updateTaskOrder(id: int, state: str, currIndex:int, newIndex: int) -> None:
    pass
    # const tasks = this.getTasksByState(state);
    # if(!tasks)
    #   return;
    # const task = tasks?.at(currIndex);
    # if (task?.id !== id)
    #   return;
    # tasks.splice(currIndex, 1);
    # tasks.splice(newIndex, 0, task);
  
async def updateTaskStateInArray(id: int, currIndex: int, currState: str, newIndex: int, newState: str) -> None:
    pass
    # const tasksInCurrState = this.getTasksByState(currState);
    # if(!tasksInCurrState)
    #   return;
    # const task = tasksInCurrState?.at(currIndex);
    # if (task?.id !== id)
    #   return;
    # const tasksInNewState = this.getTasksByState(newState);
    # if(!tasksInNewState)
    #   return;
    # tasksInCurrState.splice(currIndex, 1);
    # task.state = newState;
    # tasksInNewState.splice(newIndex, 0, task);

