## Questions

### APIs

- Add Question
- Add Questions To Task
- List Questions By Task Id

### Examples

#### Add Question

```
mutation {
  addQuestion(
    question: {
      points: 2
      description: "Ginger is a stem and not a root because"
      options: [
        "It lacks chlorophyll"
        "It stores food material"
        "It has notes and internodes"
        "It grows horizontally in the soil"
      ]
      answers: [3]
    }
  )
}
```

#### Add Questions To Task

```
mutation {
  addQuestionsToTask(questionIds: [
    "9b0bf81d04e",
    "2a13ccac15a",
    "0501d7b68f4"
    ],
    taskId: "baced0ec648")
}
```

#### List Questions By Task Id

```
query {
  questions(taskId: "30b931d1f75") {
    id
    description
    options {
      id
      description
    }
    points
    answers
  }
}
```
