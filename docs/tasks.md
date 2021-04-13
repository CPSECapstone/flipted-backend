## Tasks

### APIs

- Add Task
- Get Task By Id
- List Tasks By SubMission Id

### Examples

#### Add Task

```
mutation {
  addTask(
    task: {
      name: "Task name"
      instructions: "Task instructions"
      subMissionId: "Task subMissionId"
    }
  )
}
```

#### Get Task By Id

```
query {
  task(taskId: "e0b607e30a7") {
    id
    name
    instructions
    subMissionId
  }
}
```

#### List Tasks By SubMission Id

```
query {
  tasks(subMissionId: "sub-mission 1") {
    id
    name
    instructions
    subMissionId
  }
}
```
