## Tasks

### APIs

+ Add Task
+ Get Task By Id
+ List Tasks By SubMissionId

### Examples

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
