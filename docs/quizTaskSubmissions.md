## Quiz Task Submission

### APIs

- Add Task Submission
- Get Quiz Task Submission By Submission Id
- List Quiz Task Submissions By Task Id

### Examples

#### Add Task Submission

```
mutation {
  addSubmission(
    submission: {
      student: "Robb Stark"
      quizId: "3f1e9fe5b43"
      answers: [
        { questionId: "14bb90666b1", choices: ["771d7a8a269"] }
        { questionId: "a915872ccab", choices: ["e7ce8f84537"] }
        { questionId: "026c841f9f5", choices: ["b1e3993f7c9"] }
      ]
    }
  )
}
```

#### Get Quiz Task Submission By Submission Id

```
query {
  quizSubmission(submissionId: "085f2b83902") {
    submission {
      id
      student
      points
    }
    quiz {
      name
      instructions
    }
    questions {
      id
      description
      options {
        description
      }
    }
  }
}
```

#### List Quiz Task Submissions By Task Id

```
query  {
  quizSubmissions(quizId: "3f1e9fe5b43") {
    id
    student
    points
  }
}
```
