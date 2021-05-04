## User Progress

### APIs

- Add Progress
- List Progress By User And Course
- List Progress By Course

### Examples

#### Add Progress

```graphql
mutation {
  addProgress(
    progress: {
      userName: "Tywin Lannister"
      course: "Integrated Science"
      taskId: "0871dc9d56f"
      status: true
    }
  )
}
```

#### List Progress By User And Course

```graphql
query {
  progressByUserAndCourse(
    userName: "Tywin Lannister"
    course: "Integrated Science"
  ) {
    userName
    course
    taskId
    status
  }
}
```

#### List Progress By Course

```graphql
query {
  progressByCourse(course: "Integrated Science") {
    userName
    course
    taskId
    status
  }
}
```
