## User Progress

### APIs

- Add Progress
- Get User Progres By UserName And Course
- Get Progress Overview By Course
  - including User Progress and Course Content
- List Progress By Course

### Examples

#### Add Progress

```graphql
mutation {
  addUserProgress(
    progress: {
      userName: "Tywin Lannister"
      course: "Integrated Science"
      taskId: "0871dc9d56f"
      status: true
    }
  )
}
```

#### Get User Progres By UserName And Course

```graphql
query {
  userProgress(userName: "Tywin Lannister", course: "Integrated Science") {
    userName
    progress {
      taskId
      status
    }
  }
}
```

#### Get Progress Overview By Course

```graphql
query {
  progressOverview(course: "Integrated Science") {
    userProgress {
    ...UserProgressFields
    }
    courseInfo {
      ...CourseInfoFields
    }
    missions {
      ...MissionFields
    }
    targets {
      ...TargetFields
    }
  }
}

fragment UserProgressFields on UserProgress {
	userName
  progress {
    ...ProgressFields
  }
}

fragment ProgressFields on Progress {
  taskId
  status
}

fragment CourseInfoFields on CourseInfo {
  course
  instructor
  description
}

fragment TargetFields on Target {
  targetName
  objectives {
    ...ObjectiveFields
  }
}

fragment MissionFields on Mission {
  id
  name
  missionContent {
    ...MissionContentFields
  }
}

fragment MissionContentFields on MissionContent {
  ... on Task {
    ...TaskFields
  }
  ... on SubMission {
    id
    name
  }
}


fragment ObjectiveFields on Objective {
  objectiveId
  objectiveName
  tasks {
    ...TaskFields
  }
}

fragment TaskFields on Task {
  id
  name
}

```


#### List Progress By Course

```graphql
query {
  progressByCourse(course: "Integrated Science") {
    userName
    progress {
      taskId
      status
    }
  }
}
```
