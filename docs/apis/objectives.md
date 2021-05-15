# Objectives

## APIs

* Add Objective
* Get Objective By Objective Id
* List Objectives By Course

## Examples

### Add Objective

```text
mutation {
  addObjective(
    objective: {
      objectiveName: "TE 1"
      description: "Develop a model that predicts and describes changes in particle motion, temperature, and state of a pure substance when thermal energy is added or removed."
      targetId: "target Id"
      targetName: "TE",
      course: "Integrated Science",
      taskIds: ["462f0f1ac94", "5cf57356c1b"]
    }
  )
}
```

### Get Objective By Course and Objective Id

```text
query {
  objective(objectiveId: "8fc4fc68c84") {
    objectiveId
    objectiveName
    description
    targetId
    targetName
    course
  }
}
```

### List Objectives By Course

```text
query {
  objectives(course: "Integrated Science") {
    objectiveId
    objectiveName
    description
    targetId
    targetName
    course
    tasks {
       id
       name
    }
  }
}
```
