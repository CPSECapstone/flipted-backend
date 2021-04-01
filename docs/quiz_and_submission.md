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

mutation {
  addQuestion(
    question: {
      quizId: "3f1e9fe5b43"
      points: 2
      description: "tissue that stores food or water"
        options: [
          "interphase",
          "fibrous root",
          "root cap",
          "root cortex",
        ]
        answers: [
          2
        ]
    }
  )
}

mutation {
  addQuestion(
    question: {
      quizId: "3f1e9fe5b43"
      points: 2
      description: "During photosynthesis green plants absorb"
        options: [
          "oxygen",
          "nitrogen",
          "carbon monoxide",
          "carbon dioxide",
        ]
        answers: [
          4
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
  questions(quizId: "3f1e9fe5b43") {
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

mutation {
  addSubmission(
    submission: {
      student: "Sansa Stark"
      quizId: "3f1e9fe5b43"
      answers: [
        { questionId: "14bb90666b1", choices: ["771d7a8a269"] }
        { questionId: "a915872ccab", choices: ["e7ce8f84537"] }
        { questionId: "026c841f9f5", choices: ["9ae89eb9d16"] }
      ]
    }
  )
}

mutation {
  addSubmission(
    submission: {
      student: "Arya Stark"
      quizId: "3f1e9fe5b43"
      answers: [
        { questionId: "14bb90666b1", choices: ["771d7a8a269"] }
        { questionId: "a915872ccab", choices: ["e7ce8f84537"] }
        { questionId: "026c841f9f5", choices: ["9ae89eb9d16"] }
      ]
    }
  )
}


query GetQuizSubmissionById {
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

query ListQuizSubmissionsByQuizId {
  quizSubmissions(quizId: "3f1e9fe5b43") {
    id
    student
    points
  }
}
```
