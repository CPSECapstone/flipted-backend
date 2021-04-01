## GraphQL endpoints

```
https://bz4ubl4t4e.execute-api.us-east-1.amazonaws.com/dev/graphql
```

## APIs

- Quiz

  - Add Quiz
  - Get Quiz By Quiz Id

- Questions

  - Add Questions
  - Get Question By Id
  - List Questions By Quiz Id

- Answers

  - Add Answer
  - Get Answer By Question Id
  - List Answers By Quiz Id

- Submission

  - Add Submission
  - Get Quiz Submission By Submission Id
  - List Quiz Submissions By Quiz Id

### Examples

#### Quiz

```
mutation {
  addQuiz(
    quiz: {
      course: "Botany 101"
      name: "Week 1 quiz"
      instructions: "What kind of information can be deducted from the rings of a tree? Select all that apply"
    }
  )
}

query GetQuizById {
  quiz(quizId: "e589e36fb7d") {
    id
    course
  	name
    instructions
  }
}
```

#### Quiz Questions

```
mutation {
  addQuestion(
    question: {
      quizId: "3f1e9fe5b43"
      points: 2
      description: "produces CO2 and water"
        options: [
          "Pollination",
          "Reduction",
          "Pollination",
          "Pericarp",
        ]
        answers: [
          2
        ]
    }
  )
}

query GetQuestionById {
  question(questionId: "9e9c9625643") {
    id
    quizId
  	description
    options {
      id
      description
    }
    answers
    points
  }
}

query ListQuizQuestionsByQuizId {
  question(quizId: "5af71953871") {
    id
    quizId
  	description
    options {
      id
      description
    }
    answers
    points
  }
}
```

#### Quiz Answers

```
mutation {
  addAnswer(
    answer: {
      id: "9e9c9625643"
      quizId: "3f1e9fe5b43"
      choices: ["56fb64391ce"]
    }
  )
}

query GetQuizAnswerById {
  quizAnswer(questionId: "9e9c9625643") {
    id
    quizId
    choices
  }
}

query ListQuizAnswerssByQuizId {
  quizAnswers(quizId: "3f1e9fe5b43") {
    id
    quizId
    choices
  }
}
```

#### Quiz Submissions

```
mutation {
  addSubmission(submission: {
    student: "Robb Stark"
    quizId: "8989d1faaef"
    answers:[{
      questionId: "9e9c9625643",
      choices: [
        "1ef1a16dd87"
      ]
    }]
  }) {
    student
    quiz {
      name
    }
    points
  }
}

query GetQuizSubmissionById {
  quizSubmission(id: "a9c8e50acae") {
    id
    student
    points
  }
}

query ListQuizSubmissionsByQuizId {
  quizSubmissions(quizId: "8989d1faaef") {
    id
    student
    points
  }
}
```
