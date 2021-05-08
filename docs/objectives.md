## Learning Objective

### APIs

-  Add Objective
-  Get Objective By Objective Id
-  List Objectives By Course

### Examples

#### Add Objective

```
mutation {
  addObjective(
    objective: {
      objectiveName: "TE 1"
      description: "Develop a model that predicts and describes changes in particle motion, temperature, and state of a pure substance when thermal energy is added or removed."
      targetId: "target Id"
      targetName: "TE",
      course: "Integrated Science",
      taskIds: ["0970586df34", "09b24574eeb"]
    }
  )
}
```

#### Get Objective By Course and Objective Id

```
query {
  objective(objectiveId: "0ced074cef8") {
    objectiveId
    objectiveName
    description
    targetId
    targetName
    course
  }
}
```

#### List Objectives By Course

```
query {
  objectives(course: "Integrated Science") {
    objectiveId
    objectiveName
    description
    targetId
    targetName
    course
  }
}
```
