## Quiz Task Submission

### APIs

- Submit Task
- Submit Progress Towards a Task
- Submit Multiple Choice question
- Submit Free Response question

### Examples

#### Submit Multiple Choice Question
```
mutation saveMultipleChoiceProgress {
  saveMultipleChoiceProgress(mcBlockInput: {
    taskId: "c5110abd8c4"
    questionBlockId: "b849cefb7cc"
    questionId: "MC_QUESTION#a9bfcb78e7d"
    answerId: 3
  })
}
```

#### Submit Free Response Question
```
mutation saveFreeResponseProgress {
  saveFreeResponseProgress(frBlockInput: {
    taskId: "c5110abd8c4"
    questionBlockId: "b849cefb7cc"
    questionId: "FR_QUESTION#c375b5a56f8"
    answer:"POTATO"
  })
}
```

#### Submit Progress Towards a Task
```
mutation submitTaskProgress {
  submitTaskProgress(taskProgress: {
    taskId: "f11589920bf"
    finishedBlockIds: ["8e1abeb0b94", "bf30375842a", "33c7eb99d37"]
  })
}
```

#### Submit Task
```
mutation submitTask {
  submitTask(taskId: "c5110abd8c4"){
    pointsAwarded
    pointsPossible
  	graded
    teacherComment
    questionAndAnswers {
      answer {
        pointsAwarded
      	answer
      }
      question {
        id
        points
        ... on FRQuestion {
          description
          id
        }
        ... on MCQuestion {
          description
          options {
            description
            id
          }
          id
        }
      }
    }
  }
}
```