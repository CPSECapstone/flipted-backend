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
      course: "Integrated Science"
    }
  )
}
```

#### Get Objective By Course and Objective Id

```
query {
  objective(course: "Integrated Science", objectiveId: "241a5a69f38") {
    objectiveId
    name
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
    name
    description
    targetId
    targetName
    course
  }
}
```


student
  learning target1
    task1 - progress
    task2 - progress
  learning target2
    task21 - progress
    task22 - progress
