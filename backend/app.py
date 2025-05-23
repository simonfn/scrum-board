from typing import Optional
from bson import ObjectId
from fastapi import FastAPI
from pydantic import BaseModel
import os
import motor.motor_asyncio


class Task(BaseModel):
    id: str
    title: str
    description: str
    state: str

class CreateTask(BaseModel):
    title: str
    description: str
    state: str

class TaskState(BaseModel):
    id: str
    name: str

class TaskOrderUpdate(BaseModel):
    currState: str
    currIndex: int
    newState: str
    newIndex: int


app = FastAPI()
client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGO_URI"])
db = client.scrumboard
tasks_collection = db.get_collection("tasks")
task_order_collection = db.get_collection("taskOrder")

STATES: list[TaskState] = [
    TaskState(id='todo', name='To Do'),
    TaskState(id='in-progress', name='In Progress'),
    TaskState(id='done', name='Done')
]


# @app.on_event("startup")
# async def initialize_task_order():
    # existing_order = await task_order_collection.find_one({"_id": "order-tracker"})
    # if not existing_order:
    #     tasks_order_initial = {state["id"]: [] for state in STATES}
    #     tasks_order_initial["_id"] = "order-tracker"
    #     await task_order_collection.insert_one(tasks_order_initial)

@app.get("/states", response_model=list[TaskState])
async def get_states() -> list[TaskState]:
    return STATES

@app.get("/tasks", response_model=dict[str, list[Task]])
async def get_tasks() -> dict[str, list[Task]]:
    tasks_by_state = {state.id: [] for state in STATES}
    tasks_order = await task_order_collection.find_one({"_id": "order-tracker"})
    if not tasks_order:
        return tasks_by_state
    
    for state in tasks_by_state.keys():
        ordered_task_ids = tasks_order.get(state, [])
        
        if not ordered_task_ids:
            continue
        unordered_tasks = await tasks_collection.find({"_id": {"$in": ordered_task_ids}}).to_list(length=None)
        
        ordered_tasks = sorted(
            unordered_tasks,
            key=lambda task: ordered_task_ids.index(task["_id"])
        )

        tasks_by_state[state] = [Task(**{**task, 'id':str(task['_id'])}) for task in ordered_tasks]
    
    return tasks_by_state


@app.post("/tasks", response_model=Task)
async def add_task(task: CreateTask) -> Task:
    task_doc = task.dict()
    result = await tasks_collection.insert_one(task_doc)
    task_id = result.inserted_id
    
    # Update the task order
    await task_order_collection.update_one(
        {"_id": "order-tracker"},
        {"$push": {task.state: task_id}}
    )
    
    return Task(**{**task_doc, "id":str(task_id)})

@app.put("/tasks/{task_id}")
async def update_task_position(task_id: str, update: TaskOrderUpdate) -> None:
    task_id = ObjectId(task_id)
    currState = update.currState
    currIndex = update.currIndex
    newState = update.newState
    newIndex = update.newIndex
    
    # Update the task order in the database
    log = await task_order_collection.update_one(
        {"_id": "order-tracker"},
        {"$pull": {currState: task_id}}
    )
    log = await task_order_collection.update_one(
        {"_id": "order-tracker"},
        {"$push": {
            newState: {
                "$each": [task_id],
                "$position": newIndex
            }
        }}
    )

    # Update the task state in the database
    log = await tasks_collection.update_one(
        {"_id": task_id},
        {"$set": {"state": newState}}
    )
