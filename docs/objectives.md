## Learning Objective

### APIs

-  Add Objective
-  Get Objective By Course and Objective Id
-  List Objectives By Course

### Examples

#### Add Objective

```
mutation {
  addObjective(
    objective: {
      name: "TE 1"
      description: "Develop a model that predicts and describes changes in particle motion, temperature, and state of a pure substance when thermal energy is added or removed."
      targetId: "targetId",
      targetName: "TE",
      courseName: "Integrated Science"
    }
  )
}
```

#### Get Objective By Course and Objective Id

```
query {
  objective(courseName: "Integrated Science", objectiveName: "TE 1") {
    objectiveId
    name
    description
    targetId
    targetName
    courseName
  }
}
```

#### List Objectives By Course

```
query {
  objectives(courseName: "Integrated Science") {
    objectiveId
    name
    description
    targetId
    targetName
    courseName
  }
}
```
