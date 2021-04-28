## Learning Objective

### APIs

-  Add Learning Objective
-  List Learning Objectives By Course

### Examples

#### Add Learning Objective

```
mutation {
  addLearningObjective(
    objective: {
      course: "Biology",
      name: "Obtaining And Evaluating Information Introduction"
      description: "This objective is about obtaining and evaluating information"
    }
  )
}
```

#### List Learning Objectives By Course

```
query {
  learningObjectives(course: "Biology") {
    id
    course
    name
    description
  }
}
```
