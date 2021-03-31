### GraphQL examples

### Add a Task

```
mutation {
  addTask(task: {
    name: "Exciting Task"
    description: "You are going to be excited"
    link: "Google.com"
  }) {
    name
    description
    link
  }
}

# get tasks
{
  tasks {
    id
    name
    description
    link
  }
}
```

### Missions

```
mutation {
  addMission(mission: {
    name: "New Mission",
    description: "Mission to do",
    tasks: []
  }) {
    id
    name
    description
  }
}

# getMissions
{
  missions {
    id
    name
    description
    tasks {
      id
      name
      description
      link
    }
  }
}
```

### Courses

```
# addCourse
mutation {
  addCourse(course: {
    name: "English 131"
    instructor: "Dr. Fauci"
    description: "Writing and Rhetoric Stretch",
    missions:[]
  }) {
    name
    instructor
    description
  }
}

# getCourses
{
  courses {
    id
    name
    instructor
    description
  }
}
```

### Quiz

```
query GetQuizById {
  quiz(id: "e589e36fb7d") {
    id
    course
  	name
    instructions
    totalPoints
  }
}

mutation {
  addQuiz(
    quiz: {
      course: "History"
      name: "A Game of Thrones"
      instructions: "Long ago, in a time forgotten, a preternatural event threw the seasons out of balance"
      totalPoints: 100
    }
  ) {
    id
    course
    name
    totalPoints
  }
}

```

### QuizSubmissions

```
query ListQuizSubmissionsByQuizId {
  quizSubmissions(quizId: "8989d1faaef") {
    id
    student
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

mutation {
  submitQuiz(submission: {
    student: "Robb Stark"
    quiz: "8989d1faaef"
    choices:[]
  }) {
    student
    quiz {
      name
      totalPoints
    }
    points
  }
}
```
